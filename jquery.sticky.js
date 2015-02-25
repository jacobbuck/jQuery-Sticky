/*!
 * Sticky - Copyright (c) 2015 Jacob Buck
 * https://github.com/jacobbuck/sticky
 * Licensed under the terms of the MIT license.
 */
(function (factory) {
	// UMD yo!
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(window.jQuery);
	}
}(function ($) {
	'use strict';

	// Constants

	var STUCK_CLASSNAME = 'stuck';

	// Utilities

	function toNumber (num) {
		return isFinite(num = parseFloat(num)) ? num : 0;
	}

	function throttle (fn, context) {
		var timer = false;
		return function () {
			var c = context || this;
			var a = arguments;
			if (false === timer) {
				timer = window.requestAnimationFrame(function () {
					fn.apply(c, a);
					timer = false;
				});
			}
		};
	}

	// Sticky

	function Sticky (element) {
		// Cache our element and it's offset parent.
		this.e = element;
		this.o = element.offsetParent();

		// Wrapper for our element (acts as a placeholder).
		this.w = $('<div>').insertBefore(element).append(element);

		// Store the elements inherit position style
		this.p = element.css('position');

		// Throttle update method
		this.update = throttle(this.update, this);

		// Bind some events.
		$(window).on('load resize scroll touchmove', this.update);

		this.update();
	}

	Sticky.prototype = {
		stuck: false,

		update: function () {
			var element = this.e;
			var oparent = this.o;
			var wrapper = this.w;

			// Using getBoundingClientRect as jQuery's offset/position isn't good enough.
			var wrapperBCR = wrapper.get(0).getBoundingClientRect();
			var oparentBCR = oparent.get(0).getBoundingClientRect();

			// Get some element styles
			var elementMarginTop = toNumber(element.css('margin-top'));
			var elementMarginBottom = toNumber(element.css('margin-bottom'));

			// Update the elements inherit position style
			if (!this.stuck) {
				this.p = element.css('position');
			}

			// Check if element should be stuck.
			// (1) The element's wrapper is beyond the top of the screen
			// (2) The element's offset parent within view
			// (3) The element is visible
			if (
				wrapperBCR.top + elementMarginTop < 0 && // (1)
				(oparentBCR.top + elementMarginTop > 0 ||
					oparentBCR.bottom + elementMarginBottom > 0) && // (2)
				element.is(':visible') // (3)
			) {
				// Get some more element styles
				var elementOuterHeight = element.outerHeight(true);
				var elementOuterWidth = element.outerWidth(true);

				// Cache new CSS values and set CSS once we're finished, to prevent DOM thrashing.
				var elementCSS = {};
				var wrapperCSS = {};

				// Stick our element if it isn't already
				if (!this.stuck) {
					this.stuck = true;
					element.addClass(STUCK_CLASSNAME).trigger('stick');
					elementCSS.position = 'fixed';
				}

				// Keep our element inside its offset parent
				elementCSS.top = Math.min(-elementMarginTop, oparentBCR.bottom - elementOuterHeight);

				// And align it with its wrapper
				elementCSS.left = wrapperBCR.left;

				// Check if our element has changed size...
				if (!this.stuck ||
					elementOuterWidth != wrapper.width() ||
					elementOuterHeight != wrapper.height()
				) {
					// ... and keep the dimentions of the element and its wrapper n*sync.
					elementCSS.width = wrapper.width();
					if (!/absolute|fixed/.test(this.p)) {
						wrapperCSS.height = elementOuterHeight;
					}
				}

				// Set new CSS, as mentioned above.
				element.css(elementCSS);
				wrapper.css(wrapperCSS);

			} else if (this.stuck) {
				// Reset everything if our element is stuck and shouldn't be anymore.
				this.reset();
			}

			// That's all folks!
		},

		reset: function () {
			var element = this.e;
			var wrapper = this.w;

			this.stuck = false;

			wrapper.css({
				height: '',
				margin: ''
			});

			element.css({
				width: '',
				margin: '',
				position: '',
				top: '',
				left: ''
			})
			.removeClass(STUCK_CLASSNAME)
			.trigger('unstick');
		},

		destroy: function () {
			var element = this.e;
			var wrapper = this.w;

			// Reset everything
			this.reset();

			// Remove element wrapper
			wrapper.replaceWith(element);

			// Unbind events
			$(window).off('load resize scroll touchmove', this.update);

			// Remove from jQuery
			$.removeData(element, 'sticky');
		}
	};

	// Simple jQuery bridge
	$.fn.extend({
		sticky: function (options) {
			return this.each(function () {
				var element = $(this);

				if (typeof options == 'string') {
					var instance = element.data('sticky');

					if (instance instanceof Sticky && $.isFunction(instance[options])) {
						instance[options]();
					}
				} else {
					$.data(element, 'sticky', new Sticky(element));
				}
			});
		}
	});

	return Sticky;
}));
