var BuzzView = Backbone.View.extend({
	className: 'row',
	template: $('#tweet-template'),
	initialize: function() {
	  _.bindAll(this, 'render');
	},
	render: function() {
		$(this.el).html(this.template.mustache(this.model));
		return this;
	}
});