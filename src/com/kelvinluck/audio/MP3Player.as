package com.kelvinluck.audio 
{
	import flash.media.ID3Info;	
	import flash.media.SoundTransform;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import flash.events.SampleDataEvent;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;		

	/**
	 * @author Kelvin Luck
	 */
	public class MP3Player extends EventDispatcher
	{
		
		public static const MP3_LOADED:String = 'mp3Loaded';
		public static const ID3_AVAILABLE:String = 'mp3Available';
		
		private static const BYTES_PER_CALLBACK:int = 4096; // Should be >= 2048 && <= 8192

		private var _playbackSpeed:Number = 1;

		public function get playbackSpeed():Number
		{
			return _playbackSpeed;
		}
		public function set playbackSpeed(value:Number):void
		{
			if (value < 0) {
				throw new Error('Playback speed must be positive!');
			}
			_playbackSpeed = value;
		}
		
		/**
		 * @return The position of the playhead as a percentage of the total length of
		 * the loaded mp3 (0 - 1).
		 */
		public function get playheadPosition():Number
		{
			return _phase / _numSamples;
		}
		public function set playheadPosition(value:Number):void
		{
			_phase = value * _numSamples;
		}

		public var loop:Boolean;
		
		private var _volume:Number;
		public function get volume():Number
		{
			return _volume;
		}
		public function set volume(value:Number):void
		{
			_volume = value;
			updateSoundTransform();
		}

		private var _pan:Number;
		public function get pan():Number
		{
			return _pan;
		}
		public function set pan(value:Number):void
		{
			_pan = value;
			updateSoundTransform();
		}
		
		public function get id3Info():ID3Info
		{
			return _mp3.id3;
		}

		private var _mp3:Sound;
		private var _dynamicSound:Sound;
		private var _channel:SoundChannel;

		private var _phase:Number;
		private var _numSamples:int;
		
		private var _soundTransform:SoundTransform;	

		public function MP3Player()
		{
		}

		public function load(request:URLRequest):void
		{
			_mp3 = new Sound();
			_mp3.addEventListener(Event.COMPLETE, onMp3Loaded);
			_mp3.addEventListener(Event.ID3, onId3Loaded);
			_mp3.load(request);
		}

		public function playLoadedSound(s:Sound):void
		{
			_mp3 = s;
			play();
		}

		public function play():void
		{
			stop();
			_dynamicSound = new Sound();
			_dynamicSound.addEventListener(SampleDataEvent.SAMPLE_DATA, onSampleData);
			
			_numSamples = int(_mp3.length * 44.1);
			
			_phase = 0;
			_channel = _dynamicSound.play();
			_channel.soundTransform = _soundTransform;
			_channel.addEventListener(Event.SOUND_COMPLETE, onSoundFinished);
		}
		
		public function pause():void
		{
			// TODO: Check this actually works!
			_channel.stop();
		}
		
		// TODO: unpause??

		public function stop():void
		{
			if (_dynamicSound) {
				_dynamicSound.removeEventListener(SampleDataEvent.SAMPLE_DATA, onSampleData);
				_channel.removeEventListener(Event.SOUND_COMPLETE, onSoundFinished);
				_dynamicSound = null;
				_channel = null;
			}
		}
		
		private function updateSoundTransform():void
		{
			_soundTransform = new SoundTransform(_volume, _pan);
			if (_channel) {
				_channel.soundTransform = _soundTransform;
			}
		}

		private function onMp3Loaded(event:Event):void
		{
			dispatchEvent(new Event(MP3Player.MP3_LOADED));
		}
		
		private function onId3Loaded(event:Event):void
		{
			dispatchEvent(new Event(MP3Player.ID3_AVAILABLE));
		}

		private function onSoundFinished(event:Event):void
		{
			_channel.removeEventListener(Event.SOUND_COMPLETE, onSoundFinished);
			if (loop) {
				_channel = _dynamicSound.play();
				_channel.soundTransform = _soundTransform;
				_channel.addEventListener(Event.SOUND_COMPLETE, onSoundFinished);
			}
		}

		private function onSampleData( event:SampleDataEvent ):void
		{
			var l:Number;
			var r:Number;
			var p:int;
			
			
			var loadedSamples:ByteArray = new ByteArray();
			var startPosition:int = int(_phase);
			_mp3.extract(loadedSamples, BYTES_PER_CALLBACK * _playbackSpeed, startPosition);
			loadedSamples.position = 0;
			
			while (loadedSamples.bytesAvailable > 0) {
				
				p = int(_phase - startPosition) * 8;
				
				if (p < loadedSamples.length - 8 && event.data.length <= BYTES_PER_CALLBACK * 8) {
					
					loadedSamples.position = p;
					
					l = loadedSamples.readFloat(); 
					r = loadedSamples.readFloat(); 
				
					event.data.writeFloat(l); 
					event.data.writeFloat(r);
					 
				} else {
					loadedSamples.position = loadedSamples.length;
				}
				
				_phase += _playbackSpeed;
				
				// loop
				if (_phase >= _numSamples) {
					if (loop) {
						_phase -= _numSamples;
					}
					break;
				}
			}
		}
	}
}