/* 
 * RoomRosterItem
 */

Ext.regModel('Friend', {
	idProperty: 'id',
    fields: [				
        {name: 'jid', type: 'string'},
        {name: 'id', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'nickname', type: 'string'},
        {name: 'thumb', type: 'string'},
		{name: 'isLive', type: 'bool'},
		{name: 'isActive', type: 'bool'},
		{name: 'subscription', type: 'string'},
		{name: 'didInstallApp', type: 'bool'},
    ]
});