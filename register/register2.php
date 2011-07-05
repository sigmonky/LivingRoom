<?php

// set your Jabber server hostname, username, and password here
define('JABBER_SERVER','logoslogic.com');
define('JABBER_USERNAME','isaacueca');
define('JABBER_PASSWORD','cigano');

define('RUN_TIME',5); // set a maximum run time of 5 seconds
define('CBK_FREQ',1); // fire a callback event every second

// This class handles events fired by the first call of CommandJabber client class (to create a user);

class AddMessenger
{

function AddMessenger(&$jab,$name,$pass)
{
	$this->jab = &$jab;
	$this->jab->NewUserName = $name;
	$this->jab->NewUserPass = $pass;
}

// called when a connection to the Jabber server is established
function handleConnected()
{
global $AddUserErrorCode;
$AddUserErrorCode=12002;
// now that we're connected, tell the Jabber class to login
$this->jab->login(JABBER_USERNAME,JABBER_PASSWORD);

}

// called after a login to indicate the the login was successful
function handleAuthenticated()
{
global $AddUserErrorCode;
$AddUserErrorCode=12003;
$this->jab->adduser_init();
}

}
// End of AddMessenger class

/******************************************************************************************************/

// Here is class to handle second call to CommandJabber clase - to fill out vcard

class AddVcard
{

function AddVcard(&$jab,$name,$pass,$firstn,$lastn,$patro,$sex,$role)
{
$this->jab = &$jab;
$this->jab->NewUserName = $name;
$this->jab->NewUserPass = $pass;
$this->GivenName = $firstn;
$this->FamilyName = $lastn;
$this->MiddleName = $patro);
}

function handleConnected()
{
global $AddVcardErrorCode;
$AddVcardErrorCode=14002;
$this->jab->login($this->jab->NewUserName,$this->jab->NewUserPass);
}

function handleAuthenticated()
{
global $AddVcardErrorCode;
$AddVcardErrorCode=14003;
$this->jab->addvcard_request($this->GivenName, $this->FamilyName, $this->MiddleName, $this->UserRole);
}

} // End of AddVcard class

/******************************************************************************************************/

// Including original "Jabber Client Library" - class

/******************************************************************************************************/

// This is extension to basic Jabber class




?>