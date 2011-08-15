var Client = {
  pubsub_server: 'pubsub.' + Config.XMPP_SERVER,
  connection: null,
  subscribed: false,
  show_raw: true,
  show_log: true,
  NS_DATA_FORMS: "jabber:x:data",
  NS_PUBSUB: "http://jabber.org/protocol/pubsub",
  NS_PUBSUB_OWNER: "http://jabber.org/protocol/pubsub#owner",
  NS_PUBSUB_ERRORS: "http://jabber.org/protocol/pubsub#errors",
  NS_PUBSUB_NODE_CONFIG: "http://jabber.org/protocol/pubsub#node_config",
  PUBSUB_NODE:'hackaton_video',
	
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

  // called when data is deemed as sent
  on_send: function (data) {
    console.log("Data Sent");
    return true;
  },

  // push the data to the clients
  publish: function (data) {
    if (data.message == '') return;
    var _d = $build('data', { 'type' : data.type }).t(data.message).toString(); 

    Control.connection.pubsub.publish(
      Control.admin_jid,
      Control.pubsub_server,
      Client.PUBSUB_NODE,
      [_d],
      Control.on_send
    );
  },

  // initialiser
  init: function () {
    //Client.connection.send($pres());
  //  var _p = $('#publish');
//_p.fadeIn();

    Client.publish(_obj);    

    return false;
  },

  // called when we have either created a node
  // or the one we're creating is available
  on_create_node: function (data) {
    //Control.feedback('Connected', '#00FF00');
    Client.init();
  },

  // simplify connection status messages
  feedback: function(msg, col) {
    $('#connection_status').html(msg).css('color', col);
  },


  // inject text
  doCommand: function (m, i) {
 //   $('#message').text(m);
	var itemId = i;
	var command = m;
	
	console.log('command is' +m);
	
	if (command == 'forward'){
		currentTime = player.getPlayheadTime();
		player.setPlayheadTime(currentTime + step);
	}else{
		currentTime = player.getPlayheadTime();
		player.setPlayheadTime(currentTime - step);
	}
	
  },

  // called when data is deemed as sent
  on_send: function (data) {
    console.log("Data Sent");
   // $('#message').val('');
   // $('#progress').text('message sent').fadeIn().fadeOut(5000);
    return true;
  },

  on_event: function (message) {
	console.log('onevent');
    if (!Client.subscribed) {
      return true;
    }
	console.log('message = '+message);
    var server = "^" + Client.pubsub_server.replace(/\./g, "\\.");
    var re = new RegExp(server);

    if ($(message).attr('from').match(re))
    { 
	 var _node = $(message).children('event')
        .children('items').attr('node');
	console.log("node is "+ _node);
 	if(_node == 'hackaton_video'){

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
        Client.doCommand(_data, _item);
      }
    }
  }
    return true;
  },

  on_subscribe: function (sub) {
	console.log('on_subscribe')
    Client.subscribed = true;
    Client.log("Now awaiting messages...");
    Client.feedback('Connected', '#00FF00');
     Client.connection.sendIQ(
       $iq({to: 'pubsub.logoslogic.com',
             type: "get"})
            .c('pubsub', {xmlns: "http://jabber.org/protocol/pubsub"})
            .c('items', {node: Client.PUBSUB_NODE,max_items: '10'}),Client.on_old_items); 
    return true;
  },

  on_old_items: function (iq) {
	console.log('on_old_items');
      $(iq).find('item').each(function () {
          Client.on_event2(this);
      });
  },

  on_event2: function (msg) {
	  var _data = $(msg).children('entry').text();
	 console.log('match _data '+_data);

      var _item = $(msg).attr('id');

	 console.log('_item=' +_item );


      if (_data) {
        Client.doCommand(_data, _item);
      }
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
      //Client.connection.send($pres().c('priority').t('-1'));
      Client.connection.pubsub.subscribe(
        Client.connection.jid,
	'pubsub.' + Config.XMPP_SERVER,
    	'hackaton_video',
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

  //Client.connection.connect(Config.XMPP_SERVER + '/pubsub','',Client.on_connect);
});
