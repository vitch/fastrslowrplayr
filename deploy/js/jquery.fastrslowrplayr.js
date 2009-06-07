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
				$this
					.append('<div style="position:absolute; left:-2000px;"><div id="' + settings.elementId + '"></div></div>')
					.addClass('ui-widget ui-widget-content')
					;
				
				var player = FastrSlowrPlayr.init(settings);
				
				if (settings.showPlayPauseButton) {
					var iconDiv = $('<div>' + settings.labelPlay + '</div>')
						.addClass('fsp-button ui-icon ui-icon-play');
					var playButton = $('<a href="javascript:;"></a>')
						.addClass('ui-state-default')
						.hover(
							function()
							{
								playButton.addClass('ui-state-hover');
							},
							function()
							{
								playButton.removeClass('ui-state-hover');
							}
						)
						.bind(
							'click',
							function(event)
							{
								if (player.getIsPlaying()) {
									player.pause();
									playButton.attr('title', settings.labelPlay);
									iconDiv
										.text(settings.labelPlay)
										.removeClass('ui-icon-pause')
										.addClass('ui-icon-play');
								} else {
									player.play();
									playButton.attr('title', settings.labelPause);
									iconDiv
										.text(settings.labelPause)
										.removeClass('ui-icon-play')
										.addClass('ui-icon-pause');
								}
							}
						);
					playButton.append(iconDiv);
					
					$this.append(playButton);
				}
				if (settings.showStopButton) {
					var stopButton = $('<a href="javascript:;">' + settings.labelStop + '</a>')
						.bind(
							'click',
							function(event)
							{
								player.stop();
							}
						);
					
					$this.append(stopButton);
				}
					
				
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
		/* FastrSlowrPlayr settings */
		volume:			1,
		pan:			0,
		autoplay:		false,
		playbackSpeed:	1,
		mp3File:		null,
		swfPath:		'../swf/FastrSlowrPlayr.swf',
		loop:			false,
		/* settings to control which UI features are displayed */
		showPlayPauseButton: true,
		showStopButton:	true,
		showProgressBar: true,
		showSongInfo:	false,
		showLoadingBar:	true,
		/* localisation strings */
		labelPlay:		'Play',
		labelPause:		'Pause',
		labelStop:		'Stop'
	};

})(jQuery);
