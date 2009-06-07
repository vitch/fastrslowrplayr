/*
 * FastrSlowrPlayrUI
 * 
 * A jQuery plugin which wraps FastrSlowrPlayr and creates a default UI (skinnable using
 * the jQuery UI framework)
 *
 * Copyright (c) 2009 Kelvin Luck
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.kelvinluck.com/projects/fastrslowrplayr
 *
 * Depends:
 *   fastrSlowrPlayr.js
 *   SWFObject
 *   FastrSlowrPlayr.swf 
 */
(function($) {

	$.fn.fastrSlowrPlayr = function(settings)
	{
		var settings = $.extend({}, $.fn.fastrSlowrPlayr.defaults, settings);

		return this.each(
			function()
			{
				
			}
		);
	}
	

	$.fn.fastrSlowrPlayr.defaults = {
	};

})(jQuery);
