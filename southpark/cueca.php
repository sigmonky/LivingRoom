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
        // when using openfire
//         //$body = "<body rid='" . $rid . "' xmlns='http://jabber.org/
// protocol/httpbind' to='logoslogic.com' xml:lang='en' wait='60' hold='1'
// window='5' content='text/xml; charset=utf-8' ver='1.6'
// xmpp:version='1.0' xmlns:xmpp='urn:xmpp:xbosh'/>";

        //when using punjab
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/
protocol/httpbind' to='logoslogic.com' route='xmpp:logoslogic.com:5222'
xml:lang='en' wait='60' hold='1' window='5' content='text/xml;
charset=utf-8' ver='1.6' xmpp:version='1.0'
xmlns:xmpp='urn:xmpp:xbosh'/>";
        $return = $this->__sendBody( $body );
        $xml = new SimpleXMLElement( $return );

        $sid = $xml['sid'];
        $rid ++;
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/
protocol/httpbind' sid='" . $sid . "'><auth
xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" . $hash .
"</auth></body>";
        $return = $this->__sendBody( $body );

        $rid ++;
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/
protocol/httpbind' sid='" . $sid . "' to='logoslogic.com' xml:lang='en'
xmpp:restart='true' xmlns:xmpp='urn:xmpp:xbosh'/>";
        $return = $this->__sendBody( $body );

        $rid ++;
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/
protocol/httpbind' sid='" . $sid . "'><iq type='set' id='_bind_auth_2'
xmlns='jabber:client'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'/

></iq></body>";

        $return = $this->__sendBody( $body );

        $rid ++;
        $body = "<body rid='" . $rid . "' xmlns='http://jabber.org/
protocol/httpbind' sid='" . $sid . "'><iq type='set'
id='_session_auth_2' xmlns='jabber:client'><session
xmlns='urn:ietf:params:xml:ns:xmpp-session'/></iq></body>";
        $return = $this->__sendBody( $body );
        $rid ++;
        $this->rid = $rid;
        $this->sid = $sid;
        $this->jid = $jid;
    }

    private function __sendBody ( $body )
    {
        //when using openfire
        //$ch = curl_init( "http://www.logoslogic.com/http-bind" );

        //when using punjab
        $ch = curl_init( "http://www.logoslogic.com/http-bind" );
        curl_setopt( $ch , CURLOPT_HEADER , 0 );
        curl_setopt( $ch , CURLOPT_POST , 1 );
        curl_setopt( $ch , CURLOPT_POSTFIELDS , $body );
        curl_setopt( $ch , CURLOPT_FOLLOWLOCATION , true );
        $header = array(/*'Accept-Encoding: gzip, deflate',*/'Content-
Type: text/xml; charset=utf-8'
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
$connection->connect( "isaacueca@logoslogic.com" , "cigano" );
$rid = $connection->getRid();
$jid = $connection->getJid();
$sid = $connection->getSid();
?>

... YOUR CODE HERE

var conn = new Strophe.Connection(
         'http://127.0.0.1/xmpp-httpbind');
   conn.connect.attach(<?=$jid?>, <?=$rid?>, <?=$sid?>, null);
The class
----------------------------------
<?php


?>