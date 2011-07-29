/* 
 * RosterItem
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */

/**
 * @class TouchChat.stores.Roster
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
