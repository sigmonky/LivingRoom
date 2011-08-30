<?php 

session_start();

include 'lib/EpiCurl.php';
include 'lib/EpiOAuth.php';
include 'lib/EpiTwitter.php';
include 'lib/secret.php';

$twitterObj = new EpiTwitter($consumer_key, $consumer_secret);
$msg = $_REQUEST['tweet'];
$twitterObj->setToken($_SESSION['ot'], $_SESSION['ots']);

$twitterInfo= $twitterObj->get_accountVerify_credentials();
$twitterInfo->response;
$username = $twitterInfo->screen_name;


$update_status = $twitterObj->post_statusesUpdate(array('status' => $msg));
$temp = $update_status->response;
echo "<pre>200 $temp</pre>";


?> 