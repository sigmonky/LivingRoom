var FriendChatView = Backbone.View.extend({
    events: {
        'click .message_send_button': 'sendMessage'
     }, 
	template: $('#chat_window'),

	initialize: function (options) {
        _.bindAll(this, "render", 'sendMessage', 'addMessage');
        this.collection.bind("add", this.render);
    }, 

	render: function() {
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
		
		var messageList = $(this.el).find('.chat_messages');
		//console.log('message list'+$(this.el).find('.chat_messages'));
        messageList.empty();
        this.collection.each(function (message) {
	
			var photo_url = 'http://graph.facebook.com/'+message.get('facebook_id')+'/picture';
		
			console.log('chatView render photo_url' +photo_url);
			console.log('chatView render nick' +message.get('from'));
			
			var chatEntry = {};
			chatEntry.text = message.get('text');
			chatEntry.nickname = message.get('from');
			chatEntry.photo_url = photo_url;
			
            var chatMsg = new ChatMessageView({ model: chatEntry });
            messageList.append(chatMsg.render().el);
        });
		
		var messagesContainer = $(this.el).find('.chat_body');
		$(messagesContainer)[0].scrollTop = $(messagesContainer)[0].scrollHeight;
		
		
        return this;
    }, 

	sendMessage: function () {
		console.log('send message this model = ' +this.model.jid);
		var remoteJid = this.model.jid+'@logoslogic.com';
		console.log('send message to remoteJid' +remoteJid);
		var message = $(this.el).find('.chat_input').val();
		console.log('send message ' +message);
		this.trigger('send:message', message, remoteJid, 'private');
		
		 var msg = new models.ChatEntry({
		 	text: message,
		 	from: MyFacebookUser.name,
		 	to: '',
			facebook_id: MyFacebookUser.id, 
		 	incoming: true,
		 	dt: new Date()
		 });
		
		this.addMessage(msg);

    }, 

	addMessage: function(chatEntryModel){
		
		var chatEntry = {};
		chatEntry.text = chatEntryModel.get('text');
		chatEntry.nickname = MyFacebookUser.name;
		chatEntry.facebook_id = MyFacebookUser.id;
		
        var chatMsg = new ChatMessageView({ model: chatEntry });
		this.collection.add(chatMsg);
		//         $('#chat_list').append(view.render().el);
		//         $('#chat_list')[0].scrollTop = $('#chat_list')[0].scrollHeight;
	}

	
});