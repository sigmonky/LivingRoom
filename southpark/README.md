![otalk - the open web chat client, by: &yet](https://github.com/andyet/otalk/raw/master/images/otalk_logo.png)

## About
Learn all about otalk on [otalk.org](http://otalk.org).

In short, otalk is an MIT licensed project by [&yet](http://andyet.net) ([@andyet on twitter](http://twitter.com/andyet)). The project is managed by [@adambrault](http://twitter.com/adambrault). A lot of the js was written by [@HenrikJoreteg](http://twitter.com/henrikjoreteg) and [@grelement](http://twitter.com/grelement) with XMPP oversight and guidance from [@fritzy](http://twitter.com/fritzy) who happens to be part of the [6-person XMPP Council](http://xmpp.org/council/). The logo and interface was designed by [@amydearest](http://twitter.com/amydearest).

You can learn more about &yet's XMPP consulting services on [XMPPconsulting.com](http://xmppconsulting.com).

## otalk uses the following libraries

- [Strophe.js](http://code.stanziq.com/strophe/) - big thanks to [@metajack](http://metajack.im/) for this library and his [incredible XMPP book](http://professionalxmpp.com/). A lot of the plugin patterns came from this book. Also, the MUC plugin is a modified version of [the one in the Strophe.js repo](http://github.com/metajack/strophejs/tree/master/plugins/).
- [jQuery](http://jquery.com) - for general awesomeness.
- [Mustache.js](http://github.com/janl/mustache.js) - for templating for the UI
- [ICanHaz.js](http://github.com/andyet/ICanHaz.js) - for template retrieval


## Architecture

A fundamental design decision for otalk is to handle all XMPP stanzas in Strophe connection plugins. XML shouldn't be passed to the app that builds the UI. Period.

This approach makes the code as reusable as possible and provides better encapsulation.

By convention the plugins will all look for an optional global object called "StropheConfig" that contains all settings and callback functions that each plugin may want to use. If that global config object doesn't exist, the plugins will simply trigger events on the document that the app can listen for. 

Following is a simplified, over-commented portion of the MUC plugin that translates the incoming MUC messages into a JS object literal that is passed to the registered handler or triggers a document level event called 'mucMessageReceived':

	handleMucMessage: function (message) {
		var result = {};
		
		// we'll just cache the jquery object for efficiency
		message = $(message);
		
		// grab the room
		result.room = message.attr('from').split('/')[0];
		
		// grab the plain text body
		result.body = message.find('> body').text();
		
		// grab the HTML body if it exists
		result.html_body = message.find('html[xmlns="http://jabber.org/protocol/xhtml-im"] > body').html();
		
		// look for the global StropheConfig object
		if (StropheConfig && $.isFunction(StropheConfig.handleMucMessage)) {
			// call the function with the result object
			StropheConfig.handleMucMessage(result);
		}
		// otherwise just trigger the 'mucMessageReceived' event on the document
		// and pass it the result.
		else {
			$(document).trigger('mucMessageReceived', result);
		}
		
		// return true so Strophe doesn't delete the handler stays
		return true;
	}

The app that implements the plugin could have something like this:
	
	// our app
	my_app = function (connection) {
		this.app_rocks = true;
		this.conn = connection;
	};
	
	// add a function
	my_app.prototype.handleMucMessage = function (message_object) {
		// here we'd just get a JS object that we could use to build our UI.
		console.log(message_object.body);
	};

	// our global config object
	StropheConfig = {
		// our function
		mucMessageReceived: my_app.handleMucMessage,
		
		// other example handlers
		chatMessageReceived: my_app.handleChatMessage,
		chatStateReceived: my_app.handleChatState
	};


## The otalk UI
otalk's UI, is quite rough at the moment. But, it isn't going to cater to old, crappy browsers. It will use HTML 5 features unashamedly. 


## The Plugins
The plugins, however, should be a bit more tolerant of older browsers. For example, if they use localStorage, they should try to use it for progressive enhancement and should check for the existence of the localStorage object first. 

For example, the strophe.status.js plugin uses localStorage to maintain availability and custom status messages between sessions. Here's an example from the strophe.status.js plugin that using localStorage safely:

	init: function (connection) {
		this.connection = connection;
		
		// set a flag for if we can save stuff to local
		this.storageAvailable = (JSON && localStorage) ? true : false;
		
		// try to retrieve status from localStorage
		if (this.storageAvailable && localStorage.otalk_status) {
			this.status = JSON.parse(localStorage.otalk_status);
		}
		else {
			this.status = {
				show: '',
				statusMessage: ''
			};
		}
	}
	
*All* xml parsing in plugins should be done with jQuery to ensure best cross-browser compatibility possible.


## Contributions Welcome
To make life easier for development, otalk looks for a 'jid' and a 'password' in localStorage when it loads, so although it's not secure it's a way to avoid having to enter your jabber login info every time you refresh the page. Just use your browser's javascript console to set localStorage.jid = "your@jid.yo" and localStorage.password = "your password". Just be aware that it's storing your password in plan text in your browser.

Issue tracking (which is essentially just a long list of features at this point) is being done using GitHub Issues on the project Github page. It will gradually turn into a list of bugs as the major holes are plugged. Much more work is left to make this complete.

Please make sure that you [JSLint](http://jslint.com) your code religiously before submitting it. Use the following config string for jslint:

	/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */

Fork it and send us pull requests. otalk is still very much a work in progress. But the goal it to make it a viable alternative to desktop clients like Adium or Pidgin.

If you have questions hit up [@HenrikJoreteg on twitter](http://twitter.com/HenrikJoreteg) or on chat/IM: henrik@andyet.net.