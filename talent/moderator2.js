var connection = null;
var current_page = 0;
var ignore = true;

function publish(page) {
  connection.pubsub.publish(connection.jid,
			    PUBSUB_SERVER,
			    PUBSUB_NODE,
			    [page.toString()],
			    log
			    );
  current_page = page;
  
}


function onEvent(message) {
	console.log('onEvent.')
	
 PUBSUB_SERVER = 'pubsub.logoslogic.com'
  var server = "^"+PUBSUB_SERVER.replace(/\./g, "\\.");
  var re = new RegExp(server);
  // Only handle messages from the PubSub Server. 
  if ($(message).attr('from').match(re)) {
    // Grab pubsub entry page number
    var event = $(message).children('event')
      .children('items')
      .children('item')
      .children('entry').text();

    if (ignore) {
      //short circuit first event
      ignore = false;
      return true;
    }

	   var itemId = $(message).children('event')
	      .children('items')
	      .children('item').getAttribute('id');

	 				$('#message-list').append('<div class="message-item" id='+itemId+'>' + event + '<div class="controls"><a class="delete" href="#">Delete</a> | <a class="approve" href="#">Aprove</a></div></div>');
  }
  // Return true or we loose this callback.
  return true;
}

function log(msg) 
{
    $('#log').prepend('<div></div>').prepend(document.createTextNode(msg));
}

function debug(msg) 
{
    $('#debug').append('<div></div>').append(document.createTextNode(msg));
}

function rawInput(data)
{
    debug('RECV: ' + data);
}

function rawOutput(data)
{
    debug('SENT: ' + data);
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting 1.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
	$('#log').empty();
	$('#debug').empty();
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	alert('connected.');
	connection.send($pres());
	
	connection.pubsub.subscribe(connection.jid,
				    'pubsub.logoslogic.com',
				    'moderator',
				    [],
				    onEvent,
				    onSubscribe
				    );
    }
}



$(document).ready(function () {
    connection = new Strophe.Connection('http://www.logoslogic.com/http-bind');
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    connection.connect('isaacueca@logoslogic.com','cigano', onConnect);

		
		$('.delete').live('click', function() {
			var itemId = $(this).parent().parent().attr("id");
			console.log('delete itemId = '+itemId);
			
		});
		
		$('.approve').live('click', function(event) {
			var itemId = $(this).parent().parent().attr("id");
			console.log('approve itemId = '+itemId);
		});

});