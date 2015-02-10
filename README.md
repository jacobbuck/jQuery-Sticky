Sticky
======

Yet another `position: sticky` jQuery plugin.

Usage
-----

```js
$('.whatever').sticky()
```

If you need to manually update the position:

```js
$('.whatever').sticky('update')
```

And when you're done:

```js
$('.whatever').sticky('destory')
```

Compatibility
-------------

Works on all major browsers jQuery supports. Sticky also requires `requestAnimationFrame` to work properly, so you might need a [polyfill](http://paulirish.com/2011/requestanimationframe-for-smart-animating/) for older browsers.
