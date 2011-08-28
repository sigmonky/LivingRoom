$(document).ready(function(){


	

	function log(msg)
	{
		$('#log').append('<div></div>').append(
		document.createTextNode(msg));
	}

	function onConnect(status)
	{
		if (status == Strophe.Status.DISCONNECTED)
		log('Disconnected.');
	}

	function onResult(iq) {
		var elapsed = (new Date()) - startTime;
		log('Response from jabber.org took ' + elapsed + 'ms.');
	}

	var StropheConfig = {
		
	// Settings
		boshUrl: 'http://www.logoslogic.com/http-bind',
	
	// Implemented event handlers
		subscriptionRequested: otalk.subscription_requested,
		chatReceived: otalk.on_chat_message,
		rosterChanged: otalk.update_roster,
	
	// Not implemented in UI
		handleMucMessage: otalk.handle_muc_message,
		chatStateReceived: otalk.chat_state_received
	};
	
	/*Start XMPP Connection */
	
	var connection = null;
 	var startTime = null;
 	var BOSH_SERVICE = '/http-bind';

	connection = new Strophe.Connection(BOSH_SERVICE);

	// Strophe.log = function (lvl, msg) { log(msg); };
	connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onConnect);

    // set up handler
	connection.addHandler(onResult, null, 'iq',	'result', 'disco-1', null);

	connection.rawInput = function (data) {
		log('RECV: ' + data);
	};

	connection.rawOutput = function (data) {
		log('SENT: ' + data);
	};
	
	// send disco#info to jabber.org
	var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()

	connection.send(iq);

	$(function () {
		otalk.init(connection);
	});

});


function FacebookNewInvite(){
        var receiverUserIds = FB.ui({ 
             method : 'apprequests',
             message: 'Come on man checkout SouthPark',
        },

       function(receiverUserIds) {
                   console.log("IDS : " + receiverUserIds.request_ids);
        }
      );
}