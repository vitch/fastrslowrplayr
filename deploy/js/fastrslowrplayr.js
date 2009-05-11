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

	// public API
	return {
		/**
		* Initialises a FastrSlowrPlayr instance.
		* 
		* @param settings Object An object containing a combination of the available options.
		* @option volume Number
		* @option pan Number
		* @option autoplay Boolean
		* @option playbackSpeed Number
		* @option mp3File String
		* @option createIn String?[whatever SWFObject supports]
		* @option loop Boolean
		* @return Object A reference to the generated FastrSlowrPlayr. This instance has methods available to 
		**/
		init : function(settings)
		{
			
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
	}
}

FastrSlowrPlayr.defaults = {
	volume:			1,
	pan:			1,
	autoplay:		false,
	playbackSpeed:	1,
	mp3File:		null,
	createIn:		'body',
	loop:			false
}
