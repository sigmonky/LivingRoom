/* 
 * RoomRoster
 */

/**
 * @class LivingRoomAPI.stores.RoomRoster
 * Definition of the store able to contains all the RoomRoster Items.
 */

Ext.regStore('RoomRoster', {
	model: 'RoomRosterItem',
	autoLoad: true,
	proxy: {
		type: 'memory',
	   	reader: {
	    	type: 'json'
	   	}
	}
});
