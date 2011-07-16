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
		
		this.jabberConnection = new JSJaCHttpBindingConnection(oArgs);

		this.initConnection(this.jabberConnection);

		oArgs = new Object();
		oArgs.domain = 'logoslogic.com';
		oArgs.username = 'isaacueca';
		oArgs.resource = '';
		oArgs.pass = 'cigano';
		oArgs.register = false;
		oArgs.port = 5222;
		oArgs.authtype = 'sasl';

		this.jabberConnection.connect(oArgs);

		jabberConnection.registerHandler('iq', this.handleIq);
		jabberConnection.registerHandler('message_in', this.handleMessageIn);
		jabberConnection.registerHandler('presence', this.handlePresence);
		jabberConnection.registerHandler('onConnect', this.handleConnected);
		jabberConnection.registerHandler('packet_in', this.handlePacketIn);
		jabberConnection.registerHandler('status_changed', this.handleStatusChanged);

		handleMessageIn: function(message, me) {
			console.log('handleMessageIn');
		}
		
		
		handlePresence: function(presence, me) {
			console.log('handlePresence');
			
		}
		
		handlePacketIn: function(packet, me){
			console.log('handlePacketIn');
			
		}
		
		handleIq: function(iq, me){
			console.log('handleIq');
			
		}
		
		
		handleStatusChanged: function(status, me) {
			console.log('handleStatusChanged');
			
		}
		
		
		handleConnected: function(me) {
			console.log('handleConnected');


		},
		
		handleStatusChanged: function(status, me) {
			console.log('handleStatusChanged');
			
		},


});