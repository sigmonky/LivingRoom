/* 
 * RoomRoster
 */

/**
 * @class LivingRoomAPI.stores.Roster
 * Definition of the store able to contains all the Roster Items.
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
