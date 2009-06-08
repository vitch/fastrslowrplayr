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
					.append('<div class="fsp-flash"><div id="' + settings.elementId + '"></div></div>')
					.addClass('ui-widget ui-widget-content fsp-container')
					;
				
				var player = FastrSlowrPlayr.init(settings);
				
				if (settings.showPlayPauseButton) {
					var iconDiv = $('<div>' + settings.labelPlay + '</div>')
						.addClass('ui-icon ui-icon-play');
					var playButton = $('<a href="javascript:;"></a>')
						.addClass('fsp-button ui-state-default')
						.attr('title', settings.labelPlay)
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
								player[player.getIsPlaying() ? 'pause' : 'play']();
							}
						);
					playButton.append(iconDiv);
					
					$this.append(playButton);
				}
				if (settings.showStopButton) {
					var stopButton = $('<a href="javascript:;"><div class="ui-icon ui-icon-stop">' + settings.labelStop + '</div></a>')
						.addClass('fsp-button ui-state-default')
						.attr('title', settings.labelStop)
						.bind(
							'click',
							function(event)
							{
								player.stop();
							}
						)
						.hover(
							function()
							{
								stopButton.addClass('ui-state-hover');
							},
							function()
							{
								stopButton.removeClass('ui-state-hover');
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
				player.addEventListener(
					FastrSlowrPlayr.PLAY_STATE_CHANGE,
					function(isPlaying)
					{
						if (playButton) {
							if (isPlaying) {
								playButton.attr('title', settings.labelPause);
								iconDiv
									.text(settings.labelPause)
									.removeClass('ui-icon-play')
									.addClass('ui-icon-pause');
							} else {
								playButton.attr('title', settings.labelPlay);
								iconDiv
									.text(settings.labelPlay)
									.removeClass('ui-icon-pause')
									.addClass('ui-icon-play');
							}
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
