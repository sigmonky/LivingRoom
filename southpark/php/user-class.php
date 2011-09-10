<?php

require_once(dirname(__FILE__)."/jabberclass/jabberclass.php");
require_once(dirname(__FILE__)."/xmppprebind.php");

/**
 * Start XMPP User Obj based on Facebook User ID
 * Creates XMPP user
 * Creates a XMPP session attachment
 *
 * @param String Facebook user ID
 */

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
		//$this->debug($token, '__construct');
		if ($facebook_id != NULL){
			$this->debug($facebook_id, '__construct nao eh nulo');
			$this->facebook_id = $facebook_id;
			$this->generateUserPassword();
		}else{
			//$this->debug($token, '__construct eh nulo -');
			$isAnonymous = true;
			$this->generateSessionAttachment($isAnonymous);
		}
        register_shutdown_function(array($this, 'shutdown'));
    }

    /**
     * Get FB User ID
     */
    public function getFBUser() {    

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
	}
	
	public function generateSessionAttachment($isAnonymous = false){
		$xmppPrebind = new XmppPrebind(JABBER_SERVER, BOSH_URL, '', false, true);
		if ($isAnonymous != true){
			$xmppPrebind->connect($this->facebook_id, $this->password);
		}else{
			$xmppPrebind->connect('', '');
		}
		$xmppPrebind->auth();
		$sessionInfo = $xmppPrebind->getSessionInfo(); // array containing sid, rid and jid
		$this->sessionInfo = $sessionInfo;
		// $this->getAvailableRoomJidFromRoomProxyService();
	}


}

?>