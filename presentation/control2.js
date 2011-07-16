$(document).ready(function () {


    $('#back').bind('click', function () {
		publish(current_page - 1);
      });

    	$('#home').bind('click', function () {
			publish(0);
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


});