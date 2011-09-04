var app;

window.chat = new Jabber.Xmpp();

$(document).ready(function(){

  	app = new App();
 	app.init();
	Backbone.history.start();

	$(function(){
		//To get the random tabs label with variable length for testing the calculations			
		//example 
		 $('#chat-area')
			.tabs()
			.scrollabletabs({
				customNavNext:'#n',
				customNavPrev:'#p',
				customNavFirst:'#f',
				customNavLast:'#l'//,
				//easing : 'easeInBounce'
			});

	});

	
});


function log(msg)
{
	$('#log').append('<div></div>').append(
	document.createTextNode(msg));
}

function onConnect(){
	log('on connect');
}

function FacebookNewInvite(){
        var receiverUserIds = FB.ui({ 
             method : 'apprequests',
             message: 'Come on man checkout SouthPark',
        },

       function(receiverUserIds) {
                   console.log("IDS : " + receiverUserIds.request_ids);
        }
      );
}

function onConnect(status)
{
	if (status == Strophe.Status.DISCONNECTED)
	log('Disconnected.');
}

function onResult(iq) {
	var elapsed = (new Date()) - startTime;
	log('Response from jabber.org took ' + elapsed + 'ms.');
}

function stripslashes (str) {
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +      fixed by: Mick@el
    // +   improved by: marrtins    // +   bugfixed by: Onno Marsman
    // +   improved by: rezna
    // +   input by: Rick Waldron
    // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   input by: Brant Messenger (http://www.brantmessenger.com/)    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: stripslashes('Kevin\'s code');
    // *     returns 1: "Kevin's code"
    // *     example 2: stripslashes('Kevin\\\'s code');
    // *     returns 2: "Kevin\'s code"    return (str + '').replace(/\\(.?)/g, function (s, n1) {
        switch (n1) {
        case '\\':
            return '\\';
        case '0':            return '\u0000';
        case '':
            return '';
        default:
            return n1;        
		}
}

// 
// function log() {
//   if (typeof console == 'undefined') {  
//     return;  
//   }  
//   console.log.apply(console, arguments);
// }