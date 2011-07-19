<?php
/* 
Get Feeds From A Number of Selected TweetRiver Feeds 
For each feed get the total number of votes 
For the Purposes of this demo these are all the feeds for show ID Jersey Shore 
The Bellow values have to be returned by a CMS, so first we have to fetch thes values

URL to static Feed: http://mtvn.com
'#mtvronnie'
'#sn00ki'
'#djpaulyd'
 
@params show ID - The ID of the show
@returns a JSON Object with the following format: 

Entity:[
{
	'display_name': 'sn00kie', 
	'total': '2200', 
	'twitter_hash': '#sn00kie',
	'tweet_river_feed_url': 'http://tweetriver.com/afrogjumps/-mtvronnie.json', 
	'tweet_phrase_value': '#Jersey Shore Fist Pump! Jersey Shore is On'
}, 
{
	'display_name': 'mtvronnie', 
	'total': '2200', 
	'twitter_hash': '#mtvronnie',
	'tweet_river_feed_url': 'http://tweetriver.com/afrogjumps/-mtvronnie.json', 
	'tweet_phrase_value': '#Jersey Shore Fist Pump! Jersey Shore is On'
}
]

*/

/* Get the list of Entities from CMS */
function getFromCMS(){
	
	//* Application SETUP *//
	
	/* Get Show ID from Query String */
	$feed = $_GET['show_id'];

	/* Once we know the show ID we can get the feed for that show ID */
	$cms_service_url = "http://localhost/popularity/popularity_cms.json";
	
	$entities = array();
	
	$json = file_get_contents($cms_service_url);
	$objects = json_decode($json, true);
	foreach($objects['entity'] as $entity){
		$url = $entity['tweet_river_analytics_url'];
		$entity['total_tweets'] = getTotalTweetsFromTweetRiver($url);
		array_push($entities, $entity);
	}
	outPutResponse($entities);
}

function outPutResponse($responseArray){
	$response = json_encode($responseArray);
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 2099 05:00:00 GMT');
	header('Content-type: application/json');
	print $response;
}

/* For Each Twitter Hash por TweetRiver URL, get its Tweet River Feed and get the total number of approved Tweets */
function getTotalTweetsFromTweetRiver($url){
	$json = file_get_contents($url);
	$response = json_decode($json, true);
	return $response['count']['approved'];
}

/* For Debugging Purposes */

function recursor( $array ) {

	print "\n<ul>\n";

	foreach( $array as $key => $value ) {

		if ( is_array($value) ) {
			print "<li>$key</li>\n";
			recursor( $value );
		}
		else
			print "<li>$value</li>\n";
	}

	print "</ul>\n";
}

//recursor($respose);

/* Start Application Execution */
getFromCMS();



?>