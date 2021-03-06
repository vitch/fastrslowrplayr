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
	
	// used to hold our privateAPI closures...
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
		* @option mp3File String The path to the mp3 file you want to load (absolute or relative to the .swf file).
		* @option swfPath String The path to the FastrSlowrPlayr.swf file (absolute or relative to this javascript file).
		* @option elementId String Specifies the id of the HTML element (containing your alternative content) you would 
		* like to have replaced by your FastrSlowrPlayr.
		* @option autoplay Boolean Whether the mp3 should start playing automatically when it's loaded.
		* @option loop Boolean Whether the mp3 should loop once it's finished playing.
		* @option playbackSpeed Number The speed playback should be at. Any positive number is valid, 1 = normal speed.
		* @option volume Number The volume the mp3 should be played at - between 0 and 1.
		* @option pan Number How the mp3 should be panned. A number from -1 (fully left) to +1 (fully right). 0 is centrally panned.
		* @return Object A reference to the generated FastrSlowrPlayr. This instance has methods available to load, start, stop, 
		* pause, etc the mp3
		**/
		init : function(settings)
		{
			var player = new function()
			{
				var id = players.length;
				var s = cloneSettings(settings);

				var flashvars = {
					id : id,
					playbackSpeed : s.playbackSpeed,
					loop : s.loop,
					volume : s.volume,
					pan : s.pan
				};

				var doOnLoad = [];
				
				var eventListeners = {};
				
				var dispatchEvent = function(type, args)
				{
					var listeners = eventListeners[type];
					if (listeners && listeners.length) {
						for (var i=0; i<listeners.length; i++) {
							if (args) {
								listeners[i].apply(this, args);
							} else {
								listeners[i].apply(this);
							}
						}
					}
				}

				// calls a method on the swf... If the swf isn't available yet then queues it to be done on load...
				var callOnSwf = function(func, arg)
				{
					if (swf) {
						if (arg != null) {
							swf[func](arg);
						} else {
							swf[func]();
						}
					} else {
						doOnLoad.push({func:func, arg:arg});
					}
				}

				swfobject.embedSWF(s.swfPath, s.elementId, "1", "1", "10.0.0", {}, flashvars);
				var swf;
				
				// create our private API for use from the fl* callbacks methods from flash...
				var privateAPI = {
					flOnReady : function()
					{
						swf = swfobject.getObjectById(s.elementId);
						// call any functions that were queued while we were loading...
						for (var i=0; i<doOnLoad.length; i++) {
							callOnSwf(doOnLoad[i].func, doOnLoad[i].arg);
						}
						// if an mp3 file was specified then we load it...
						if (s.mp3File) {
							swf.loadMp3(s.mp3File);
						}
					},
					flOnMP3Loaded : function(length)
					{
						dispatchEvent(FastrSlowrPlayr.EVENT_MP3_LOADED, [length]);
						if (s.autoplay) {
							swf.playMp3();
						}
					},
					flOnID3Available : function(id3Data)
					{
						dispatchEvent(FastrSlowrPlayr.EVENT_ID3_AVAILABLE, [id3Data]);
					},
					flOnMP3Complete : function()
					{
						dispatchEvent(FastrSlowrPlayr.EVENT_MP3_COMPLETE);
					},
					flOnMP3PlayStateChange : function()
					{
						dispatchEvent(FastrSlowrPlayr.PLAY_STATE_CHANGE, [swf.getIsPlaying()]);
					}
				};
				// and add the private API to the array for later retrieval by id...
				players.push(privateAPI);
				
				// return our public API for use by 
				return {
					id :				id,
					setVolume :			function(value) 
										{
											s.volume = value;
											callOnSwf('setVolume', value);
										},
					setPan :			function(value) 
										{
											s.pan = value;
											callOnSwf('setPan', value);
										},
					setAutoplay :		function(value)
										{
											s.autoplay = value;
										},
					setPlaybackSpeed :	function(value) 
										{
											s.playbackSpeed = value;
											callOnSwf('setPlaybackSpeed', value);
										},
					setPlayheadPosition : function(value)
										{
											callOnSwf('setPlayheadPosition', value);
										},
					getIsPlaying :		function()
										{
											return swf ? swf.getIsPlaying() : false;
										},
					getVolume :			function()
										{
											if (swf) {
												return swf.getVolume();
											}
											return s.volume;
										},
					getPan :			function()
										{
											if (swf) {
												return swf.getPan();
											}
											return s.pan;
										},
					getAutoplay :		function()
										{
											return s.autoplay;
										},
					getPlaybackSpeed :	function()
										{
											if (swf) {
												return swf.getPlaybackSpeed();
											}
											return s.playbackSpeed;
										},					
					/**
					 * @return The position of the playhead as a percentage of the total length of
					 * the loaded mp3 (0 - 1).
					 */
					getPlayheadPosition : function()
										{
											if (swf) {
												return swf.getPlayheadPosition() || 0;
											}
											return 0;
										},
					load :				function(mp3File)
										{
											s.mp3File = mp3File;
											if (swf) {
												swf.loadMp3(mp3File);
											}
										},
					play :				function()
										{
											callOnSwf('playMp3', null);
										},
					pause :				function()
										{
											callOnSwf('pauseMp3', null);
										},
					stop :				function()
										{
											callOnSwf('stopMp3', null);
										},
					/**
					* Adds a listener for the given type of events.
					* The events that can be listened for are all defined by FastrSlowrPlayr.EVENT_* "constants"
					* @param eventName  String The type of event you want to listen to.
					* @param callback Function The function that you want to call when the event is fired.
					**/
					addEventListener :	function(eventName, callback)
										{
											if (!eventListeners[eventName]) {
												eventListeners[eventName] = [];
											}
											eventListeners[eventName].push(callback);
										},
					/**
					* Removes an event listener or all listeners for a given event type.
					* @param eventName String The typr of event you want to remove a listener for.
					* @param callback Function The specific listener you want to remove. If you don't pass this parameter
					* then all listeners for this event type will be removed.
					**/
					removeEventListener : function(eventName, callback)
										{
											if (callback == undefined) {
												eventListeners[eventName] = []
											} else {
												var registeredListeners = eventListeners[eventName];
												if (registeredListeners.length) {
													for (var i=0; i<registeredListeners.length; i++) {
														var listener = registeredListeners[i];
														if (listener == callback) {
															registeredListeners.splice(i, 1);
															// TODO: verify this actually works!
															break;
														}
													}
												}
											}
										}
				}
			};
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
		},

		// The following properties are constants for each of the event names that can be listened too. This
		// is better than just using "magic strings" as it reduces the chances of mis-spelling etc...
		EVENT_ID3_AVAILABLE : 'id3Available',
		EVENT_MP3_LOADED : 'mp3Loaded',
		EVENT_MP3_COMPLETE : 'mp3Complete',
		PLAY_STATE_CHANGE : 'playStateChange',

		// The following methods should not be called directly. They are used for callbacks from the flash file.
		// Unfortunately, because of the nature of the ExternalInterface callbacks from Flash we can't make these
		// methods private via code so instead we prefix them all with "fl" and document that they should never be
		// called directly.

		flOnReady : function(id)
		{
			players[id].flOnReady();
		},
		flOnMP3Loaded : function(id, length)
		{
			players[id].flOnMP3Loaded(length);
		},
		flOnID3Available : function(id, id3Data)
		{
			players[id].flOnID3Available(id3Data);
		},
		flOnMP3Complete : function(id)
		{
			players[id].flOnMP3Complete();
		},
		flOnMP3PlayStateChange : function(id)
		{
			players[id].flOnMP3PlayStateChange();
		}
	};
};

FastrSlowrPlayr.defaults = {
	volume:			1,
	pan:			0,
	autoplay:		false,
	playbackSpeed:	1,
	mp3File:		null,
	swfPath:		'../swf/FastrSlowrPlayr.swf',
	elementId:		'body',
	loop:			false
};
