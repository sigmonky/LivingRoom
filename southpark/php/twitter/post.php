<?php 

session_start();

include 'lib/EpiCurl.php';
include 'lib/EpiOAuth.php';
include 'lib/EpiTwitter.php';
include '../../config.php';

	if(isset($_SESSION['oauth_token'])){
		$twitterObj = new EpiTwitter($consumer_key, $consumer_secret);
		$msg = $_REQUEST['tweet'];
		$twitterObj->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
		$update_status = $twitterObj->post_statusesUpdate(array('status' => $msg));
		$temp = $update_status->response;
	  	header('Content-type: application/json');
		echo "{\"status\": \"posted\"}";
	}
	else{
	  	header('Content-type: application/json');
		echo "{\"status\": \"not_connected\"}";
	}
?> 