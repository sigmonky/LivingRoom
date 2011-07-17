var current_page = 0;

$(document).ready(function () {


    $('#back').bind('click', function () {
		publish(current_page - 1);
      });

    	$('#home').bind('click', function () {
			current_page = 0
			publish(current_page);
      });

    	$('#forward').bind('click', function () {
			publish(current_page + 1);
      });

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
		
		function handleMessageIn(message, me) {
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
		}
		
		function handleStatusChanged(status, me) {
			console.log('handleStatusChanged');
		}
		
		function publish(page) {
			console.log('publish');
			var message = $('#message').val();
			console.log('message = '+message);
			
			
			var v = new JSJaCLeaf();
			v.setFrom('isaacueca@logoslogic.com');
			v.setTo('pubsub.logoslogic.com');
			v.setType('set');
			v.setID('');
			
			v.setPubsub('http://jabber.org/protocol/pubsub','moderated');
			v.setPublish('moderated');
			v.createItem();
			v.setTitle(message);
		
		//Let's send the packet able to retrive the user vCard
	  		jabberConnection.send(v);
	
			current_page = current_page + 1;

		}
		


});