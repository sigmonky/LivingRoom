var FriendRosterView = Backbone.View.extend({
	template: $('#user'),
	
  	events: {
    	'click .start-chat': 'startChat',
    	'click .start-group-chat': 'startGroupChat',
    	'click .add-togroup-chat': 'addToGroupChat',
		'click .view-menu': 'viewMenu'
  	},

    initialize: function (options) {
	    _.bindAll(this, 'viewMenu', 'startChat', 'startGroupChat', 'addToGroupChat');
        _.bindAll(this, 'render');
    }, 
	
	render: function () {
	//	var uName = this.model.get('name');
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
	},
	
	startChat: function(e){
		e.preventDefault();
	 	e.stopPropagation();
	
		var id = $(this.el).find('.start-chat').attr('id').split('-')[2];
		// console.log('startChat id' +id)
		;
		
		//$tabs.trigger('addTab', [label,content])</span>
		
		var chat_area = $('#chat-' + id);
		var rowView = new ChatView({model: id});
		$(rowView.render().el).prependTo(chat_area);
		
		$('#chat-area').tabs('add', '#chat-' + id, id);
		
		$('.ui-widget-header').css('border-bottom','1px solid #6a6a6a' )
		

	},

	startGroupChat: function(e){
		var id = $(this.el).find('.start-group-chat').attr('id').split('-')[2];
		// console.log('startGroupChat id' +id);
		e.preventDefault();
	 	e.stopPropagation();
	},
	
	addToGroupChat: function(e){
		var id = $(this.el).find('.add-togroup-chat').attr('id').split('-')[2];
		// console.log('addToGroupChat id' +id);
		e.preventDefault();
	 	e.stopPropagation();
	},


	remove: function () {
       // $(this.el).remove();
    }
});