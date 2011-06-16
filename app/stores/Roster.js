/* 
 * RosterItem
 */

/**
 * @class LivingRoomAPI.stores.Roster
 * Definition of the store able to contains all the Roster Items.
 */
Ext.regStore('Roster', {
	model: 'RosterItem',
	autoLoad: true,
	proxy: {
		type: 'memory',
	   	reader: {
	    	type: 'json'
	   	}
	}
});
