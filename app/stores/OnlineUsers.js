/* 
 * OnlineUsers
 */

/**
 * @class LivingRoomAPI.stores.OnlineUsers
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
