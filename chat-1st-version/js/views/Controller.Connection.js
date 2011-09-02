/**
 * Connection Controller
 *
 */
Ext.regController('Connection', {
	
	index: function(options){
		this.con;
		console.log("connection started");
		console.log("auser =" +options.username);
		console.log("auser =" +options.password);
		this.connect(options.url, options.username, options.password);
	},
	
	showChat: function() {
		Ext.dispatch({
			controller: 'Chat',
			action    : 'index'
		});
	},
	
	connect: function(url, user, pass){  
		console.log("connect");
		username = user+"@afrogjumps.com";
		console.log("username="+username);
		console.log("pass="+pass);
		
	    this.con = new Strophe.Connection(url);
	    this.con.connect(username, pass, this.connectCallback);
	},
	
	// disconnecting from server
	disconnect: function(){
	    if(this.con){
	        this.con.disconnect();
	    }
	},

	//Callback function to see the connection state
	connectCallback: function my_callback(status) {

	    var stat=''; // <---- this is the var i want to add a listener to

	    if (status === Strophe.Status.CONNECTED) {
	        console.log('CONNECTED TO SERVER!');
	        stat='CONNECTED TO SERVER!';
        	Ext.Msg.alert('Sucess', stat);
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
	}


});