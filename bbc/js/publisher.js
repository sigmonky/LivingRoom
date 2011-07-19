var Control = {
  // start admin credentials
  admin_jid: 'isaacueca@logoslogic.com',
  admin_pass: 'cigano',
  // end admin credentials

  pubsub_server: 'pubsub.' + Config.XMPP_SERVER,
  connection: null,
  connected: false,
  show_raw: true,
  show_log: true,

  NS_DATA_FORMS: "jabber:x:data",
  NS_PUBSUB: "http://jabber.org/protocol/pubsub",
  NS_PUBSUB_OWNER: "http://jabber.org/protocol/pubsub#owner",
  NS_PUBSUB_ERRORS: "http://jabber.org/protocol/pubsub#errors",
  NS_PUBSUB_NODE_CONFIG: "http://jabber.org/protocol/pubsub#node_config",


  // log to console if available
  log: function (msg) { 
    if (Control.show_log && window.console) {
      console.log(msg);
    }
  },

  // simplify connection status messages
  feedback: function(msg, col) {
    $('#connection_status').html(msg).css('color', col);
  },
  
  // show the raw XMPP information coming in
  raw_input: function (data)  { 
    if (Control.show_raw) {
      Control.log('RECV: ' + data);
    }
  },

  // show the raw XMPP information going out
  raw_output: function (data) { 
    if (Control.show_raw) {
      Control.log('SENT: ' + data);
    }
  },

  // called when data is deemed as sent
  on_send: function (data) {
    Control.log("Data Sent");
    $('#message').val('');
    $('#progress').text('message sent').fadeIn().fadeOut(5000);

    return true;
  },

  // push the data to the Controls
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
    Control.connection.send($pres());
    var _p = $('#publish');
    _p.fadeIn();

    _p.click(function(event) {
      event.preventDefault();

      var _obj = {
        'message' : $('textarea').val(),
        'type'    : MessageType[$('input:radio:checked').val()]
      }

      Control.publish(_obj);    
    });

    return false;
  },

  configured: function(){
	console.log('configured');
  },

  configured_error: function(){
	console.log('configured error');
  },


  // called when we have either created a node
  // or the one we're creating is available
  on_create_node: function (data) {
    Control.feedback('Connected', '#00FF00');
    Control.init();
   var configiq = $iq({to: Control.pubsub_server,
                        type: "set"})
        .c('pubsub', {xmlns: Control.NS_PUBSUB_OWNER})
        .c('configure', {node: Config.PUBSUB_NODE})
        .c('x', {xmlns: Control.NS_DATA_FORMS,
                 type: "submit"})
        .c('field', {"var": "FORM_TYPE", type: "hidden"})
        .c('value').t(Control.NS_PUBSUB_NODE_CONFIG)
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
    Control.connection.sendIQ(configiq,
                                 Control.configured,
                                 Control.configure_error);
  },
}

$(document).ready(function () {
  Control.log('Ready to go...');
  $(document).trigger('connect');
});

// this does the initial connection to the XMPP server
$(document).bind('connect', function () {
  var conn = new Strophe.Connection(Config.BOSH_SERVICE);
  Control.connection = conn;
  Control.connection.rawInput = Control.raw_input;
  Control.connection.rawOutput = Control.raw_output;
  Control.connection.addHandler(Control.on_result, null, "message", null, null);
  Control.connection.connect(
    Control.admin_jid, Control.admin_pass, function (status) {
      if (status == Strophe.Status.CONNECTING) {
        Control.log('Connecting...');
        Control.feedback('Connecting... (1 of 2)', '#009900');
      } else if (status == Strophe.Status.CONNFAIL) {
        Control.log('Failed to connect!');
        Control.feedback('Connection failed', '#FF0000');
      } else if (status == Strophe.Status.DISCONNECTING) {
        Control.log('Disconnecting...');
        Control.feedback('Disconnecting...', '#CC6600');
      } else if (status == Strophe.Status.DISCONNECTED) {
        Control.log('Disconnected');
        Control.feedback('Disconnected', '#aa0000');
        $(document).trigger('disconnected');
      } else if (status == Strophe.Status.CONNECTED) {
        $(document).trigger('connected');
      }
    }
  );
});

$(document).bind('connected', function () {
  Control.feedback('Connecting... (2 of 3)', '#00CC00');

  // first we make sure the pubsub node exists
  // buy trying to create it again
  Control.connection.pubsub.createNode(
    Control.admin_jid,
    Control.pubsub_server,
    Config.PUBSUB_NODE,
    {},
    Control.on_create_node
  );
});

$(document).bind('disconnected', function () {
  Control.log('Disconnected, goodbye');
  Control.feedback('Disconnected', '#dd0000');
});

