var ChatView = Backbone.View.extend({
    events: {
        'submit #message_form': 'sendMessage'
     }, 
	template: $('#muc_window'),

	initialize: function (options) {
        // 
        this.jid = options.jid;
         _.bindAll(this, 'sendMessage');
        $('input#message_field').focusin(function () {});
        _.bindAll(this, 'render');
    }, 

	render: function() {
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
        return this;
    }, 
	
	clearAlerts: function (count) {

    },

	setDirectAlert: function () {

    },

	setMsgAlert: function () {

    }, 

	addUser: function (user) {

    }, 

	removeUser: function (user) {

    }, 

	displayUserLeaveMessage: function (user) {

    },

 	addChat: function (chat) {

    }, 

	removeChat: function (chat) {
        // chat.view.remove();
    }, 

	sendMessage: function () {

    }, 

	
});