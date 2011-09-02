Ext.ns('App.util');


Ext.override(Ext.CompositeElementLite, (function(){

    var selType = /select-(one|multiple)/i,
        trailSpace = /\s*$/;
        
    function getInputValue(el) {
        var i, l, e, one, v, result, st;

        if (el.tagName == 'OPTION') {
            return (el.attributes.value || {}).specified ? el.value : el.text;
        }
        if(st = selType.exec(el.type)){
            if (st[1] == 'one') {
                for (i = 0, l = el.options.length; i < l; i++) {
                    if ((e = el.options[i]).selected) {
                        return getInputValue(e);
                    }
                }
            } else {
                return new Ext.CompositeElementLite(el.options).val();
            }
        }
        return el.value;
    }
    
    function getTextValue(el) {
        return (el.nodeType == 3)
            ? el.data.replace(trailSpace, '')
            : new Ext.CompositeElementLite(el.childNodes).text();
    }
    
    function setTextValue(el, t) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
        el.appendChild(el.ownerDocument.createTextNode(t));
    }

    return {
//      need this until next release - pulled in from full Ext
        fill : function(els){
            var me = this;

//          Keep reference to last version of self before refill
            me.prevObject = new me.constructor(me.elements);
    
            me.elements = [];
            me.add(els);
            return me;
        },

        val: function() {
            var me = this, i, l = me.elements.length, result;
            if (l == 1) {
                return getInputValue(me.elements[0]);
            }
            for (result = [], i = 0; i < l; i++) {
                result.push(getInputValue(me.elements[i]));
            }
            return result;
        },
    
        text: function(t) {
            var me = this, i, l = me.elements.length, v, el, result;
            if (l == 1) {
                el = me.elements[0];
                if (t !== undefined) setTextValue(el, t);
                return getTextValue(el);
            }
            for (result = [], i = 0; i < l; i++) {
                el = me.elements[i];
                if (t !== undefined) setTextValue(el, t);
                if (v = getTextValue(el)) {
                    result.push(v);
                }
            }
            return result.join(' ');
        },
    
        nextAll: function() {
            var els = this.elements, i, l = els.length, n, r = [], ri = -1;
            for (i = 0; i < l; i++) {
                for (n = els[i].nextSibling; n; n = n.nextSibling) {
                    r[++ri] = n;
                }
            }
            this.fill(r);
            return this;
        },
    
        andSelf: function() {
            if (this.prevObject) {
                this.add(this.prevObject.elements); // add takes an Array. Should it take another Composite???
            }
            return this;
        }
    };
})());

Ext.Element.prototype.selectChildren = function(){
	return this.select('> *');
};
/**
 * Socket.io  wrapper class
 * @class App.util.Socketio
 * @extends Ext.util.Observable
 */

var buildIq = function(type, from, jid, vCardEl) {
	console.log('buildIq');
    var iq;
    if (!jid)
    {
        //retrieve current jid's vCard
        iq = $iq({type:type, from:from});
    }
    else
    {
        iq = $iq({type:type, to:jid, from:from});
    }
    var ret = iq.c("vCard", {xmlns:Strophe.NS.VCARD});
    if (vCardEl)
    {
        ret = ret.cnode(vCardEl);
    }
    return ret;
};

