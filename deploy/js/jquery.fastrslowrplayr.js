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
		var i = 0;
		return this.each(
			function()
			{
				if (this.id == null) { // TODO: test this path works when element doesn't have id... And test that this.id works crossbrowser...
					this.id = 'fsp_' + i;
				}
				settings.elementId = this.id;
				var player = FastrSlowrPlayr.init(settings);
				i++;
			}
		);
	}
	

	$.fn.fastrSlowrPlayr.defaults = {
		volume:			1,
		pan:			0,
		autoplay:		false,
		playbackSpeed:	1,
		mp3File:		null,
		swfPath:		'../swf/FastrSlowrPlayr.swf',
		loop:			false
	};

})(jQuery);
