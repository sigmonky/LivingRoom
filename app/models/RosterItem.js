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
		{name: 'photoType', type: 'string'},
		{name: 'photoBase64', type: 'string'}
    ]
});