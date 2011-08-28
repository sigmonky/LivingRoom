var FriendRosterView = Backbone.View.extend({
    className: 'friends-list',
	template: $('#user'),

    initialize: function (options) {
        _.bindAll(this, 'render');
        // this.model.bind('all', this.render);
        // this.model.view = this;
    }, 

	render: function () {
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
        return this;
    },

	remove: function () {
        $(this.el).remove();
    }
});