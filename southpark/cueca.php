<?php
class Xmpp_Bosh
{
    protected $sid;
    protected $rid;
    protected $jid;

    public function getRid ()
    {
        return $this->rid;
    }

    public function getSid ()
    {
        return $this->sid;
    }

    public function getJid ()
    {
        return $this->jid;
    }

    public function connect ( $user , $password )
    {
        $hash = base64_encode( $user . "@logoslogic.com\0" . $user ."\0" . $password ) . "\n";
        $rid = rand();
        $jid = $user . "@logoslogic.com";

		$body = "<body content='text/xml; charset=utf-8' hold='1' xmlns='http://jabber.org/protocol/httpbind' to='logoslogic.com' wait='300' rid='" . $rid . "' route='xmpp:logoslogic.com:5222' secure='false'  ver='1.6' xmlns:xmpp='urn:xmpp:xbosh' xmpp:version='1.0'/>";

        $return = $this->__sendBody( $body );

         $xml = new SimpleXMLElement( $return );
        
                $sid = $xml['sid'];
                $rid ++;
                $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><authxmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" . $hash ."</auth></body>";
                $return = $this->__sendBody( $body );
        			
                $rid ++;
                $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "' to='logoslogic.com' xml:lang='en' xmpp:restart='true' xmlns:xmpp='urn:xmpp:xbosh'/>";
                $return = $this->__sendBody( $body );
        
                $rid ++;
                $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><iq type='set' id='_bind_auth_2' xmlns='jabber:client'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'/></iq></body>";
        
                $return = $this->__sendBody( $body );
        
                $rid ++;
                $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><iq type='set' id='_session_auth_2' xmlns='jabber:client'><session xmlns='urn:ietf:params:xml:ns:xmpp-session'/></iq></body>";
                $return = $this->__sendBody( $body );
                $rid ++;

                $this->rid = $rid;
                $this->sid = $sid;
                $this->jid = $jid;
    }

    private function __sendBody ( $body )
    {

        $ch = curl_init( "http://www.logoslogic.com/http-bind" );
        curl_setopt( $ch , CURLOPT_HEADER , 0 );
        curl_setopt( $ch , CURLOPT_POST , 1 );
        curl_setopt( $ch , CURLOPT_POSTFIELDS , $body );
		echo $body;
        curl_setopt( $ch , CURLOPT_FOLLOWLOCATION , true );
        $header = array(/*'Accept-Encoding: gzip, deflate',*/'Content-Type: text/xml; charset=utf-8'
        );
        curl_setopt( $ch , CURLOPT_HTTPHEADER , $header );
        curl_setopt( $ch , CURLOPT_VERBOSE , 0 );
        $output = '';

        curl_setopt( $ch , CURLOPT_RETURNTRANSFER , 1 );
        $output = curl_exec( $ch );
        //$this->http_buffer[] = $output;

        curl_close( $ch );
        return ( $output );
    }
}

$connection = new Xmpp_Bosh( );

$connection->connect( "john" , "john" );
$rid = $connection->getRid();
$jid = $connection->getJid();
$sid = $connection->getSid();

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
		             JID: '<?=$jid?>',
		             SID: '<?=$sid?>',
		             RID: '<?=$rid?>'
		      };
		    Attacher.connection = new Strophe.Connection("http://www.logoslogic.com/http-bind");
		    Attacher.connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, null);
		    $('#log').append("<div>Session attached!</div>");
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