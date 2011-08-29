var FriendRosterView = Backbone.View.extend({
   // className: 'friends-list',
	template: $('#user'),
	

  	events: {
    	'click .start-chat': 'startChat',
    	'click .start-group-chat': 'startGroupChat',
    	'click .add-group-chat': 'addToGroupChat',
		'click .view-menu': 'viewMenu'
  	},

    initialize: function (options) {
	    _.bindAll(this, 'viewMenu', 'startChat', 'startGroupChat', 'addToGroupChat');
        _.bindAll(this, 'render');
        // this.model.bind('all', this.render);
        // this.model.view = this;
    }, 
	
	render: function () {
		console.log('render friend '+this.model.name)
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
        return this;
    },

	viewMenu: function(e){
		e.preventDefault();
	 	e.stopPropagation();
		$('.friend_roster_menu').each(function(item){
			$(this).hide();
		})
		this.$('.friend_roster_menu').show();
		console.log('view_menu')
	},
	
	startChat: function(e){
		e.preventDefault();
	 	e.stopPropagation();
	},

	startGroupChat: function(e){
		e.preventDefault();
	 	e.stopPropagation();
	},
	
	addToGroupChat: function(e){
		e.preventDefault();
	 	e.stopPropagation();
	},


	remove: function () {
       // $(this.el).remove();
    }
});