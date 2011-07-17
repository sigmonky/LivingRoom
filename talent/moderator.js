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
		
		function createXMLDoc(xmlString){ 
			var parser = new DOMParser(); 
		  	var xmlDocument = parser.parseFromString(xmlString, "text/xml"); 
		  	return xmlDocument; 
		}
		
		function handleMessageIn(message) {
			
		  console.log('handleMessageIn');
		  var PUBSUB_SERVER = 'pubsub.logoslogic.com';
		  var server = "^"+PUBSUB_SERVER.replace(/\./g, "\\.");
		  var re = new RegExp(server);
		
		  console.log('handleMessageIn re ' +re);
	
		  console.log('handleMessageIn message attribute from ' +$(message).attr('from'));
		
			var from = message.getFrom();

			console.log('handleMessageIn - getFrom = ' +from)
			
		  // Only handle messages from the PubSub Server. 
		  	if (from.match(re)) {
			
				console.log('// Grab pubsub entry page number');
				var doc = createXMLDoc(message.xml());
				var event2 = doc.getElementsByTagName('event')[0];

				var event  = event2.getElementsByTagName('entry')[0].childNodes[0].nodeValue;
				
				var itemIdS = event2.getElementsByTagName('item')[0];
				console.log('item id is = '+itemIdS.getAttribute('id'));
				
				var itemId = itemIdS.getAttribute('id');
				
 				$('#message-list').append('<div class="message-item" id='+itemId+'>' + event + '<div class="controls"><a class="delete" href="#">Delete</a> | <a class="approve" href="#">Aprove</a></div></div>');
				console.log('event =' +event);

		    		if (ignore) {
		      			//short circuit first event
		     			ignore = false;
		      			return true;
		    		}
		   	}
		  // Return true or we loose this callback.
		  return true;
		}
		
		$('.delete').live('click', function() {
			var parent = $(this).parent().parent().parent().id
			console.log('deletex id = '+parent);
			
			var parent2 = $(this).parent().parent().id
			console.log('deletex2 id = '+parent2);
		});
		
		$('.approve').live('click', function(event) {
			console.log('deletex id ');
		});	
		
	

		
});