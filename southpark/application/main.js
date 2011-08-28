$(document).ready(function(){


  	window.app = MainController.init();   
  	
	$('input[name=message]').focus();  


});


function DebuggerLog(msg)
{
	$('#log').append('<div></div>').append(
	document.createTextNode(msg));
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


function log() {
  if (typeof console == 'undefined') {  
    return;  
  }  
  console.log.apply(console, arguments);
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