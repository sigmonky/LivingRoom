var StropheVcard = function(window, $) {
    var BOSH_URL = "/http-bind";
    var DOMAIN = "logoslogic.com";
    var con = null;
    var _connected = false;
    var onResult = function(stanza) {
    };
    var obj = {
        init: function() {
            conn = new Strophe.Connection("http://www.logoslogic.com/http-bind");            
        },
        connected: function() {
            return _connected;
        },
        get: function(handler, jid) {
            conn.vcard.get(handler, jid);
			console.log('get')

        },
        disconnect: function() {
            conn.disconnect();
        },

        connect: function(handler) {
			console.log('connect');
	
            conn.connect('isaacueca@logoslogic.com','cigano', function (status) {
                if (status === Strophe.Status.CONNECTED) {
					console.log('connected')
                    _connected = true;
                    handler();
                }
            });
        }
    };
    return obj;
}(window, jQuery);

$(document).ready(function(){
	console.log('ready');
/*	var conn = new Strophe.Connection("http://www.logoslogic.com/http-bind");
	
	conn.connect(data.jid, data.password, function (status) {
	        if (status === Strophe.Status.CONNECTED) {
				console.log('CONNECTED')
	        } else if (status === Strophe.Status.DISCONNECTED) {
				console.log('DISCONNECTED')
	        }
	 });*/
	
    StropheVcard.init();
    StropheVcard.connect(function() {
        StropheVcard.get(function(stanza) {
		console.log('handler');
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
            var type = $vCard.find('TYPE').text();
            var img_src = 'data:'+type+';base64,'+img;
            //display image using localStorage
            var ctx = $('#example').get(0).getContext('2d');
            var img = new Image();   // Create new Image object
            img.onload = function(){
                // execute drawImage statements here
                ctx.drawImage(img,0,0)
            }
            img.src = img_src;
        },
                         "isaacueca@logoslogic.com");
    });
    //StropheVcard.disconnect();
});