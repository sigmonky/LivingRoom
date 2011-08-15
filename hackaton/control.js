var connection = null;
var current_page = 0;
var ignore = true;

function publish(page) {
  connection.pubsub.publish(connection.jid,
			    PUBSUB_SERVER,
			    'hackaton_video',
			    [page],
			    log
			    );
 
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
	connection.send($pres());
    }
}



$(document).ready(function () {
    connection = new Strophe.Connection('http://www.logoslogic.com/http-bind');
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;


	connection.connect('isaacueca@logoslogic.com','cigano', onConnect);


    $('#back').click(function () {
	log("back");
	publish('back');
      });

    $('#forward').click(function () {
	log("forward");
	publish('forward');
      });

    $('#pause').click(function () {
	log("pause");
	publish('pause');
      });

    $('#play').click(function () {
	log("play");
	publish('play');
      });


});