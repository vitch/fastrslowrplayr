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
				var $this = $(this);
				
				settings.elementId = '__fsp_' + i;
				$this.append('<div style="position:absolute; left:-2000px;"><div id="' + settings.elementId + '"></div></div>');
				
				var player = FastrSlowrPlayr.init(settings);
				
				
				var playButton = $('<a href="javascript:;">' + settings.labelPlay + '</a>')
					.bind(
						'click',
						function(event)
						{
							return false;
						}
					);
				
				$this.append(playButton);
					
				
				// set up event listeners to actually trigger "proper" jQuery events...
				player.addEventListener(
					FastrSlowrPlayr.EVENT_MP3_LOADED, 
					function(length)
					{
						$this.trigger(FastrSlowrPlayr.EVENT_MP3_LOADED, length);
					}
				);
				player.addEventListener(
					FastrSlowrPlayr.EVENT_MP3_COMPLETE, 
					function()
					{
						$this.trigger(FastrSlowrPlayr.EVENT_MP3_COMPLETE);
					}
				);
				player.addEventListener(
					FastrSlowrPlayr.EVENT_ID3_AVAILABLE, 
					function(id3Data)
					{
						if (id3Data) {
							$this.trigger(FastrSlowrPlayr.EVENT_ID3_AVAILABLE, id3Data);
							// it seems to be triggered multiple times - we only want the first one...
							player.removeEventListener(FastrSlowrPlayr.EVENT_ID3_AVAILABLE);
							// TODO: Reinstate the listener if load called...
						}
					}
				);
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
		loop:			false,
		/* localisation strings */
		labelPlay:		'Play',
		labelPause:		'Pause',
		labelStop:		'Stop'
	};

})(jQuery);
