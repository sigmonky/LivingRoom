var ChatView = Backbone.View.extend({
	el: $("#login-form"),
    events: {
        'submit #message_form': 'sendMessage'
    }, 

	initialize: function (options) {
        var main, that;

        _.bindAll(this, 'addUser', 'removeUser', 'addChat', 'removeChat', 'triggerAutoComplete', 'suggestAutoComplete', 'sendMessage', 'setMsgAlert');
        this.model.users.bind('add', this.addUser);
        this.model.users.bind('remove', this.removeUser);
        this.model.chats.bind('add', this.addChat);
        this.model.chats.bind('add', this.setMsgAlert);
        this.model.chats.bind('remove', this.removeChat);
        this.newMessages = 0;
        this.socket = options.socket;
        this.userName = options.userName;
        this.chunkSize = 0;

        that = this;
        $('input#message_field').focusin(function () {
            that.clearAlerts(0);
        }); //Clear the alerts when the box gets focus
    }, 

	render: function() {
        //log('rendered main view');
    }, 

	clearAlerts: function (count) {

    },

	setDirectAlert: function () {

    },

	setMsgAlert: function () {

    }, 

	addUser: function (user) {
        var view = new UserView({model: user});
        $('#user_list').append(view.render().el);
        $('#user_count').html(this.model.users.length + ' ');

        if (!user.get('preExist')) {
            var view = new StatusView({userName: user.get('name'), niceTime: user.get('niceTime'), statusMessage: 'has joined nodechat'});
            $('#chat_list').append(view.render().el);
            $('#chat_list')[0].scrollTop = $('#chat_list')[0].scrollHeight;
        }
    }, 

	removeUser: function (user) {
        user.view.remove();
        $('#user_count').html(this.model.users.length + ' ');
    }, 

	displayUserLeaveMessage: function (user) {
        var view = new StatusView({userName: user.get('name'), niceTime: user.get('niceTime'), statusMessage: 'has left nodechat'});
        $('#chat_list').append(view.render().el);
        $('#chat_list')[0].scrollTop = $('#chat_list')[0].scrollHeight;
    },

 	addChat: function (chat) {
        var view = new ChatView({model: chat});
        $('#chat_list').append(view.render().el);
        $('#chat_list')[0].scrollTop = $('#chat_list')[0].scrollHeight;
        
        //remove old ones if we are getting too long
        if (this.model.chats.length > 1000)
            this.model.chats.remove(this.model.chats.first());
    }, 

	removeChat: function (chat) {
        chat.view.remove();
    }, 

	sendMessage: function () {
        var inputField, match, delimiter;

        inputField = $('input[name=message]');

        if (inputField.val().length > 400) {
            return;
        }

        // this.socket.send({
        //     event: 'chat'
        //     , data: inputField.val()
        // });

    }, 

	suggestAutoComplete: function(key) {

    }, 

	triggerAutoComplete: function (key) {

    }, 

	setConnected: function (connected) {
	        if(connected)
	            $('#disconnectMessage').hide();
	        else
	            $('#disconnectMessage').show();
	}
	
});