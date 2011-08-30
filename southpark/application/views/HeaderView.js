var HeaderView = Backbone.View.extend({
	el: $('#header_view'),
	
	initialize: function() {
		_.bindAll(this);
		$(document).click(function(){
			$('.friend_roster_menu').each(function(item){
				$(this).hide();
			})
		})
		return this;
	},

});