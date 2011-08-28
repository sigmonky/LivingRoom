var FriendRosterView = Backbone.View.extend({
   // className: 'friends-list',
	template: $('#user'),
	
  	el: $('#roster-area .friends-list'),

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
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
        return this;
    },

	viewMenu: function(e){
		e.preventDefault();
	 	e.stopPropagation();
		this.$('.friend_roster_menu').show();
		console.log('view_menu')
	},
	
	startChat: function(e){
		
	},

	startGroupChat: function(e){
		
	},
	
	addToGroupChat: function(e){
		
	},


	remove: function () {
       // $(this.el).remove();
    }
});