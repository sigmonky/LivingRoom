<?php

include_once "fbmain.php";
include_once "user.php";
require_once(dirname(__FILE__)."/jabberclass/jabberclass.php");
require_once(dirname(__FILE__)."/xmppprebind.php");

/* Creates Session Attachment based on Anonymous or FB authenticated user */

if ($facebook_user_profile['id'] != "") {
	
	//Connect Facebook Authenticated User
	$user = new User($facebook_user_profile['id']);
	$facebook_id = $user->facebook_id;
	$facebook_name = $user->facebook_user_profile['name'];
	
}else{
	
	//Connect Anonymous User
	$user = new User();
}

?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml">
	<head>
		<title>South Park Chat Widget</title>
		
		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		
		<link href="styles/global.css" rel="stylesheet" type="text/css" />
		
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/flick/jquery-ui.css">
		<script src="libs/jquery-1.4.2.min.js"></script>
		<script src="libs/jquery-ui-1.8.2.custom.min.js"></script>
		<script src="libs/jquery.inlineEdit.js" type="text/javascript"></script>
		<script src="libs/strophe.js" type="text/javascript"></script>
		<script src="libs/strophe.roster.js" type="text/javascript"></script>
		<script src="libs/strophe.status.js" type="text/javascript"></script>
		<script src="libs/strophe.chat.js" type="text/javascript"></script>
		<script src="libs/strophe.muc.js" type="text/javascript"></script>
		<script src="libs/mustache.js" type="text/javascript"></script>
		<script src="js/jabberclient.js" type="text/javascript"></script>
		<script src="js/ICanHaz.js" type="text/javascript"></script>
		
		<!-- IF DEBUG == TRUE -->
		<link href="styles/peek.css" rel="stylesheet" type="text/css" />
		<script src="js/peek.js" type="text/javascript"></script>
		
		<!-- <script src="libs/backbone.js"></script>
		
		<script src="libs/underscore.js"></script> -->
		
<script type="text/javascript">

/* Startup Script */

$(document).ready(function(){

 	var Attacher = {
           JID: '<?=$user->sessionInfo['jid']?>',
           SID: '<?=$user->sessionInfo['sid']?>',
           RID: '<?=$user->sessionInfo['rid']?>'
 	};

 	var FriendsWhoInstalledApp = {
		data: <?php print json_encode($fqlResult); ?>
 	}

 	var roomJid = '<?=$user->roomJid?>';
	

	function log(msg)
	{
		$('#log').append('<div></div>').append(
		document.createTextNode(msg));
	}

	function onConnect(status)
	{
		if (status == Strophe.Status.DISCONNECTED)
		//log('Disconnected.');
	}

	function onResult(iq) {
		var elapsed = (new Date()) - startTime;
	//	log('Response from jabber.org took ' + elapsed + 'ms.');
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
		//log('RECV: ' + data);
	};

	connection.rawOutput = function (data) {
		//log('SENT: ' + data);
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

</script>
		
		<!-- Our html Mustache.js templates all go below. (Yes this validates) -->
		<script id="user" type="text/html">
			<li class="user {{ status }}" id="roster_{{ jid_id }}" data-jid="{{ jid }}">
				<span class="name">{{ name }}</span><a href="#" class="edit_user">edit</a>
				<span class="status">{{#status_message}} - {{ status_message }}{{/status_message}}</span>
				<span class="jid">{{ jid }}</span>
				<span>
					<a href="#" class="remove">remove</a>
					<a href="#" class="start_chat">chat</a>
				</span>
			</li>
		</script>
		
		<script id="group" type="text/html">
			<div class="group" title="{{ title }}">
				<span class="group_title">{{{ title }}}</span>
				<ul></ul>
			</div>
		</script>
		
		<script id="add_user_dialog" type="text/html">
			<div>
				<label>JID:</label><input type="text" id="add_user_jid">
				<label>Name:</label><input type="text" id="add_user_name">
			</div>
		</script>

		<script id="edit_user_dialog" type="text/html">
			<div>
				<label>Name:</label><input type="text" id="add_user_name" value="{{ name }}">
			</div>
		</script>
		
		<script id="subscription_request" type="tex
		t/html">
			<div>
				<p>Subscription request received from {{ from }}</p>
				<label>Name:</label><input type="text" id="add_user_name">
			</div>
		</script>
		
		<script id="chat_window" type="text/html">
			<ul class="chat_list"></ul>
			<input class="chat_input" id="input_{{ id }}" type="text" />
		</script>
		
		<script id="muc_window" type="text/html">
			<ul class="chat_list"></ul>
			<input class="muc_input" id="input_{{ id }}" type="text" />
			<ul class="roster"></ul>
		</script>
		
		<script id="chat_message" type="text/html">
			<li class="chat_message{{#from}} {{from}}{{/from}}">
				<span class="chat_name">{{ name }}</span>
				<span class="chat_text">{{{ message }}}</span>
			</li>
		</script>
		
		<script id="muc_dialog" type="text/html">
			<div>
				<label>Room:</label><input type="text" id="muc_room"/>
				<label>Nickname:</label><input type="text" id="muc_nickname"/>
			</div>
		</script>
		
	</head>
	<body>
		<div id="fb-root"></div>
		<script src="http://connect.facebook.net/en_US/all.js"></script>
        <script type="text/javascript">
            FB.init({ appId: '103751443062683', 
                    status: true, 
                    cookie: true,
                    xfbml: true,
                    oauth: true,
			});
        </script>
	
    	<a href="#" onclick="FacebookNewInvite(); return false;">Invite Friends</a>

	    <?php echo 'facebook_user='. $facebook_user;if (!$facebook_user) { ?>
	        You've to login using FB Login Button to see api calling result.
	        <a href="<?=$loginUrl?>">Facebook Login</a>
	    <?php } else { ?>
	        <a href="<?=$logoutUrl?>">Facebook Logout</a>
	    <?php } ?>
	
		<div class="toolbar">
			<button id="join_muc">Join MUC</button>
		</div>

		<section id="roster">
		</section>

		<section id="chats">
			<ul></ul>
		</section>
		
		<div class="clearfix"></div>
		
		<div id='console'></div>
	    <textarea id='input' class='disabled'
	              disabled='disabled'></textarea>

	    <div id='buttonbar'>
	      <input id='send_button' type='button' value='Send Data'
	             disabled='disabled' class='button'>
	    </div>
	
		<div id='log'>
	    </div>

	</body>
</html>