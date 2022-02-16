---
title: Partial GraphQL models with pydantic
tags: [graphql, pydantic, python]
date: 2022-02-05T01:09:28+02:00
---

I was recently building a client for a GraphQL service in python and was faced
with the problem of modeling the message types.

Since those are essentially json models, I turned to [pydantic] with which I had
good experience in the past.

Although in theory this should be relatively simple, I encountered some annoying
problems right off the bat.

Lets take [trevorblades' country info GraphQL API] for example.

Its schema type for `Country` looks like this:

```
type Country {
    code: ID!
    name: String!
    native: String!
    phone: String!
    capital: String
    currency: String
    emoji: String!
}
```

> I've omitted attributes leading to other types to keep this example brief but
> know that this API also has info on languages, continents and states!

As an example, this simple query returns the following json:

```python
from requests import post

url = "https://countries.trevorblades.com"

query = """
{
  country(code: "LV") {
    code
    name
    native
    phone
    capital
    currency
    emoji
  }
}
"""

post(url, json={"query": query}).json()

# Returns:
# {'data': {'country': {'code': 'LV', 'name': 'Latvia', 'native': 'Latvija',
# 'phone': '371', 'capital': 'Riga', 'currency': 'EUR', 'emoji': '🇱🇻'}}}
```

If we follow the schema type our pydantic class will look something like this:

```python
from typing import Optional
from pydantic import BaseModel

class Country(BaseModel):
    code: str
    name: str
    native: str
    phone: str
    capital: Optional[str]
    currency: Optional[str]
    emoji: str
```

Which works great, using it to parse the response works perfectly:

```python
res = post(url, json={"query": query}).json()

Country.parse_obj(res["data"]["country"])

# Returns:
# code='LV' name='Latvia' native='Latvija' phone='371' capital='Riga'
# currency='EUR' emoji='🇱🇻'
```

But, what if we want to query a small set of `Country`'s attributes?

```python
query = """
{
  country(code: "LV") {
    code
    name
  }
}
"""

res = post(url, json={"query": query}).json()

Country.parse_obj(res["data"]["country"])

# Throws:
# pydantic.error_wrappers.ValidationError: 3 validation errors for Country
# native
#   field required (type=value_error.missing)
# phone
#   field required (type=value_error.missing)
# emoji
#   field required (type=value_error.missing)
```

pydantic doesn't like the fact that some required attributes are missing.

This leaves us with some depressing "solutions" going forward:

1. Force querying all attributes whenever a `Country` is accessed.

    Resulting in needless data being fetched.

2. Create a model for each query, omitting unused required attributes.

    Resulting in an infinite amount of pydantic model classes which is
    impossible to keep track of.

3. Make all attributes `Optional` to avoid parsing errors.

    Which results in a misleading model claiming all attributes are optional.

On my project we started working with option 3 and marked all attributes as
optional.

That proved to be hazardous very quickly because:

1. The IDE was showing warnings claiming required attributes being accessed
    might be `None` all the time, which led to:
2. Developers failing to take into account legitimate possible `None` warnings
    assuming these are due to the loose models.

Troubled by these hazards I started researching a better option and landed on a
good compromise.


## The solution

Since the big issue around the 3rd option (all optional) is the misleading model
effecting the IDE, I started looking for a way to implicitly allow for partial
creation of the model.

I ended up with this:

```python
from typing import Union, Tuple, Dict, Any, get_origin, get_args
from pydantic import BaseModel
from pydantic.fields import DeferredType
from pydantic.main import ModelMetaclass
from pydantic.generics import GenericModel

class ImplicitOptional(ModelMetaclass):
    def __new__(cls, name: str, bases: Tuple[type], namespaces: Dict[str, Any], **kwargs):
        annotations: dict = namespaces.get("__annotations__", {})

        for base in bases:
            for base_ in base.__mro__:
                if base_ is BaseModel or base_ is GenericModel:
                    break

                annotations = {**getattr(base_, "__annotations__", {}), **annotations}

        for field, annotation in annotations.items():

            if field.startswith("__"):
                continue

            if get_origin(annotation) is Union and type(None) in get_args(annotation):
                continue

            if isinstance(annotation, DeferredType):
                continue

            annotations[field] = Optional[annotation]

        namespaces["__annotations__"] = annotations

        return super().__new__(cls, name, bases, namespaces, **kwargs)

class GraphQLBaseModel(BaseModel, metaclass=ImplicitOptional):
    pass
```

> This solution is based on the [solution proposed here] with some extra
> considerations for generic classes and other complex cases that were not
> covered.

What this voodoo python magic class does essentially is convert all non-optional
fields declared in your models to optional by inheriting from `GraphQLBaseModel`
instead of `BaseModel`.

This allows the IDE to continue type checking a more accurate model, displaying
relevant warnings, while parsing a partial model without errors at runtime.

So when implementing for our example:

```python
class Country(GraphQLBaseModel):
    code: str
    name: str
    native: str
    phone: str
    capital: Optional[str]
    currency: Optional[str]
    emoji: str

query = """
{
  country(code: "LV") {
    code
    name
  }
}
"""

res = post(url, json={"query": query}).json()

Country.parse_obj(res["data"]["country"])

# Returns
# code='LV' name='Latvia' native=None phone=None capital=None currency=None
# emoji=None
```

It is important to mention, although somewhat preferable to option 3, this
solution still comes with a sharp edge.

When encountering a `None` value in a required field, you could safely deduce
that it wasn't mentioned in the query. On the other hand, a `None` value in an
optional field is ambiguous and could mean either that data was `None` or that
the field was not mentioned in the query.


[pydantic]: https://github.com/samuelcolvin/pydantic/
[trevorblades' country info GraphQL API]: https://github.com/trevorblades/countries
[solution proposed here]: https://stackoverflow.com/a/67733889/1866480
