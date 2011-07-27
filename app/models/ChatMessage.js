Ext.regModel('ChatMessage', {
	fields: [
		{
			name: 'jid',
			type: 'string'
		},
		{
			name: 'nickname',
			type: 'string'
		},
		{
			name: 'facebook_id',
			type: 'string'
		},
		{
			name: 'time',
			type: 'string'
		},
		{
			name: 'message',
			type: 'string'
		}
	]
});