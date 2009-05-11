/*
 * FastrSlowrPlayr
 * 
 * Copyright (c) 2009 Kelvin Luck
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.kelvinluck.com/projects/fastrslowrplayr
 *
 * Depends:
 *   SWFObject
 *   FastrSlowrPlayr.swf
 */

var FastrSlowrPlayr = new function(element, settings)
{

	var players = [];
	
	// util method to ensure that settins are a cloned object (rather than a reference) and that
	// default settings are overridden with passed in settings...
	var cloneSettings = function(s)
	{
		var cloned = {};
		for (prop in FastrSlowrPlayr.defaults)
		{
			cloned[prop] = s[prop] || FastrSlowrPlayr.defaults[prop];
		}
		return cloned;
	};

	// public API
	return {
		/**
		* Initialises a FastrSlowrPlayr instance.
		* 
		* @param settings Object An object containing a combination of the available options.
		* @option mp3File String
		* @option createIn String?[whatever SWFObject supports]
		* @option autoplay Boolean
		* @option loop Boolean
		* @option playbackSpeed Number
		* @option volume Number
		* @option pan Number
		* @return Object A reference to the generated FastrSlowrPlayr. This instance has methods available to 
		**/
		init : function(settings)
		{
			var player = new function()
			{
				var id = players.length;
				var s = cloneSettings(settings);
				return {
					id: id
				}
			};
			players.push(player);
			return player;
		},
		/**
		* Whether or not FastrSlowrPlayr is supported on this page (e.g. if the page has SWFObject loaded and
		* the user's browser has the correct version of the Flash Player available).
		* @return Boolean
		**/
		isAvailable : function()
		{
			return swfobject != null && swfobject.getFlashPlayerVersion().major > 9;
		}
	};
};

FastrSlowrPlayr.defaults = {
	volume:			1,
	pan:			1,
	autoplay:		false,
	playbackSpeed:	1,
	mp3File:		null,
	createIn:		'body',
	loop:			false
};
