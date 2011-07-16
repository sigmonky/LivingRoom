var current_page = 0;

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
		
		function publish(page) {
		//	page.toString();
		//	connection.pubsub.publish(connection.jid,PUBSUB_SERVER,PUBSUB_NODE,[page.toString()],log);
		
	//	new JSJaCLeaf();
	//	JSJaCLeaf.prototype.setPublish = function(node) {
	//	JSJaCLeaf.prototype.setPubsub = function(xmlns, node) {
	//	JSJaCLeaf.prototype.createItem = function() {
	//	JSJaCLeaf.prototype.setPublished = function(date) {
	///	JSJaCLeaf.prototype.setItems = function(node, jid) {

			var v = new JSJaCLeaf();
			v.setType('set');
			v.setID('publishnode');
			v.setTo('pubsub.logoslogic.com');
			v.setFrom('isaacueca@logoslogic.com');
			
			v.setPubsub('set','presentation');
			v.setPublish('presentation');
			v.createItem();
			v.setTitle(current_page);
			
		
		//Let's send the packet able to retrive the user vCard
	  		jabberConnection.send(v);
	
			current_page = current_page + 1;


		}
		


});