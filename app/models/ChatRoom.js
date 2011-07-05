/* 
 * ChatRoom
 */

Ext.regModel('ChatRoom', {
	idProperty: 'jid',
    fields: [				
        {name: 'jid', type: 'string'},
		{name: 'name', type: 'string'},
        {name: 'topic', type: 'string'},
		{name: 'number_of_occupants', type: 'string'}
    ],
 	associations: [
    	{ type: 'hasMany', model: 'RoomRosterItem', name: 'occupants' }
	]	
});

/* currentUser.friends().load().getAt(0);*/