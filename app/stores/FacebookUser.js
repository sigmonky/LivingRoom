/* 
 * FacebookUser
 */

/**
 * @class LivingRoomAPI.stores.OnlineUsers
 * Definition of the store able to contains all the Online users.
 */
Ext.regStore('FacebookUser', {
	model: 'FacebookUser',
	autoLoad: true,
	proxy: {
		type: 'memory',
	   	reader: {
	    	type: 'json'
	   	}
	}
});