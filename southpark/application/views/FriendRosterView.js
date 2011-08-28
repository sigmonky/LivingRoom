var FriendRosterView = Backbone.View.extend({
    className: 'user_model',
	template: $('#user'),

    initialize: function (options) {
        _.bindAll(this, 'render');
        this.model.bind('all', this.render);
        this.model.view = this;
    }, 

	render: function () {
        var uName = this.model.get('name');
        uName = uName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        $(this.el).html(uName);
        return this;
    },

	remove: function () {
        $(this.el).remove();
    }
});