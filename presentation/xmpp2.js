var current_page = 0;

$(document).ready(function () {

		oArgs = {
			httpbase:'/http-bind/',
			timerval: 2000,
			scope: this
		};
		
		jabberConnection = new JSJaCHttpBindingConnection(oArgs);

		jabberConnection.registerHandler('iq', handleIq);
		jabberConnection.registerHandler('message_in', handleMessageIn);
		jabberConnection.registerHandler('presence', handlePresence);
		jabberConnection.registerHandler('onConnect', handleConnected);
		jabberConnection.registerHandler('packet_in', handlePacketIn);
		jabberConnection.registerHandler('status_changed', handleStatusChanged);

		oArgs = new Object();
		oArgs.domain = 'logoslogic.com';
		oArgs.username = 'isaacueca';
		oArgs.resource = '';
		oArgs.pass = 'cigano';
		oArgs.register = false;
		oArgs.port = 5222;
		oArgs.authtype = 'sasl';

		jabberConnection.connect(oArgs);
		
		function handleMessageIn2(message, me) {
			console.log('handleMessageIn');
		}
		
		function handlePresence(presence, me) {
			console.log('handlePresence');
		}
		
		function handlePacketIn(packet, me){
			console.log('handlePacketIn');
		}
		
		function handleIq(iq, me){
			console.log('handleIq');
		}
		
		
		function handleStatusChanged(status, me) {
			console.log('handleStatusChanged');
		}
		
		function handleConnected(me) {
			console.log('handleConnected');
			
			var presence = new JSJaCPresence();
			jabberConnection.send(presence);

		//	me.jabberConnection.send(aPresence);
			
			var v = new JSJaCLeaf();
			
			v.setFrom('isaacueca@logoslogic.com');
			v.setTo('pubsub.logoslogic.com');
			v.setType('set');
			v.setID('2840:subscribenode');
		
			v.setPubsub('http://jabber.org/protocol/pubsub','presentation');
			v.subscribeNode('presentation','isaacueca@logoslogic.com');

			jabberConnection.send(v);
			
		}
		
		function handleStatusChanged(status, me) {
			console.log('handleStatusChanged');
		}
		
		function handleMessageIn(message) {
			
		console.log('handleMessageIn');
			
		  var server = "^"+PUBSUB_SERVER.replace(/\./g, "\\.");
		  var re = new RegExp(server);
		  // Only handle messages from the PubSub Server. 
		  if ($(message).attr('from').match(re)) {
		    // Grab pubsub entry page number
		    var event = $(message).children('event')
		      .children('items')
		      .children('item')
		      .children('entry').text();

		    if (ignore) {
		      //short circuit first event
		      ignore = false;
		      return true;
		    }

		    go_page = parseInt(event); // The event should be the current page #
		    if (go_page >= 0) { // Only handle page # events
		      // I would have liked to use goTo but the function would cause and odd
		      // jump to the home page then the correct page. So I added a bit off 
		      // logic to make it look good when transitioning pages.
		      if (current_page+1 == go_page) {
			go(1);
		      } else if (current_page-1 == go_page) {
			go(-1);
		      } else {
			goTo(go_page);
		      }
		      current_page = go_page;
		    }
		  }
		  // Return true or we loose this callback.
		  return true;
		}

		
});