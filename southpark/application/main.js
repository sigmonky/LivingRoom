var app;
	
$(function(){
	window.chat = new Jabber.Xmpp({
        autoConnect: true,
        view_el_id: 'chat',
        autoChat: true
    });

});

$(document).ready(function(){

	//   	app = new App();
	//  	app.init();
	// Backbone.history.start();
	// 
	// $(function(){
	// 	//To get the random tabs label with variable length for testing the calculations			
	// 	//example 
	// 	 $('#chat-area')
	// 		.tabs()
	// 		.scrollabletabs({
	// 			customNavNext:'#n',
	// 			customNavPrev:'#p',
	// 			customNavFirst:'#f',
	// 			customNavLast:'#l'//,
	// 			//easing : 'easeInBounce'
	// 		});
	// 
	// });

	
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


// 
// function log() {
//   if (typeof console == 'undefined') {  
//     return;  
//   }  
//   console.log.apply(console, arguments);
// }