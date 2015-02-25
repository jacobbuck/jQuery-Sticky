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

There are also events for when your element sticks or unsticks:

```js
$('.whatever').on('stick', ...);
$('.whatever').on('unstick', ...);
```

And when you're done:

```js
$('.whatever').sticky('destory')
```

Compatibility
-------------

Works on all major browsers jQuery supports. Sticky also requires `requestAnimationFrame` to work properly, so you might need a [polyfill](https://gist.github.com/paulirish/1579671) for older browsers.
