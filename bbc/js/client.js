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
      Config.PUBSUB_NODE,
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

	console.log('oncreate_node');
    Client.init();

    var configiq = $iq({to: Client.pubsub_server,
                        type: "set"})
        .c('pubsub', {xmlns: Client.NS_PUBSUB_OWNER})
        .c('configure', {node: Config.PUBSUB_NODE})
        .c('x', {xmlns: Client.NS_DATA_FORMS,
                 type: "submit"})
        .c('field', {"var": "FORM_TYPE", type: "hidden"})
        .c('value').t(Client.NS_PUBSUB_NODE_CONFIG)
        .up().up()
        .c('field', {"var": "pubsub#deliver_payloads"})
        .c('value').t("1")
        .up().up()
        .c('field', {"var": "pubsub#send_last_published_item"})
        .c('value').t("never")
        .up().up()
        .c('field', {"var": "pubsub#persist_items"})
        .c('value').t("true")
        .up().up()
        .c('field', {"var": "pubsub#max_items"})
        .c('value').t("20");
    Client.connection.sendIQ(configiq,
                                 Client.configured,
                                 Client.configure_error);
  },
  configured: function (iq) {
      console.log('configured');
	
  },

  configure_error: function (iq) {
      console.log('configure_error');
	
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

	$('#message').append('<div class="message-item" id='+itemId+'>' + m + '<div class="controls"><a class="delete" href="#">Delete</a> | <a class="approve" href="#">Aprove</a></div></div>');
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

    var server = "^" + Client.pubsub_server.replace(/\./g, "\\.");
    var re = new RegExp(server);

    if ($(message).attr('from').match(re))
    { 
	 var _node = $(message).children('event')
        .children('items').attr('node');
	console.log("node is "+ _node);
 	if(_node == Config.PUBSUB_NODE){

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
             type: "set"})
            .c('pubsub', {xmlns: "http://jabber.org/protocol/pubsub#owner"})
            .c('items', {node: Config.PUBSUB_NODE,jid: 'zack@logoslogic.com'}),Client.on_old_items); 
    return true;
  },

  on_old_items: function (iq) {
	console.log('on_old_items');
      $(iq).find('item').each(function () {
          Client.on_event(this);
      });
  },

  on_create_node: function(){
	console.log('node created');
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
    	Config.PUBSUB_NODE,
        [],
        Client.on_event,
        Client.on_subscribe
      );

	  Client.connection.pubsub.createNode(
	    Client.connection.jid,
	    'pubsub.' + Config.XMPP_SERVER,
	    Config.PUBSUB_APPROVED_NODE,
	    {},
	    Client.on_create_node
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

  Client.connection.connect('zack@logoslogic.com','zack', Client.on_connect);

		$('.delete').live('click', function() {
			var itemId = $(this).parent().parent().attr("id");
			console.log('delete itemId = '+itemId);
			var that = $(this);
			$(this).parent().parent().fadeOut('1000', function(){that.hide(); that.remove();})
			
		});
		
		$('.approve').live('click', function(event) {
			if ($(this).text() == "Approved"){alert('Message Already Approved');}
			$(this).text('Approved');
			var itemId = $(this).parent().parent().attr("id");
			console.log('approve itemId = '+itemId);
			var item = $(this).parent().parent();
			var message = $(item).children(':first').text();
			
			console.log('approve message = '+message);

		   Client.connection.pubsub.publish(
		      'zack@logoslogic.com',
		      Client.pubsub_server,
		      Config.PUBSUB_APPROVED_NODE,
		      [message],
		      Client.on_send); 
		});
  //Client.connection.connect(Config.XMPP_SERVER + '/pubsub','',Client.on_connect);
});
