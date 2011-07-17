var Client = {
  pubsub_server: 'pubsub.' + Config.XMPP_SERVER,
  connection: null,
  subscribed: false,
  show_raw: true,
  show_log: true,

  // log to console if available
  log: function (msg) { 
    if (Client.show_log && window.console) { console.log(msg); }
  },

  // show the raw XMPP information coming in
  raw_input: function (data)  {
    if (Client.show_raw) {
      Client.log('RECV: ' + data);
    }
  },

  // show the raw XMPP information going out
  raw_output: function (data) { 
    if (Client.show_raw) {
      Client.log('SENT: ' + data);
    }
  },

  // simplify connection status messages
  feedback: function(msg, col) {
    $('#connection_status').html(msg).css('color', col);
  },

  // decide what to do with an incoming message
  handle_update: function (data) {
    var _d = $(data);
    var _message = _d.html();
    var _type = _d.attr('type'); 
	console.log('message=' +_message );
    Client.show_text(_message);
    
  },

  // inject text
  show_text: function (m, i) {
 //   $('#message').text(m);
	var itemId = i;

	$('#message').append('<div class="message-item" id='+itemId+'>' + m + '<div class="controls"><a class="delete" href="#">Delete</a> | <a class="approve" href="#">Aprove</a></div></div><br/><br/>');
  },


  on_event: function (message) {
	console.log('onevent');
    if (!Client.subscribed) {
      return true;
    }

    var server = "^" + Client.pubsub_server.replace(/\./g, "\\.");
    var re = new RegExp(server);

//    if ($(message).attr('from').match(re) && $(message).attr('type') == 'headline')
  //  { 
      var _data = $(message).children('event')
        .children('items')
        .children('item')
        .children('entry').text();
		console.log('match _data '+_data);
		
      var _item = $(message).children('event')
        .children('items')
        .children('item').attr('id');

		console.log('_item=' +_item );


      if (_data) {
        Client.show_text(_data, _item);
      }
   // }

    return true;
  },

  on_subscribe: function (sub) {
    Client.subscribed = true;
    Client.log("Now awaiting messages...");
    Client.feedback('Connected', '#00FF00');

    return true;
  },

  on_connect: function (status) {
    if (status == Strophe.Status.CONNECTING) {
      Client.log('Connecting...');
      Client.feedback('Connecting... (1 of 2)', '#009900');
    } else if (status == Strophe.Status.CONNFAIL) {
      Client.log('Failed to connect!');
      Client.feedback('Connection failed', '#FF0000');
    } else if (status == Strophe.Status.DISCONNECTING) {
      Client.log('Disconnecting...');
      Client.feedback('Disconnecting...', '#CC6600');
    } else if (status == Strophe.Status.DISCONNECTED) {
      Client.log('Disconnected');
      Client.feedback('Disconnected', '#aa0000');
    } else if (status == Strophe.Status.CONNECTED) {
      Client.log("Almost done...");
      Client.feedback('Connecting... (2 of 2)', '#009900');
      Client.connection.send($pres().c('priority').t('-1'));
      Client.connection.pubsub.subscribe(
        Client.connection.jid,
	'pubsub.' + Config.XMPP_SERVER,
        'moderator',
        [],
        Client.on_event,
        Client.on_subscribe
      );
    }
    return true;
  }
}

$(document).ready(function () {
  var conn = new Strophe.Connection(Config.BOSH_SERVICE);
  Client.connection = conn;
  Client.connection.rawInput = Client.raw_input;
  Client.connection.rawOutput = Client.raw_output;

  Client.connection.connect('isaacueca@logoslogic.com','cigano', Client.on_connect);

		
		$('.delete').live('click', function() {
			var itemId = $(this).parent().parent().attr("id");
			console.log('delete itemId = '+itemId);
			
		});
		
		$('.approve').live('click', function(event) {
			var itemId = $(this).parent().parent().attr("id");
			console.log('approve itemId = '+itemId);
		});
  //Client.connection.connect(Config.XMPP_SERVER + '/pubsub','',Client.on_connect);
});
