/* 
 * TouchChat
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */
Ext.regApplication('TouchChat', {
	
	//Set the default target
	defaultTarget: "viewport",
	
	//Set the application Index
	defaultUrl: 'Main/index',
	
	//Set the application Name
	name: 'TouchChat',

	//Set the application to use history
	useHistory: true,
	
	//Remove the Icon gloss
    glossOnIcon: false,
	
	//Set the application Icon
	icon: 'icon.png',

	//Set the phone startus screen
    phoneStartupScreen: 'phone_startup.png',
	
	//Definition of the application entry point function
	launch: function() {

		/* Definizione della vista addetta a permettere di effettuare 
		 * il login all'applicazione tramite immissione delle credenziali */
		this.vwLogin = new TouchChat.views.Login({
		
			listeners: {
			
				scope: this,
			
				/* Definition of the event that will be fired when the user will succesfull connect
				 * to BonjourBonjour application */
				loginSuccess: function(v, s){
					
					//Destroying the login component
					v.destroy();
				
					//If the login has been succesfull completed...	
					if(s) { 
						
						//The user is logged in
						loggedIn = true;
						
						//Definition of the application Viewport
						this.viewport = new TouchChat.Viewport({
				            application: this
				        });

					}
				
				},
				/* Definizione dell'evento addetto ad essere scatenato nel caso
				 * in cui l'autenticazione fallisca */
				loginFail: function(v){

				}
			
			}
		});
		
	}

});


/* Intercept the event that will allow the user to disconnect from the
 * chat server before the application exit */
window.onbeforeunload = function() {
	
	//Let's check if the user is already Logged in
	if(loggedIn){
	
		//Let's disconnect from the public chat room
		jabberClient.disconnect();
	
		//Let's disconnect from the Facebbo chat
		facebookClient.disconnect();
	
	}
	
}