App.util.Strophe = {
    connection: null,
    room: null,
    nickname: null,
    NS_MUC: "http://jabber.org/protocol/muc",
    joined: null,
    participants: null,
	username: null,
	avatar: null,
	incomingUsr: null,
	incomingMsg: null,
	
	StartConnection: function(url, username, pass){
		nickname = username;
		NS_MUC = "http://jabber.org/protocol/muc";
		username = username+"@afrogjumps.com";
	},
		// disconnecting from server
		disconnect: function(){
		    if(App.util.Strophe.con){
		        App.util.Strophe.con.disconnect();
		    }
		},

		room_joined: function(){
			console.log('room_joined');
			App.util.Strophe.joined = true;
			//connection_.add_message("<div class='notice'>*** Room joined.</div>")
			var msg = Ext.ModelMgr.create({user: 'admin', message: 'Room Joined'}, 'ChatMessage');
			//console.log('chat Store' +chatStore);
		    chatStore.add(msg);
		},

		user_joined: function(ev, nick){
			console.log('user_joined');
		    var message = {user:'cueca', message:'joined'};
			chatStore.add(message);

		},
		
		set_joined: function(){
			console.log('set_joined');
			App.util.Strophe.joined = true;
		},

		user_left: function(ev, nick){
			console.log('user_left');
		    var message = {user:'cueca', message:'joined'};
			chatStore.add(message);
		},

		on_presence: function (presence) {
		//	console.log('on_presence');
			//console.log('on_presence = ' +presence);
	       	var from = Ext.get(presence).getAttribute('from');
	        var room1 = Strophe.getBareJidFromJid(from);
	
		//	console.log('on_presence from' +from);
	
			//console.log('on_presence from '+from);
		//	console.log ('on_presence from = '+from);
		//	console.log ('on_presence room from JID = '+room1);
		//	console.log ('on_presence room class = '+App.util.Strophe.room);
		//	console.log ('on_presence from = '+from);
		/*		console.log('Ext.get(presence).getAttribute' +Ext.get(presence).getAttribute('type'));
			console.log('Joined = ' +App.util.Strophe.joined);
		*/	
	        // make sure message is from the right place
	
	    //	console.log('App.util.Strophe.participants[nick] ' +App.util.Strophe.participants[nick]);
    
	        if (room1 === App.util.Strophe.room) {
		
			//	console.log('room1');
		
				var nick = Strophe.getResourceFromJid(from);
	
			//	console.log('nick is '+nick);
	
    			var type  = Ext.get(presence).getAttribute('type') ;
			//	console.log('presence type ' +type);

				if (Ext.get(presence).getAttribute('type') === 'error' &&
	                !App.util.Strophe.joined) {
	                // error joining room; reset app
	                App.util.Strophe.connection.disconnect();
	            } else if (!App.util.Strophe.participants[nick] &&
	                Ext.get(presence).getAttribute('type') !== 'unavailable') {
		
					
					// add to participant list
	                
					var user_jid = Ext.get(presence).select('item');
					user_jid = user_jid.getAttribute('jid');
					console.log('nick' + nick);
					
	                App.util.Strophe.participants[nick] = user_jid || true;

			
	  				//$('#participant-list').append('<li>' + nick + '</li>');
				//	console.log('on_presence joined = ' + App.util.Strophe.joined);

	                if (App.util.Strophe.joined) {
						console.log('joined');
						Ext.dispatch({
							controller: 'Chat',
							action    : 'user_joined',
							aUser : nick
						});	                
					}
	            } else if (App.util.Strophe.participants[nick] &&
	                       Ext.get(presence).getAttribute('type') === 'unavailable') {
	                // remove from participants list
	               	console.log('user_left');
				
	 				/*$('#participant-list li').each(function () {
	                    if (nick === $(this).text()) {
	                        $(this).remove();
	                        return false;
	                    }
	                }); */
	
	
	
					Ext.dispatch({
						controller: 'Chat',
						action    : 'user_left'
					});
	            }
				console.log('3');

	            if (Ext.get(presence).getAttribute('type') !== 'error' && 
	                !App.util.Strophe.joined) {
	                // check for status 110 to see if it's our own presence
	                if (Ext.get(presence).query("status[code='110']").length > 0) {
	                    // check if server changed our nick
	                    if (Ext.get(presence).query("status[code='210']").length > 0) {
	                        App.util.Strophe.nickname = Strophe.getResourceFromJid(from);
	                    }
						console.log('room join complete');
	                    // room join complete
					//	this.room_joined();
						Ext.dispatch({
							controller: 'Chat',
							action    : 'room_joined',
						});
	                }
	            }
	        }

	        return true;

	    },

	
	    on_public_message: function (message) {
		//	console.log('on_public_message');
			
			var from  = Ext.get(message).getAttribute('from') ;
	        var room = Strophe.getBareJidFromJid(from);
	        var nick = Strophe.getResourceFromJid(from);
			
			console.log ('public from '+from);
			
	        // make sure message is from the right place
	        if (room === room) {
	            // is message from a user or the room itself?
	            var notice = !nick;

	            // messages from ourself will be styled differently
	            var nick_class = "nick";
	            if (nick === App.util.Strophe.nickname) {
	                nick_class += " self";
	            }

	            //var body = Ext.get(message).selectChildren('body').text();
				var body = Ext.get(message).select('body');
				body = body.text();
				
			//	console.log('on_public_message '+body);

	            var delayed = Ext.get(message).select("delay").length > 0  ||
	                Ext.get(message).select("x[xmlns='jabber:x:delay']").length > 0;

	            // look for room topic change
	         //   var subject = Ext.get(message).select('subject').html();
	           // if (subject) {
	           //     //$('#room-topic').text(subject);
	           // }

	            if (!notice) {
				//	console.log('body = '+body);
	                var delay_css = delayed ? " delayed" : "";
	                //var action = body.match(/\/me (.*)$/);
					var action= false;
					console.log('action ' + action);
	                if (!action) {
				//	console.log('add emssage =' +body);
					
						App.util.Strophe.add_message(nick, body);
	                   /* this.add_message(
	                        "<div class='message" + delay_css + "'>" +
	                            "&lt;<span class='" + nick_class + "'>" +
	                            nick + "</span>&gt; <span class='body'>" +
	                            body + "</span></div>"); */
	                } else {
	                /*    this.add_message(
	                        "<div class='message action " + delay_css + "'>" +
	                            "* " + nick + " " + action[1] + "</div>"); */
	                }
	            } else {
	               // this.add_message("<div class='notice'>*** " + body +
	                                  //  "</div>");
	            }
	        }

	        return true; 
	    },
		
		getVcard: function(){
			console.log('getVcard for user = ' +App.util.Strophe.username);
		//	App.util.Strophe.connection.vcard.get(App.util.Strophe.getVcardCallBack, App.util.Strophe.username+"@afrogjumps.com");
		
		var iq = buildIq("get", App.util.Strophe.connection.jid, App.util.Strophe.username);
        App.util.Strophe.connection.sendIQ(iq.tree(), App.util.Strophe.getVcardCallBack, null);
		
            
		},
		
		getVcardCallBack:function(stanza){
			console.log('getVcardCallBack');
			var vCard = Ext.get(stanza).select("vCard");
			console.log('vCard' +vCard);
            var img = vCard.select('BINVAL').text();
            var fullname = vCard.select('NICKNAME').text();
			console.log('NICKNAME ' +fullname);
		//	console.log('vCard img' +vCard);
            var type = vCard.select('TYPE').text();
		//	console.log('vCard type' +type);
            var img_src = 'data:'+type+';base64,'+img;
			App.util.Strophe.avatar = fullname;
			
			
			this.store = Ext.StoreMgr.get('ChatStore');
			var msg = Ext.ModelMgr.create({user: App.util.Strophe.incomingUser, message: App.util.Strophe.incomingMsg, facebook_photo:fullname}, 'ChatMessage');
			this.store.add(msg);
		},
		
		setVcard: function(){
			console.log('setVcard');
			
			var obj = App.Store.Facebook.getAt(0);
			var profilePhoto = obj.get('id');
			
		//	var vCardEl = {};
		//	vCardEl.FN = App.util.Strophe.username;
			var obj = App.Store.Facebook.getAt(0);
			var profilePhoto = obj.get('id');
			
			var vCardEl = document.createElement('nickname');
			var text = document.createTextNode(profilePhoto);
			vCardEl.appendChild(text);
			

	//		vCardEl.NICKNAME = profilePhoto;
			console.log('setVcard2 for connection jid = '+App.util.Strophe.connection.jid);
		    
		/*	App.util.Strophe.connection.vcard.set(function(){
				console.log('connection setVcard callback');
			}, vCardEl, App.util.Strophe.username) */
			
			
			var iq = App.util.Strophe.buildIq("set", App.util.Strophe.connection.jid, App.util.Strophe.username, vCardEl);
	        App.util.Strophe.connection.sendIQ(iq.tree(), App.util.Strophe.setVcardCallBack, null);
	
		    console.log('setVcard3');
			
		},
		
		buildIq: function(type, from, jid, vCardEl) {
			console.log('buildIq');
		    var iq;
		    if (!jid)
		    {
		        //retrieve current jid's vCard
		        iq = $iq({type:type, from:from});
		    }
		    else
		    {
		        iq = $iq({type:type, to:jid, from:from});
		    }
		    var ret = iq.c("vCard", {xmlns:Strophe.NS.VCARD});
			console.log('buildiq 1' + ret);
		
		    if (vCardEl)
		    {
		        ret = ret.cnode(vCardEl);
		    }
			console.log('buildiq 2' + ret);
		    return ret;
		},
		
		setVcardCallBack:function(stanza){
			console.log('setVcardCallBack');
			App.util.Strophe.getVcard();
		},
		
	    add_message: function (nick, msg) {
		App.util.Strophe.incomingUser = null;
		App.util.Strophe.incomingMsg = null;
		
		console.log('add_message = '+msg);
		
		var obj = App.Store.Facebook.getAt(0);
		var profilePhoto = obj.get('id');
		console.log('add_message facebook photo id= '+profilePhoto);
		

		
		
		var incomingJID = nick.split('_');
		incomingJID = incomingJID[0];
		
		App.util.Strophe.incomingUser = incomingJID;
		App.util.Strophe.incomingMsg = msg;
		
		console.log('nickname is =' +incomingJID);
		
		var iq = buildIq("get", App.util.Strophe.connection.jid, incomingJID+"@afrogjumps.com");
		

		
	    App.util.Strophe.connection.sendIQ(iq.tree(), App.util.Strophe.getVcardCallBack, null);


	    }, 

	    on_private_message: function (message) {
			console.log('on_private_message');

	      /*  var from = $(message).attr('from');
	        var room = Strophe.getBareJidFromJid(from);
	        var nick = Strophe.getResourceFromJid(from);

	        // make sure this message is from the correct room
	        if (room === this.room) {
	          var body = $(message).children('body').text();
	            this.add_message("<div class='message private'>" +
	                                "@@ &lt;<span class='nick'>" +
	                                nick + "</span>&gt; <span class='body'>" +
	                                body + "</span> @@</div>");

	        }

	        return true; */
	    },

		//Callback function to see the connection state
		connectCallback: function (status) {

		    var stat=''; // <---- this is the var i want to add a listener to

		    if (status === Strophe.Status.CONNECTED) {
				console.log('connected');

				Ext.dispatch({
					controller: 'Chat',
					action    : 'connected'
				});

		    }else if (status === Strophe.Status.DISCONNECTED){
		        console.log('DISCONNECTED');
		        stat='DISCONNECTED';
	        	Ext.Msg.alert('Error', stat);
		    }else if (status === Strophe.Status.AUTHENTICATING ){
		        console.log('Attempting to AUTHENTICATE');
		        stat='Attempting to AUTHENTICATE ';
	        	Ext.Msg.alert('', stat);
		    }else if (status === Strophe.Status.DISCONNECTING ){
		        console.log('DISCONNECTING');
		        stat='DISCONNECTING';
	        	Ext.Msg.alert('', stat);
		    }else if (status === Strophe.Status.CONNFAIL  ){
		        console.log('Problem while establishing connection');
		        stat='Problem while establishing connection';
		        Ext.Msg.show({
	                 title: stat,
	                 msg: '',
	                 icon: Ext.MessageBox.ERROR
	             });
		    }else if (status === Strophe.Status.AUTHFAIL ){
		        console.log('error during authentification');
		        stat='Error during authentification';
		        Ext.Msg.show({
	                 title: stat,
	                 msg: '',
	                 icon: Ext.MessageBox.ERROR
	             });
		    }else if (status === Strophe.Status.CONNECTING ){
		        console.log('Trying to connect');
		        stat='Trying to connect';
	        	Ext.Msg.alert('Error', stat);
		    }else{
				stat  = "Unknown error";
		        console.log('Unknown error');
	        	Ext.Msg.alert('Error', stat)

		    }
		},
}
