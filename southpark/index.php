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
		
		<!-- Stylesheets !-->
		
		<link href="styles/global.css" rel="stylesheet" type="text/css" />
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/flick/jquery-ui.css">
		
		<!-- XMPP Bootstrap from XMPP Session Attachment and Facebook !-->
		
		<script>

		var Attacher = {
    		JID: '<?=$user->sessionInfo['jid']?>',
    		SID: '<?=$user->sessionInfo['sid']?>',
    		RID: '<?=$user->sessionInfo['rid']?>'
		};

		var FriendsWhoInstalledApp = {
			data: <?php print json_encode($fqlResult); ?>
		}

		var roomJid = '<?=$user->roomJid?>';

		</script>
		
		<!-- JQuery core and plugins !-->
		
		<script src="application/libs/jquery-1.4.2.min.js"></script>
		<script src="application/libs/jquery-ui-1.8.2.custom.min.js"></script>
		<script src="application/libs/jquery.inlineEdit.js" type="text/javascript"></script>
		
		<!-- Strophe core and plugins  !-->
		
		<script src="application/libs/strophe.js" type="text/javascript"></script>
		<script src="application/libs/strophe.roster.js" type="text/javascript"></script>
		<script src="application/libs/strophe.status.js" type="text/javascript"></script>
		<script src="application/libs/strophe.chat.js" type="text/javascript"></script>
		<script src="application/libs/strophe.muc.js" type="text/javascript"></script>
		
		<!-- Template Engine  !-->
		
		<script src="application/libs/mustache.js" type="text/javascript"></script>
		<script src="application/libs/ICanHaz.js" type="text/javascript"></script>
		
		<!-- Backbone MVC  !-->
		
		<script src="application/libs/backbone-min.js"></script>
		<script src="application/libs/underscore.js"></script> 

		<!-- Backbone Models !-->
		
		<!-- Backbone Stores/Collections !-->

		<!-- Backbone Views !-->
		
		<!-- Backbone Controller !-->
		
		<!-- Jabber/XMPP Client  !-->
		
		<script src="application/components/jabberclient.js" type="text/javascript"></script>
		
		<!-- Startup Script !-->
		
		<script src="application/main.js"></script>
		
		<!-- Mustache.js templates  -->
		
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
				<li><a href="#">All Fans</a></li>
				<li><a href="#">My Friends</a></li>
				<li><a href="#">Buzz</a></li>
			</ul>	
			<div class="clearfix"></div>
		</div>
		
		<!-- Main Menu End -->
		
		<!-- All Fans View Begin -->
		
		<div id="all_fans_view">

			<div class="main_panel">
			</div>
			<div class="bottom_panel">
					<form id="message_form" onsubmit="return false" method="post">
						<input type="text" id="message_field" name="message">
						<input type="submit" id="message_send_button" value="send">
					</form>		        
			</div>
		</div>
		
		<!-- All Fans View End -->
		
		<!-- My Friends View-->
		
		<div id="friends_view">
		</div>
		
		<!-- My Friends End-->
		
		<!-- Buzz View Begin -->
		
		<div id="buzz_view">
		</div>
		
		<!-- Buzz View End -->
	
		<!--<section id="roster">
		</section>

		<section id="chats">
			<ul></ul>
		</section> -->
		
		
		<!-- Log Debug Begin -->
		
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
	
		<!-- Log Debug End -->
	
	</div>
	</body>
</html>