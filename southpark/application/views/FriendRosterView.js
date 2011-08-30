var FriendRosterView = Backbone.View.extend({
	template: $('#user'),
	
  	events: {
    	'click .start-chat': 'startChat',
    	'click .start-group-chat': 'startGroupChat',
    	'click .add-togroup-chat': 'addToGroupChat',
		'click .view-menu': 'viewMenu'
  	},

    initialize: function (options) {
		$(document).click(function(){
			$('.friend_roster_menu').each(function(item){
				$(this).hide();
			})
		})
		this.addedTabs = Array();
		
	    _.bindAll(this, 'viewMenu', 'startChat', 'startGroupChat', 'addToGroupChat');
        _.bindAll(this, 'render');
    }, 
	
	hidePopupMenu: function(){
			$('.friend_roster_menu').each(function(item){
				$(this).hide();
			})
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
		var tabAlreadyExists = false;
		
		var id = $(this.el).find('.start-chat').attr('id').split('-')[2];
		console.log('startChat id ' +id);
		
		for(i=0; i < this.addedTabs.length; i++){
			if (this.addedTabs[i] == id){
				var that = this;
				$('ul.chat-tabs > li').each(function(item){
					var full_tab_id = $(this).find('a').attr('href');
					var tab_id = full_tab_id.substring(full_tab_id.indexOf('-')+1, full_tab_id.length);
					console.log('startChat tab_id =' +tab_id);
					if (tab_id == id){
						tabAlreadyExists = true;
						console.log('tabAlreadyExists true' +tabAlreadyExists);
					}
				})
			}
		}
		
		if (tabAlreadyExists != true){
			this.addedTabs.push(id);
			var rowView = new FriendChatView({model: id});
			$('#chat-area').tabs('add', '#chat-' + id, id);
			$('.ui-widget-header').css('border-bottom','1px solid #6a6a6a' )
			var chat_area = $('#chat-' + id);
			$(rowView.render().el).appendTo(chat_area);	
		}

		this.hidePopupMenu();

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