<?php

include_once "fbmain.php";
require_once(dirname(__FILE__)."/jabberclass/jabberclass.php");
require_once(dirname(__FILE__)."/xmppprebind.php");

class User {

    public $curl = null;
    public $facebook_token = null;
    public $facebook_id = null;
    public $facebook_name = null;
	public $password = null;
	public $sessionInfo = null;
	private $firePhp = null;
	public $roomJid = null;
	
	private function debug($msg, $label = null) {
		if ($this->firePhp) {
			$this->firePhp->log($msg, $label);
		}
	}
	
    public function __construct($facebook_id = NULL) {
        $this->curl = curl_init();
		$this->firePhp = FirePHP::getInstance(true);
		$this->firePhp->setEnabled(true);
		$this->debug($token, '__construct');
		if ($facebook_id != NULL){
			$this->debug($facebook_id, '__construct nao eh nulo');
			$this->facebook_id = $facebook_id;
			$this->generateUserPassword();
		}else{
			$this->debug($token, '__construct eh nulo -');
			$isAnonymous = true;
			$this->generateSessionAttachment($isAnonymous);
		}
        register_shutdown_function(array($this, 'shutdown'));
    }

    /**
     * Get FB User ID
     */
    public function getFBUser() {    
		// $fields = array(
		// 	'access_token'=>urlencode($this->facebook_token),
		// );
		// 
		// $url = "https://graph.facebook.com/me?access_token=".$this->facebook_token;
		// 
		// curl_setopt($this->curl,CURLOPT_URL, $url);
		// curl_setopt($this->curl, CURLOPT_CONNECTTIMEOUT, 10);
		// curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);
		// foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		// 	rtrim($fields_string,'&');
		// 	//open connection 
		//         	$response = curl_exec($this->curl);
		// if ($response){
		//         	$result_obj = json_decode($response);
		// 	$facebook_id = $result_obj->id;
		// 	$facebook_name = $result_obj->name;
		// 	$this->facebook_id = $facebook_id;
		// 	$this->facebook_name = $facebook_name;
		// 	$this->generateUserPassword();
		// }
		$this->shutdown();
    }

    /**
     * Cleanup resources
     */
    public function shutdown() {
        if($this->curl) {
            curl_close($this->curl);
        }
    }

	/**** MD5 String  */

	public function md5_salt($string) {
	    $chars = str_split('~`!@#$%^&*()[]{}-_\/|\'";:,.+=<>?');
	    $keys = array_rand($chars, 6);

	    foreach($keys as $key) {
	        $hash['salt'][] = $chars[$key];
	    }

	    $hash['salt'] = implode('', $hash['salt']);
	    $hash['salt'] = md5($hash['salt']);
	    $hash['string'] = md5($hash['salt'].$string.$hash['salt']);
	    return $hash;
	}
	
	public function generateUserPassword(){
		$facebook_id = $this->facebook_id;
		
		/* API Secret Key */
		$apiSalt = '1333232523232299852232';
		$token = $apiSalt.$facebook_id;
		
		$pass = $this->md5_salt($token);
		$this->password = $pass;
		$this->generateJabberUser();
	}
	
	public function generateJabberUser(){
		
		$display_debug_info = false;
		$AddUserErrorCode = 12000;
		 
		$jab = new CommandJabber($display_debug_info);
		$addmsg = new AddMessenger($jab, $this->facebook_id, $this->password);
		
		$jab->set_handler("connected",$addmsg,"handleConnected");
		$jab->set_handler("authenticated",$addmsg,"handleAuthenticated");
		$jab->set_handler("error",$addmsg,"handleError");
		
		//connect to the Jabber server
		if ($jab->connect(JABBER_SERVER))
		{
			$AddUserErrorCode=12001;
			$jab->execute(CBK_FREQ,RUN_TIME);
			$this->generateSessionAttachment();
			
		}

		$jab->disconnect();

		unset($jab,$addmsg);
		
		/* Set a property of VCard in order to verify user is authenticated. SET NICKNAME as equal to FULL NAME
		Only authenticated users should have the right to setup VCARD property*/
		
		// // If AddUserErrorCode is 0, we can try to fill user's Vcard, using brand new credentials :)
		// 
		// $AddVcardErrorCode = 14000;
		// $jab = new CommandJabber($display_debug_info);
		// $avcard = new AddVcard($jab,$UserLogin,$UserPass,$FirstName,$LastName,$Patronymic);
		// 
		// $jab->set_handler("connected",$avcard,"handleConnected");
		// $jab->set_handler("authenticated",$avcard,"handleAuthenticated");
		// 
		// if ($jab->connect(JABBER_SERVER))
		// {
		// $AddVcardErrorCode=14001;
		// $jab->execute(CBK_FREQ,RUN_TIME);
		// }
		// 
		// $jab->disconnect();
		// 
		// unset($jab,$avcard);
	}
	
