# Changelog

## 0.3.1

* Fix possible XSS issue in attribute names and elements. Thanks for @gaearon
  and the React team for the coordinated fix! CVE-2018-6341

## 0.3.0

* Add support for [Context](https://reactjs.org/docs/context.html)!

## 0.2.3

* Fix render error when a vnode is `null`

## 0.2.2 (PREVIEW)

* _experimental_ support for `JSX Fragments`

## 0.2.1

* minor performance improvement when rendering large amounts of void elements

## 0.2.0

* **breaking:** rename renderer `html` propterty to `output`
* **breaking:** rename `renderToString` to `walkTree` as its output is now generic
* Make `Renderer` typings generic

## 0.1.1

* Fix `jsx` indentation
* Fix wrong typings path

## 0.1.0

* pre-release
