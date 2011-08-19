<?php

$token = $_POST['access_token'];
$action = $_POST['action'];
$message = $_POST['message'];
$user_id = $_POST['user_id'];

if ($action  == "postToWall"){
		$base_url = 'https://graph.facebook.com/';
}

$base_url = 'https://graph.facebook.com/';


$user_id = '527305423';
$url = $base_url.$user_id.'/feed';

$curl_post_data = array(
    'token' =>'185799971471968%7C6abd4ab71ccadfcce7dba26c.3-100001502348575%7CKm3jSxCMzaZl9kbUBN_jkgmwTY8',
    'message' =>'cueca',
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