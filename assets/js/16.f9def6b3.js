(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{239:function(t,a,e){},240:function(t,a,e){"use strict";var n=e(239);e.n(n).a},247:function(t,a,e){"use strict";e.r(a);e(139);var n={computed:{sortedPages:function(){return this.$pagination.pages.sort(function(t,a){var e=new Date(t.frontmatter.date||t.lastUpdated);return new Date(a.frontmatter.date||a.lastUpdated)-e})}}},r=(e(240),e(42)),i=Object(r.a)(n,function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("ul",{staticClass:"card-list",attrs:{id:"default-layout"}},t._l(t.sortedPages,function(a){return e("li",[e("div",{staticClass:"card",attrs:{tag:"div"},on:{click:function(e){return t.$router.push(a.path)}}},[e("router-link",{staticClass:"page-link",attrs:{to:a.path}},[t._v(t._s(a.title))]),t._v(" "),e("div",{staticClass:"card-footer"},[t._v(t._s(a.frontmatter.date&&new Date(a.frontmatter.date).toLocaleString()||a.lastUpdated))]),t._v(" "),e("ul",t._l(a.headers,function(a){return e("li",[t._v(t._s(a.title))])}),0)],1)])}),0),t._v(" "),e("div",{attrs:{id:"pagination"}},[t.$pagination.hasPrev?e("router-link",{attrs:{to:t.$pagination.prevLink}},[t._v("Prev")]):t._e(),t._v(" "),t.$pagination.hasNext?e("router-link",{attrs:{to:t.$pagination.nextLink}},[t._v("Next")]):t._e()],1)])},[],!1,null,null,null);a.default=i.exports}}]);