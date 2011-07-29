/* 
 * TouchChat
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */
/**
 * Set a variable witch contains the application url.
 */
var APP_DOMAIN_URL = 'http://localhost:8080/TouchChat';

/**
 * Set a variable witch contains the url to get all the php data bridges
 * used by the application to get data from server.
 */
var APP_DATA_BRIDGES = APP_DOMAIN_URL + '/php-data-bridges';

/**
 * Set a variable witch contains the url to the resources images.
 */
var APP_IMAGES = APP_DOMAIN_URL + '/resources/images';

/*
 * Set a variable witch contains the logged user informations.
 */
var userLogin = undefined;

/*
 * Definition of the component able to allow the real time communication system,
 * inside the facebook chat.
 */
var facebookClient = undefined;

/*
 * Definition of the component able to allow the real time communication system,
 * thanks to the jabber server.
 */
var jabberClient = undefined;

/*
 * Definition of the conference subdomain.
 */
var conferenceSubdomain = undefined;

/**
 * Definition of a variable able to contains the public chat room name.
 */
var publicRoomName = 'southpark';

/**
 * Definition of a varieble that handle if the user is already logged in
 */
var loggedIn = false;

/**
 * Definition of a Loading Mask Panel.
 */
var loadingMask = new Ext.LoadMask(Ext.getBody(), {msg: "Please wait..."});

/**
 * Definition of a Facebook object that will contains all the
 * Facebook application parameters to let it properly works.
 */
var facebook = {

	//Facebook AppID
	appID: '173510262707108',
	
	//Facebook ApiKey
	apiKey: 'd0a2e9957487490b93995dbd4f9248c0',
	
	//Facebook ApiSecret
	apiSecret: 'd907a5ef656aa18d6194095b21f61bad'
};

var createXMLDoc = function(xmlString){ 
	var parser = new DOMParser(); 
  	var xmlDocument = parser.parseFromString(xmlString, "text/xml"); 
  	return xmlDocument; 
};

function setCookie(c_name, value, exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function delCookie(name) {
	document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}