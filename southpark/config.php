<?php

function getBaseUrl()
{
    // output: /myproject/index.php
    $currentPath = $_SERVER['PHP_SELF'];
    // output: Array ( [dirname] => /myproject [basename] => index.php [extension] => php [filename] => index )
    $pathInfo = pathinfo($currentPath);
    // output: localhost
    $hostName = $_SERVER['HTTP_HOST'];
    // output: http://
    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,5))=='https://'?'https://':'http://';
    // return: http://localhost/myproject/
    return $protocol.$hostName.$pathInfo['dirname']."/";
}

$base_url = getBaseUrl();

define("BASE_URL", $base_url);

//Jabber Server
define('BOSH_URL','http://www.logoslogic.com/http-bind');
define('JABBER_SERVER','logoslogic.com');
define('JABBER_USERNAME','isaacueca');
define('JABBER_PASSWORD','cigano');
define('RUN_TIME',5); // set a maximum run time of 5 seconds
define('CBK_FREQ',1); // fire a callback event every second

//Facebook Application
$fbconfig['appid' ]     = "103751443062683";
$fbconfig['secret']     = "9bcab286a9813b84f1bc5043c22c9b13";
$fbconfig['baseurl']    = BASE_URL."/index.php";

//Twitter Application
$consumer_key = 'oKUhWQf1CK1VRaaCgRSw';
$consumer_secret = 'KDdgkDU6U4c7ttVdlrJ10E8k5cdTsmIkkl5RHt640';

?>