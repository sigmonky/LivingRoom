<?php

include '/xmpphp/xmppprebind.php';

?>


<!DOCTYPE html>
<html>
	<head>
		<title>South Park</title>
		
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
		<script src="otalk.js" type="text/javascript"></script>
		<script src="ICanHaz.js" type="text/javascript"></script>
		
		<!-- <script src="libs/backbone.js"></script>
		<script src="libs/underscore.js"></script> -->
		
		<script type="text/javascript">
		$(document).ready(function(){

		         var Attacher = {
		             JID: '<?=$sessionInfo['jid']?>',
		             SID: '<?=$sessionInfo['sid']?>',
		             RID: '<?=$sessionInfo['rid']?>'
		      };
		    Attacher.connection = new Strophe.Connection("http://www.logoslogic.com/http-bind2");
		    Attacher.connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onAttach);
		    $('#log').append("<div>Session attached!</div>");
		
			function onAttach(status){
				alert(status)
			}
			
		    Attacher.connection.sendIQ(
		        $iq({to: Strophe.getDomainFromJid(Attacher.JID),
		             type: "get"})
		            .c('query', {xmlns:
		                         'http://jabber.org/protocol/disco#info'}),
		        function () {
		            $('#log').append("<div>Response received " +
		                             "from server!</div>");
		        });
		
				// our global config object
				// plugins use this if it exists
				var StropheConfig = {
					// Settings
					boshUrl: 'http://www.logoslogic.com/http-bind2',

					// Implemented event handlers
					subscriptionRequested: otalk.subscription_requested,
					chatReceived: otalk.on_chat_message,
					rosterChanged: otalk.update_roster,

					// Not implemented in UI
					handleMucMessage: otalk.handle_muc_message,
					chatStateReceived: otalk.chat_state_received
				};

				$(function () {
					// init our app
					otalk.init(Attacher.connection);
				});
		});
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
		
		<script id="subscription_request" type="text/html">
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
	


        <!-- <div id="loader" style="display:none">
             <img src="ajax-loader.gif" alt="loading" />
         </div> -->
		<br/>


		<div class="toolbar">
			<input id="disconnect" type="button" value="disconnect" disabled="disabled">
			<button id="add_contact">Add Contact</button>
			<select id="show">
				<option value="">Available</option>
				<option value="chat">Free for chat</option>
				<option value="away">Away</option>
				<option value="xa">Extended Away</option>
				<option value="dnd">Do Not Distrub</option>
			</select>
			<label>Custom Status:</label><span id="custom_status"></span>
			<button id="join_muc">Join MUC</button>
		</div>

		<section id="roster">

		</section>

		<section id="chats">
			<ul></ul>
		</section>


		
		<div id='log'>
			JID: <?=$jid?>
            SID: <?=$sid?>
            RID: <?=$rid?>
	    </div>
	



	</body>
</html>

<?php


?>