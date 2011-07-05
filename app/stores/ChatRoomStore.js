/* 
 * ChatRoomStore
 */

/**
 * @class LivingRoomAPI.stores.ChatRoomStore
 * Definition of the store able to contains all the Online users.
 */
Ext.regStore('ChatRoomStore', {
	model: 'ChatRoom',
	autoLoad: true,
	proxy: {
		type: 'memory',
	   	reader: {
	    	type: 'json'
	   	}
	}
});