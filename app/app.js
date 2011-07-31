/* 
 * LivingRoomAPI
 */
Ext.regApplication('LivingRoomAPI', {
	
	//Set the default target
	defaultTarget: "viewport",
	
	//Set the application Index
	defaultUrl: 'Main/index',
	
	//Set the application Name
	name: 'LivingRoomAPI',

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

	/*	this.vwLogin = new LivingRoomAPI.views.Login({
		
			listeners: {
			
				scope: this,

				loginSuccess: function(v, s){
					console.log('loginSuccess');
					//Destroying the login component
					v.destroy();
				
					//If the login has been succesfull completed...	
					if(s) { 
						
						//The user is logged in
						loggedIn = true;
						
						//Definition of the application Viewport
					//	this.viewport = new LivingRoomAPI.Viewport({
				    //        application: this
				     //   });

					}
				
				},

				loginFail: function(v){

				}
			
			}
		}); */
		
		
			this.viewport = new LivingRoomAPI.Viewport({
	           application: this
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
		//facebookClient.disconnect();
	
	}
	
}