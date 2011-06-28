/* 
 * LivingRoomAPI
 */
/**
 * Set a variable witch contains the application url.
 */
var APP_DOMAIN_URL = 'logoslogic.com';


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
var conferenceSubdomain = "conference";

/**
 * Definition of a variable able to contains the public chat room name.
 */
var publicRoomName = 'public2';

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
	appID: '185799971471968',

	//Facebook ApiKey
	apiKey: '890371389f70376cd1070bde244c8f37',

	//Facebook ApiSecret
	apiSecret: '0b12772274eee9f8341ff88827654647'
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

App.Util = {
	
	facebookAccessToken: '',
	
	setFacebookTokenFromUrl: function(){
		queryObj = {};
        var qs = window.location.href;
		var fragments = qs.split('#');
		//console.log('fragments  '+fragments);
		if (fragments.length >= 2) {
			var final = fragments[1].indexOf('&expires_in=')
            qs = fragments[1].substring(13, final);
			this.facebookAccessToken = qs;
        }else{
			this.facebookAccessToken = "";
		}
	}
}

function delCookie(name) {
	document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}
