/**
 * Chat Message Model
 *
 * @author Nils Dehl <mail@nils-dehl.de>
 */
Ext.regModel('ChatMessage', {
	fields: [
		{
			name: 'user',
			type: 'string'
		},
		{
			name: 'message',
			type: 'string'
		},
		{
			name: 'facebook_photo',
			type: 'string'
		}
	]
});