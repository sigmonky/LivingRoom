<?php

define('XMPP_HTTPBIND_URI', '/http-bind/');
class XMPP_BOSHConnect {

        protected $sid;
        protected $rid;
        protected $jid;
        protected $of_server;
        protected $httpbind_uri;
        protected $authid;

        public function getRid(){
                return $this->rid;
        }

        public function getSid(){
                return $this->sid;
        }

        public function getJid(){
                return $this->jid;
        }

        public function __construct($of_server,$httpbind_uri){

                $this->of_server = $of_server;

                $this->httpbind_uri = $httpbind_uri;

        }

        public function connect ($user,$password){

                $hash = base64_encode( $user . "@" . $this->of_server . "\0" .
$user . "\0" . $password ) . "\n";

        $rid = rand();
        $jid = $user . "@" . $this->of_server ;
                //
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' to='" . $this->of_server . "' xml:lang='en' wait='60' hold='1' ver='1.6' xmpp:version='1.0' content='application/xml; charset=utf-8' xmlns:xmpp='urn:xmpp:xbosh' route='xmpp:logoslogic.com:5222'/>";
                //route='xmpp:127.0.0.1:5222'
                $return = $this->__sendBody( $body );

//              echo '<pre>';
//              print_r(htmlentities($return));
//              exit;

        try {
                $xml = new SimpleXMLElement( $return );
        }

        catch(Exception $e){
                print get_class($e)." thrown within the exception handler.
Message: ".$e->getMessage()." on line ".$e->getLine();
                                exit;
                }

        $sid = $xml['sid'];
        $rid++;
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" .$hash ."</auth></body>";

        $return = $this->__sendBody( $body );

        $rid++;

        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><iq type='set' id='_bind_auth_2' xmlns='jabber:client'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'/></iq></body>";

        $return = $this->__sendBody( $body );
        $rid++;
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><iq type='set'id='_session_auth_2' xmlns='jabber:client'><session xmlns='urn:ietf:params:xml:ns:xmpp-session'/></iq></body>";
        $return = $this->__sendBody( $body );
        $rid++;

        $this->rid = $rid;
        $this->sid = $sid;
        $this->jid = $jid . '/' . $xml['authid'];

        echo 'RID:' . $this->rid ;
        echo '<br/>SID' . $this->sid;
        echo '<br/>JID' . $this->jid;
        echo '<br/>authid: ' . $xml['authid'];
//        exit;
        }

        private function __sendBody($body){

                try {
                        $ch = curl_init(XMPP_HTTPBIND_URI);
                }

                catch(Exception $e){
                print get_class($e)." thrown within the exception handler.
Message: ".$e->getMessage()." on line ".$e->getLine();
                exit;
        }

        curl_setopt( $ch , CURLOPT_HEADER , 0 );
        curl_setopt( $ch , CURLOPT_POST , 1 );
        curl_setopt( $ch , CURLOPT_POSTFIELDS , $body );
        curl_setopt( $ch , CURLOPT_FOLLOWLOCATION , true );
        $header = array('Content- Type: text/xml; charset=utf-8');
        curl_setopt( $ch , CURLOPT_HTTPHEADER , $header );
        curl_setopt( $ch , CURLOPT_VERBOSE , 0 );
        $output = '';
        curl_setopt( $ch , CURLOPT_RETURNTRANSFER , 1 );

        try {
                $output = curl_exec( $ch );
        }

        catch(Exception $e){
                print get_class($e)." thrown within the exception handler.
Message: ".$e->getMessage()." on line ".$e->getLine();
                exit;
        }

        //$this->http_buffer[] = $output;
        curl_close($ch);
        return ($output);
        }

}
$bosh = new XMPP_BOSHConnect('logoslogic.com','/http-bind2');

$bosh->connect('john', 'john');

$xmppJID = $bosh->getJid();
$xmppSID = (string)$bosh->getSid();
$xmppRID = $bosh->getRid();

$_SESSION['xmpp_attached_sid'] = $xmppSID;

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

		      //    var Attacher = {
		      //        JID: '<?=$sessionInfo['jid']?>',
		      //        SID: '<?=$sessionInfo['sid']?>',
		      //        RID: '<?=$sessionInfo['rid']?>'
		      // };
		
		         var Attacher = {
		             JID: '<?=$jid?>',
		             SID: '<?=$sid?>',
		             RID: '<?=$rid?>'
		      };
		
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
			connection.attach(Attacher.JID, Attacher.SID, parseInt(Attacher.RID,10),
			onConnect);

			              // set up handler
			connection.addHandler(onResult, null, 'iq',
			'result', 'disco-1', null);

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
					// init our app
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