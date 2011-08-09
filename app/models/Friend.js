/* 
 * RoomRosterItem
 */

Ext.regModel('Friend', {
	idProperty: 'jid',
    fields: [				
        {name: 'jid', type: 'string'},
        {name: 'id', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'nickname', type: 'string'},
        {name: 'thumb', type: 'string'},
		{name: 'isLive', type: 'bool'},
		{name: 'didInstallApp', type: 'bool'},
    ]
});