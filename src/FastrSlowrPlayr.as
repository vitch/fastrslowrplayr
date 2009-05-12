package  
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.external.ExternalInterface;

	/**
	 * @author Kelvin Luck
	 */
	public class FastrSlowrPlayr extends Sprite 
	{
		
		private var id:int;
		
		public function FastrSlowrPlayr()
		{
			addEventListener(Event.ENTER_FRAME, onFirstFramePassed);
		}
		
		private function onFirstFramePassed(event:Event):void
		{
			event.target.removeEventListener(event.type, arguments.callee);
			
			id = loaderInfo.parameters.id;
			
			if (ExternalInterface.available) {
				ExternalInterface.call('FastrSlowrPlayr.flOnReady', id);
			}
		}
		
	}
}
