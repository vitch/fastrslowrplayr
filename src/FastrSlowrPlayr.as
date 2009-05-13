package  
{
	import com.kelvinluck.audio.MP3Player;

	import flash.display.Sprite;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.net.URLRequest;

	/**
	 * @author Kelvin Luck
	 */
	public class FastrSlowrPlayr extends Sprite 
	{
		
		private var id:int;
		private var mp3Player:MP3Player;
		private var hasMp3:Boolean;
		
		public function FastrSlowrPlayr()
		{
			addEventListener(Event.ENTER_FRAME, onFirstFramePassed);
		}
		
		private function onFirstFramePassed(event:Event):void
		{
			event.target.removeEventListener(event.type, arguments.callee);
			
			mp3Player = new MP3Player();
			mp3Player.addEventListener(MP3Player.MP3_LOADED, onMp3Loaded);
			
			id = loaderInfo.parameters.id;
			mp3Player.playbackSpeed = loaderInfo.parameters.playbackSpeed;
			mp3Player.volume = loaderInfo.parameters.volume;
			mp3Player.pan = loaderInfo.parameters.pan;
			mp3Player.loop = loaderInfo.parameters.loop == 'true';
			
			if (ExternalInterface.available) {
				ExternalInterface.addCallback('loadMp3', loadMp3);
				ExternalInterface.addCallback('playMp3', playMp3);
				ExternalInterface.addCallback('pauseMp3', pauseMp3);
				ExternalInterface.addCallback('stopMp3', stopMp3);
				ExternalInterface.addCallback('setPlaybackSpeed', setPlaybackSpeed);
				ExternalInterface.addCallback('setVolume', setVolume);
				ExternalInterface.addCallback('setPan', setPan);
				ExternalInterface.addCallback('getPlaybackSpeed', getPlaybackSpeed);
				ExternalInterface.addCallback('getVolume', getVolume);
				ExternalInterface.addCallback('getPan', getPan);
				ExternalInterface.call('FastrSlowrPlayr.flOnReady', id);
			}
		}

		// external interface methods...
		
		private function loadMp3(path:String):void
		{
			hasMp3 = true;
			mp3Player.stop();
			mp3Player.load(new URLRequest(path));
		}

		private function playMp3():void
		{
			if (!hasMp3) {
				throw new Error('Cannot play an mp3 when no file has been specified!');
			}
			// TODO: Logic to deal with when playMp3 is called before the mp3 has finished loading... Or move these tests into JS?
			mp3Player.play();
		}
		
		private function pauseMp3():void
		{
			if (!hasMp3) {
				throw new Error('Cannot pause an mp3 when no file has been specified!');
			}
			// TODO: Logic to deal with when pauseMp3 is called before the mp3 has finished loading... Or move these tests into JS?
			mp3Player.pause();
		}

		private function stopMp3():void
		{
			if (!hasMp3) {
				throw new Error('Cannot stop an mp3 when no file has been specified!');
			}
			// TODO: Logic to deal with when stopMp3 is called before the mp3 has finished loading... Or move these tests into JS?
			mp3Player.stop();
		}

		private function setPlaybackSpeed(value:Number):void
		{
			mp3Player.playbackSpeed = value;
		}

		private function setVolume(value:Number):void
		{
			mp3Player.volume = value;
		}

		private function setPan(value:Number):void
		{
			mp3Player.pan = value;
		}
		
		private function getPlaybackSpeed():Number
		{
			return mp3Player.playbackSpeed;
		}

		private function getVolume():Number
		{
			return mp3Player.volume;
		}

		private function getPan():Number
		{
			return mp3Player.pan;
		}

		// listeners
		
		private function onMp3Loaded(event:Event=null):void
		{
			ExternalInterface.call('FastrSlowrPlayr.flOnMP3Loaded', id);
		}
		
		// util methods
		
	}
}
