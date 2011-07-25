/* 
 * RoomRosterItem
 */

Ext.regModel('Room', {
	idProperty: 'jid',
    fields: [				
        {name: 'jid', type: 'string'},
		{name: 'name', type: 'string'},
        {name: 'topic', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'thumb', type: 'string'}
    ]
});