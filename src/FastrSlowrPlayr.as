package  
{
	import flash.net.URLRequest;
	import flash.events.SampleDataEvent;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;

	/**
	 * @author Kelvin Luck
	 */
	public class FastrSlowrPlayr extends Sprite 
	{
		
		private var id:int;
		private var s:Sound;
		private var playbackSound:Sound;
		private var sc:SoundChannel;
		
		public function FastrSlowrPlayr()
		{
			addEventListener(Event.ENTER_FRAME, onFirstFramePassed);
		}
		
		private function onFirstFramePassed(event:Event):void
		{
			event.target.removeEventListener(event.type, arguments.callee);
			
			id = loaderInfo.parameters.id;
			
			if (ExternalInterface.available) {
				ExternalInterface.addCallback('loadMp3', loadMp3);
				ExternalInterface.call('FastrSlowrPlayr.flOnReady', id);
			}
		}
		
		// external interface methods...
		
		private function loadMp3(path:String):void
		{
			clearActiveSound();
			s = new Sound();
			s.addEventListener(Event.COMPLETE, onSoundLoaded);
			s.load(new URLRequest(path));
		}
		
		// listeners
		
		private function onSoundLoaded(event:Event):void
		{
			ExternalInterface.call('FastrSlowrPlayr.flOnMP3Loaded', id);
		}
		
		private function onSampleData(event:SampleDataEvent):void
		{
		}
		
		private function onSoundComplete(event:Event):void
		{
		}
		
		// util methods
		
		private function clearActiveSound():void
		{
			if (sc) {
				sc.stop();
				sc.removeEventListener(Event.SOUND_COMPLETE, onSoundComplete);
				sc = null;
			}
			if (s) {
				s.removeEventListener(Event.COMPLETE, onSoundLoaded);
				s = null;
			}
			if (playbackSound) {
				playbackSound.removeEventListener(SampleDataEvent.SAMPLE_DATA, onSampleData);
				playbackSound = null;
			}
		}
	}
}
