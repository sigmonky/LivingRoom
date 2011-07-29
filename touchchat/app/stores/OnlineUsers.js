/* 
 * OnlineUsers
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */

/**
 * @class TouchChat.stores.OnlineUsers
 * Definition of the store able to contains all the Online users.
 */
Ext.regStore('OnlineUsers', {
	model: 'RosterItem',
	autoLoad: true,
	proxy: {
		type: 'memory',
	   	reader: {
	    	type: 'json'
	   	}
	}
});
