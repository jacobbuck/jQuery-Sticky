/*!
 * jQuery Sticky - Copyright (c) 2014 Jacob Buck
 * https://github.com/jacobbuck/jQuery-Sticky
 * Licensed under the terms of the MIT license.
 */

(function (factory) {
	// UMD yo!
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {

	// Cache the window, hack the planet!

	var $window  = $(window);

	// Hey, it's our plugin.

	$.fn.sticky = function () {

		return this.each(function () {

			// Cache our element and it's offset parent.

			var $element      = $(this);
			var $offsetParent = $element.offsetParent();

			// Wrapper for our element (acts as a placeholder).

			var $elementWrap  = $('<div>').insertBefore($element).append($element);

			// Where the action-magic happpens!

			function update () {

				// Check if our element is already stuck

				var stuck = $element.hasClass('stuck');

				// Using getBoundingClientRect as jQuery's offset/position isn't good enough.

				var elementWrapBCR = $elementWrap.get(0).getBoundingClientRect();
				var offsetParentBCR = $offsetParent.get(0).getBoundingClientRect();

				// Cache new SS values and set CSS once we're finished, to prevent DOM thrashing.

				var elementCSS = {};
				var elementWrapCSS = {};

				// Check if element should be stuck.
				// (1) The elements wrapper is beyond the top of the screen
				// (2) The elements offset parent within view
				// (3) The element is visible

				if (
					elementWrapBCR.top < 0 && // (1)
					(offsetParentBCR.top > 0 || offsetParentBCR.bottom > 0) && // (2)
					$element.is(':visible') // (3)
				) {

					// Stick our element if it isn't already

					if (! stuck) {

						$element.addClass('stuck').trigger('stuck');

						elementCSS.margin = 0;
						elementCSS.position = 'fixed';

						elementWrapCSS.margin = $element.css('margin');

					}

					// Position our element
					// (1) Keep our element inside it's offset parent
					// (2) And align it with it's wrapper

					elementCSS.top = Math.min(0, offsetParentBCR.bottom - $element.outerHeight()); // (1)
					elementCSS.left = elementWrapBCR.left; // (2)

					// Check if our element has changed size...

					if (! stuck || $element.outerWidth() != $elementWrap.width() || $element.outerHeight() != $elementWrap.height()) {

						// ... and keep the dimentions of the element and it's wrapper n*sync.

						elementCSS.width = $elementWrap.outerWidth();
						elementWrapCSS.height = $element.outerHeight();

					}

				} else if (stuck) {

					// Reset everything if our element is stuck and shouldn't be anymore.

					elementCSS = {
						width: '',
						margin: '',
						position: '',
						top: '',
						left: ''
					};

					elementWrapCSS = {
						height: '',
						margin: ''
					};

					$element.removeClass('stuck').trigger('unstuck');

				}

				// Set new CSS, as mentioned above.

				$element.css(elementCSS);
				$elementWrap.css(elementWrapCSS);

				// That's all folks!

			}

			// Bind some events.

			$window.on('load resize scroll touchmove', update);

			// Aaaannnnd... go!

			update();

		});

	};

	// Thanks for reading :)

}));