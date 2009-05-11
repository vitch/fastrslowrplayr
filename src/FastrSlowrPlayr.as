package  
{
	import flash.display.Sprite;
	import flash.events.Event;

	/**
	 * @author Kelvin Luck
	 */
	public class FastrSlowrPlayr extends Sprite 
	{
		
		public function FastrSlowrPlayr()
		{
			addEventListener(Event.ENTER_FRAME, onFirstFramePassed);
		}
		
		private function onFirstFramePassed(event:Event):void
		{
			event.target.removeEventListener(event.type, arguments.callee);
			trace ('READY TO GO!');
		}
	}
}
