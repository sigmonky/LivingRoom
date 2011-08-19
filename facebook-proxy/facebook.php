<?php

require '../facebook-php/src/facebook.php';

$token = $_POST['access_token'];
$action = $_POST['action'];
$message = $_POST['message'];
$user_id = $_POST['user_id'];

if ($action  == "postToWall"){
		$base_url = 'https://graph.facebook.com/';
}

$url = $base_url.$user_id.'/feed';

$curl_post_data = array(
    'access_token' =>$token,
    'message' =>$message
    );

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_POST, true); 
curl_setopt($ch, CURLOPT_POSTFIELDS, $curl_post_data);
$response = curl_exec($ch); 
curl_close($ch);
echo $response;


?>