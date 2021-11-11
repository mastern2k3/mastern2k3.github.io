---
title: Hugo Blog Makeover
date: 2021-11-10T20:12:57+02:00
keywords: [hugo, golang, dark, dark mode, dark theme, nord, nord theme, papermod, papermod-nord]
---

For a while I wanted to refactor my blog website.

I initially built it using [VuePress] because I liked Vue, but, the trouble of
maintaining the themes and underlying javascript quickly became more than I
bargained for.

Since I follow the golang ecosystem closely, I stumbled upon [Hugo].
It looked easy enough to get my head around for my basic needs, while remaining
extendable.

{{< figure src=hugo-logo-wide.svg width=50% align=center >}}


## PaperMod and PaperMod-Nord

Looking for some simple elegant themes I fell in love with the [PaperMod] theme.

A big requirement for me was a dark mode supported theme. I hated that my
website didn't support dark mode since I was constantly looking for that feature
in other websites.

> I highly recommend the [Dark Reader] extension. I does an awesome job of
> refitting bright websites with dark mode and reducing eye strain.

Converting the website to Hugo took a while but wasn't too complex, if anything
it forced me to better organize the content files I had.

Having so much fun with the refactor I was set to satiate my second passion, the
[Nord theme] color palette.

I forked PaperMod into [PaperMod-Nord] and re-fitted the colors to the Nord
palette.


[VuePress]: https://vuepress.vuejs.org/
[Hugo]: https://gohugo.io/
[PaperMod]: https://github.com/adityatelange/hugo-PaperMod
[PaperMod-Nord]: https://github.com/mastern2k3/hugo-PaperMod-Nord
[Dark Reader]: https://darkreader.org/
[Nord theme]: https://www.nordtheme.com/