	public function generateSessionAttachment($isAnonymous = false){
		$xmppPrebind = new XmppPrebind('logoslogic.com', 'http://www.logoslogic.com/http-bind/', '', false, true);
		if ($isAnonymous != true){
			$xmppPrebind->connect($this->facebook_id, $this->password);
		}else{
			$xmppPrebind->connect('', '');
		}
		$xmppPrebind->auth();
		$sessionInfo = $xmppPrebind->getSessionInfo(); // array containing sid, rid and jid
		$this->sessionInfo = $sessionInfo;
		$this->getAvailableRoomJidFromRoomProxyService();
	}

	public function getAvailableRoomJidFromRoomProxyService(){
		
		/* Fetch Available Room from Ejabberd */
		/*extended disco info has muc#roominfo_occupants 
		http://xmpp.org/extensions/xep-0045.html#example-8*/
		
		$ch = curl_init();
		$url = "http://www.logoslogic.com/chat/LivingRoom/southpark/service/room_proxy.json";
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			//open connection 
		$response = curl_exec($ch);
		
		if ($response){
		    $result_obj = json_decode($response);
			$roomJid = $result_obj[0]->jid;
			$this->roomJid = $roomJid;
		}else{
			/* A problem Happenned. Using Backup room */
			$this->roomJid = 'backup_room_JID';
			/* Admin Notification Email */
			$to = "isaac.dasilva@mtvncontractor.com";
			$subject = "Room Proxy Problem";
			$message = "There was a problem with the room Proxy at ".date("Y-m-d H:i:s");
			$from = "southpark@southpark.com";
			$headers = "From:" . $from;
			mail($to,$subject,$message,$headers);
		}
		
		curl_close($ch);
		
	}

}

	/* Authenticated versus Anonymous */

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
		
		<!-- <script src="libs/backbone.js"></script>
		<script src="libs/underscore.js"></script> -->
		
		<script type="text/javascript">
		$(document).ready(function(){
			
			
		<?php 
		
		print ($fqlResult) 
		
		
		?>	
			
          function newInvite(){
                var receiverUserIds = FB.ui({ 
                        method : 'apprequests',
                        message: 'Come on man checkout my applications. visit http://ithinkdiff.net',
                 },

                 function(receiverUserIds) {
                          console.log("IDS : " + receiverUserIds.request_ids);
                        }
                 );
          }

	      var Attacher = {
	             JID: '<?=$user->sessionInfo['jid']?>',
	             SID: '<?=$user->sessionInfo['sid']?>',
	             RID: '<?=$user->sessionInfo['rid']?>'
	      };
			
			var roomJid = '<?=$user->roomJid?>';
		
			var connection = null;
			var startTime = null;
			var BOSH_SERVICE = '/http-bind';
			
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
			
			connection = new Strophe.Connection(BOSH_SERVICE);
			
			connection.rawInput = function (data) {
				log('RECV: ' + data);
			};
			
			connection.rawOutput = function (data) {
				log('SENT: ' + data);
			};
			
			// uncomment for extra debugging
			// Strophe.log = function (lvl, msg) { log(msg); };
			connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onConnect);

			              // set up handler
			connection.addHandler(onResult, null, 'iq',	'result', 'disco-1', null);

			log('Strophe is attached.');

			// send disco#info to jabber.org
			var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()

			connection.send(iq);
			
		    // Attacher.connection = new Strophe.Connection("http://www.logoslogic.com/http-bind");
		    // Attacher.connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onAttach);
		    // $('#log').append("<div>Session attached!</div>");
		    // Attacher.connection.sendIQ(
		    //     $iq({to: Strophe.getDomainFromJid(Attacher.JID),
		    //          type: "get"})
		    //         .c('query', {xmlns:
		    //                      'http://jabber.org/protocol/disco#info'}),
		    //     function () {
		    //         $('#log').append("<div>Response received " +
		    //                          "from server!</div>");
		    //     });
		
				// our global config object
				// plugins use this if it exists
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
				
			$(function () {
				otalk.init(connection);
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
            var button;
            var userInfo;
            var accessToken = '';
			var facebook_id =<?= $user->facebook_id ?>
            FB.init({ appId: '103751443062683', 
                    status: true, 
                    cookie: true,
                    xfbml: true,
                    oauth: true
				   });
		          
			
        </script>
	
    	<a href="#" onclick="newInvite(); return false;">Invite Friends</a>

	    <?php if (!$facebook_user) { ?>
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

		<div id='log'>

	    </div>

	</body>
</html>

<?php


?>