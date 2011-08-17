/* 
 * RosterItem
 */

Ext.regModel('RosterItem', {
	idProperty: 'jid',
    fields: [				
        {name: 'jid', type: 'string'},
        {name: 'facebook_id', type: 'string'},
		{name: 'name', type: 'string'},
        {name: 'subscription', type: 'string'},
		{name: 'chatActive', type: 'bool'},
		{name: 'chatState', type: 'string'},
		{name: 'photoType', type: 'string'},
		{name: 'photo_url', type: 'string'},
		{name: 'photoBase64', type: 'string'}
    ]
});