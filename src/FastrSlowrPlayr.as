package  
{
	import com.kelvinluck.audio.MP3Player;

	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.SampleDataEvent;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
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
			// TODO: Logic to deal with when playMp3 is called before the mp3 has finished loading...
			mp3Player.play();
		}
		
		// listeners
		
		private function onMp3Loaded(event:Event=null):void
		{
			ExternalInterface.call('FastrSlowrPlayr.flOnMP3Loaded', id);
		}
		
		// util methods
		
	}
}
