/* 
 * RoomRosterItem
 */

Ext.regModel('RoomRosterItem', {
	idProperty: 'jid',
    fields: [				
        {name: 'jid', type: 'string'},
		{name: 'nickname', type: 'string'},
        {name: 'facebook_id', type: 'string'}
    ]
});