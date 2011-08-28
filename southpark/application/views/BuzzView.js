var BuzzView = Backbone.View.extend({
	className: 'row',
	template: $('#tweet-template'),
	initialize: function() {
	  _.bindAll(this, 'render');
	},
	render: function() {
	//	console.log('render this.model'+this.model.screen_name)
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
		
		//$(this.el).html(this.template.mustache(this.model));
	//	ICH.subscription_request(info)
		return this;
	}
});