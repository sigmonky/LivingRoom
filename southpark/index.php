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
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
		
		<title>South Park Chat Widget</title>
		
		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		
		<!-- Stylesheets !-->
		
		<link href="styles/global.css" rel="stylesheet" type="text/css" />
		<link type="text/css" href="styles/jquery.jscrollpane.css" rel="stylesheet" media="all" />
		
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/flick/jquery-ui.css">
		
		<!-- XMPP Bootstrap from XMPP Session Attachment and Facebook !-->
		
		
		<!-- Mustache.js templates  -->
		
		<script id="user" type="text/html">
			<li class="roster_user" id="roster_{{ uid }}" data-jid="{{ uid }}">
			<div class="roster-user-wrap">
				<div class="roster-thumb">
				   <img src="http://graph.facebook.com/{{uid}}/picture" class="avatar" width="48" height="48" alt=""/>
				</div>
				<div class="roster-details">
				  {{name}}
				</div>
				<div class="clearfix">
				<div class="friend_roster_menu">
					<span>
						<a href="#" class="start_chat">Chat</a>
						<a href="#" class="remove">Add to Group Chat</a>
						<a href="#" class="remove">Create Group Chat</a>
					</span>
				</div>
				</div>
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
		
		<script type="text/x-handlebars-template" id="tweet-template">
			<div class="thumb">
			   <a href="http://twitter.com/#!/{{user.screen_name}}" class="tweet-user"><img src="{{user.profile_image_url}}" class="avatar" width="48" height="48" alt=""/></a>
			</div>
			<div class="details">
			   <p>{{text}}</p>
			   <div class="date"><span><a href="http://twitter.com/#!/{{user.screen_name}}" class="tweet-user">{{user.screen_name}}</a></span></div>
			</div>
			<div class="clearfix"></div>
		</script>
		
	</head>
	
	<body>
		
	<!-- Facebook SDK Begin -->
		
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
	
	<!-- Facebook SDK End -->
	
	<div id="body_wrapper">

		<!-- Main Menu Begin -->
		
		<div class="top_panel">
			<ul class="main_menu">
				<li><a href="#allfans">All Fans</a></li>
				<li><a href="#myfriends">My Friends</a></li>
				<li><a href="#buzz">Buzz</a></li>
			</ul>	
			<div class="clearfix"></div>
		</div>
		
		<!-- Main Menu End -->
		
		
		<div id="pane-content">
		
		<!-- All Fans View Begin -->
		
		<div class="pane-section" id="all_fans_view">

			<div class="main_panel">
				
				<div id="room-chat-area">
					
				</div>
				
			</div>

		</div>
		
		<!-- All Fans View End -->
		
		<!-- My Friends View-->
		
		<div class="pane-section" id="friends_view">
			
			<div class="main_panel">
				
				<div id='roster-area'>
					 <ul></ul>
				</div>
				
			    <div id='chat-area'>
			      <ul></ul>
			    </div>

			</div>

		</div>
		
		<!-- My Friends End-->
		
		<!-- Buzz View Begin -->
		
		<div class="pane-section" id="buzz_view">
			<div class="main_panel">
				<div class="scroll-pane">
					<div id="rows-content"  style="height:2500px">
						<div id="rows"></div>
					</div>
				</div>
			</div>
			
		</div>
		
		<!-- Buzz View End -->
	
		</div>
	
		<!--<section id="roster">
		</section>

		<section id="chats">
			<ul></ul>
		</section> -->
		
		
		<span id="load" style="display: none; ">loading...</span>					
		
		
		<!-- Log Debug Console Begin -->
		
		<div id="facebook_debug">
    		<a href="#" onclick="FacebookNewInvite(); return false;">Invite Friends</a> |
	    	<?php if (!$facebook_user) { ?>
	        	<a href="<?=$loginUrl?>">Facebook Login</a>
	    	<?php } else { ?>
	        	<a href="<?=$logoutUrl?>">Facebook Logout</a>
	    		<?php } ?>
		</div>
			
			
		<div id='log'>
	    </div>
	
		<!-- Log Debug Console End -->
	
	</div>
	<script>

	var Attacher = {
		JID: '<?=$user->sessionInfo['jid']?>',
		SID: '<?=$user->sessionInfo['sid']?>',
		RID: '<?=$user->sessionInfo['rid']?>'
	};

	var FriendsWhoInstalledApp = {
		data: <?php print json_encode($fqlResult); ?>
	}

	var RoomJid = '<?=$user->roomJid?>';

	</script>
	

	
	<!-- JQuery core and plugins !-->
	
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js">
	<script src="application/libs/jquery-ui-1.8.2.custom.min.js"></script>
	<!-- the mousewheel plugin -->
	<script type="text/javascript" src="application/libs/jquery.mousewheel.js"></script>
	<!-- the jScrollPane script -->
	<script type="text/javascript" src="application/libs/jquery.jscrollpane.min.js"></script>
	
	<!-- Template Engine  !-->
	
	<script src="application/libs/mustache.js" type="text/javascript"></script>
	<script src="application/libs/handlebars.js" type="text/javascript"></script>
	
	<script type="text/javascript" src="application/libs/jquery.mustache.js"></script>
	
	<script src="application/components/ICanHaz.js" type="text/javascript"></script>
	
	<!-- Strophe core and plugins  !-->
	
	<script src="application/libs/strophe.js" type="text/javascript"></script>
	<script src="application/libs/strophe.roster.js" type="text/javascript"></script>
	<script src="application/libs/strophe.status.js" type="text/javascript"></script>
	<script src="application/libs/strophe.chat.js" type="text/javascript"></script>
	<script src="application/libs/strophe.muc.js" type="text/javascript"></script>
	
	
	<!-- Backbone MVC  !-->
	<script src="application/libs/underscore.js"></script> 
	<script src="application/libs/backbone-min.js"></script>
	

	
	<!-- Backbone Models !-->
	
	<script>
	
    var server = false, models;
    if (typeof exports !== 'undefined') {
        _ = require('underscore')._;
        Backbone = require('backbone');
        models = exports;
        server = true;
    } else {
        models = this.models = {};
    }

    models.ChatRoomModel = Backbone.Model.extend({
        initialize: function() {
            this.chats = new models.ChatCollection();
            this.users = new models.RoomRosterCollection();
        }
    });

	</script>

	
	<!-- Startup Script !-->
	
	
	<script src="application/models/ChatEntry.js" type="text/javascript"></script>
	<script src="application/models/Room.js" type="text/javascript"></script>
	<script src="application/models/User.js" type="text/javascript"></script>
	<script src="application/models/TweetEntry.js" type="text/javascript"></script>
	
	<!-- Backbone Views !-->
	
	<script src="application/views/BuzzMessageView.js" type="text/javascript"></script>
	<script src="application/views/BuzzView.js" type="text/javascript"></script>
	<script src="application/views/ChatMessageView.js" type="text/javascript"></script>
	<script src="application/views/ChatView.js" type="text/javascript"></script>
	<script src="application/views/FriendRosterView.js" type="text/javascript"></script>
	<script src="application/views/RoomView.js" type="text/javascript"></script>
	<script src="application/views/PaneView.js" type="text/javascript"></script>

	<!-- Backbone Controller !-->
	<script src="application/controllers/MainController.js" type="text/javascript"></script>
	<!-- Jabber/XMPP Client  !-->
	
	<script src="application/components/jabberclient.js" type="text/javascript"></script>
	<script src="application/main.js"></script>
	
	<script>
	
	var StropheConfig = {

	// Settings
		boshUrl: 'http://www.logoslogic.com/http-bind',

	// Implemented event handlers
		subscriptionRequested: JabberClient.subscription_requested,
		chatReceived: JabberClient.on_chat_message,
		rosterChanged: JabberClient.update_roster,

	// Not implemented in UI
		handleMucMessage: JabberClient.handle_muc_message,
		chatStateReceived: JabberClient.chat_state_received
	};

	</script>
	</body>
</html>