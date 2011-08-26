<?php
$ch = curl_init();
$url = "http://www.logoslogic.com/chat/LivingRoom/southpark/room_proxy.json";
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	//open connection 
$response = curl_exec($ch);

if ($response){
        	$result_obj = json_decode($response);
	$roomJid = $result_obj->jid;
	echo 'roomJid '.$roomJid;
	$this->roomJid = $roomJid;
	$this->generateUserPassword();
}

curl_close($ch);

?>