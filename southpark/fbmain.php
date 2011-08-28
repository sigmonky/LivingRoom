<?php
    //facebook application
    $fbconfig['appid' ]     = "103751443062683";
    $fbconfig['secret']     = "9bcab286a9813b84f1bc5043c22c9b13";
    $fbconfig['baseurl']    = "http://www.logoslogic.com/chat/LivingRoom/southpark/index.php"; 
    //
    if (isset($_GET['request_ids'])){
        //user comes from invitation
        //track them if you need
    }
    
    $facebook_user =  null; //facebook user uid
    try{
        include_once dirname(__FILE__)."/facebook/facebook.php";
    }
    catch(Exception $o){
        error_log($o);
    }
    // Create our Application instance.
    $facebook = new Facebook(array(
      'appId'  => $fbconfig['appid'],
      'secret' => $fbconfig['secret'],
      'cookie' => true,
    ));

    //Facebook Authentication part
    $facebook_user = $facebook->getUser();
    // We may or may not have this data based 
    // on whether the user is logged in.
    // If we have a $facebook_user id here, it means we know 
    // the user is logged into
    // Facebook, but we don’t know if the access token is valid. An access
    // token is invalid if the user logged out of Facebook.
    
    $loginUrl   = $facebook->getLoginUrl(
            array(
                'scope'         => 'email,offline_access,publish_stream,user_birthday,user_location,user_work_history,user_about_me,user_hometown',
                'redirect_uri'  => $fbconfig['baseurl']
            )
    );
    
    $logoutUrl  = $facebook->getLogoutUrl();
    echo 'facebook_user '.$facebook_user;
    if ($facebook_user) {
      try {
        // Proceed knowing you have a logged in user who's authenticated.
        $facebook_user_profile = $facebook->api('/me');
      } catch (FacebookApiException $e) {
        //you should use error_log($e); instead of printing the info on browser
        d($e);  // d is a debug function defined at the end of this file
        $facebook_user = null;
      }
    }
    

	

	echo 'user_pro '.$facebook_user_profile;

    //if user is logged in and session is valid.
    if ($facebook_user){
        //get user basic description
        $facebook_userInfo = $facebook->api("/$facebook_user");
        
        //fql query example using legacy method call and passing parameter
        try{
            $fql    =   "select name, hometown_location, sex, pic_square from user where uid=" . $facebook_user;
            $param  =   array(
                'method'    => 'fql.query',
                'query'     => $fql,
                'callback'  => ''
            );
            $fqlResult   =   $facebook->api($param);
        }
        catch(Exception $o){
            d($o);
        }
    }
    
    function d($d){
        echo '<pre>';
        print_r($d);
        echo '</pre>';
    }
?>
