var current_page = 0;
var ignore = true;

$(document).ready(function () {
	
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    connection.connect('isaacueca2@logoslogic.com', 'cigano', onConnect);

	function onConnect(status)
	{
	  // This function is taken from the basic example and 
	  // when we are connected we send presence and subscribe to
	  // the presentation node. 
	    if (status == Strophe.Status.CONNECTING) {
		log('Strophe is connecting.');
		alert('Strophe is connecting.')
	    } else if (status == Strophe.Status.CONNFAIL) {
		log('Strophe failed to connect.');
		$('#connect').get(0).value = 'connect';
	    } else if (status == Strophe.Status.DISCONNECTING) {
		log('Strophe is disconnecting.');
	    } else if (status == Strophe.Status.DISCONNECTED) {
		log('Strophe is disconnected.');
		$('#connect').get(0).value = 'connect';
	    } else if (status == Strophe.Status.CONNECTED) {
		log('Strophe is connected.');
	//	alert('Strophe is connected.')

		connection.send($pres());
		connection.pubsub.subscribe(connection.jid,
					    'pubsub.logoslogic.com',
					    'moderator',
					    [],
					    onEvent,
					    onSubscribe
					    );
	    }
	    return true;
	}


		
		function onEvent(message) {
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

		    go_page = parseInt(event); // The event should be the current page #
		    if (go_page >= 0) { // Only handle page # events
		      // I would have liked to use goTo but the function would cause and odd
		      // jump to the home page then the correct page. So I added a bit off 
		      // logic to make it look good when transitioning pages.
		      if (current_page+1 == go_page) {
			go(1);
		      } else if (current_page-1 == go_page) {
			go(-1);
		      } else {
			goTo(go_page);
		      }
		      current_page = go_page;
		    }
		  }
		  // Return true or we loose this callback.
		  return true;
		}


		function onSubscribe(sub) {
		  // Log when we are subscribed.
		  log("Subscribed");
		  return true;
		}
		
		function onEvent(message) {

				
 				$('#message-list').append('<div class="message-item" id='+itemId+'>' + event + '<div class="controls"><a class="delete" href="#">Delete</a> | <a class="approve" href="#">Aprove</a></div></div>');
				console.log('event =' +event);

		}
		
		$('.delete').live('click', function() {
			var itemId = $(this).parent().parent().attr("id");
			console.log('delete itemId = '+itemId);
			
			var v = new JSJaCLeaf();
			
			v.setFrom('isaacueca2@logoslogic.com');
			v.setTo('pubsub.logoslogic.com');
			v.setType('set');
			v.setID('retract1');
		
			v.setPubsub('http://jabber.org/protocol/pubsub','presentation');
			v.retractNode('presentation', itemId);
			jabberConnection.send(v);
			
		});
		
		$('.approve').live('click', function(event) {
			var itemId = $(this).parent().parent().attr("id");
			console.log('approve itemId = '+itemId);
		});	
		
	

		
});