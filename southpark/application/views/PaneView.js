var PaneView = Backbone.View.extend({
	el: $('#pane-container'),

	initialize: function() {
		_.bindAll(this, 'render', 'getScrollPane', 'renderAllFans', 'renderMyFriends', 'renderBuzz');
		// re-render if there is a change
		// additional behaviours
		var self = this;		
			
	//	- when window is resized, recalc pane
		$(window).resize(function() {
			self.getScrollPane().reinitialise();
		});
		
		//
		this.render();
		// done
		return this;
	},
	
	getScrollPane: function() {
		 // return $('.scroll-pane').jScrollPane({scrollbarWidth:3}).data('jsp');
	},
	
	render: function() {
		
		/* Buzz View Begin */
		
		var url = 'http://tweetriver.com/afrogjumps/-mtvronnie.json&callback=?';
		$.getJSON(url, function(data) {
			// clear 
			$("#rows").html('');
			// append each tweet
			console.log('data results '+data)
			if (data && data.length > 0) {
				var $rows = $("#rows");
				_.each(data, function(item) {
					var rowView = new BuzzView({model: item});
					$(rowView.render().el).prependTo($rows);
				});
			} else {
				// show there are no tweets at this location
				$("#rows").html('<div class="row"><div class="thumb"></div><div class="details">There is no tweet at this location.</div><div>');
			}
			// show the results
			$('#rows').slideDown('fast', function() {
				// resize the scroll pane
				// var pane = self.getScrollPane();
				// pane.scrollTo(0,0);
				// pane.reinitialise();
				// // 
				$('#load').fadeOut('fast');
			});
			// 
			// $("#load").remove();
			// $("#rows-content").append('<span id="load">Loading....</span>');
			// $("#load").fadeIn();
		});
		
		/* Buzz View End */
		$("#roster-area").html('');
		var roster_area = $("#roster-area");
		console.log('FriendsWhoInstalledApp.data '+FriendsWhoInstalledApp.data);
		_.each(FriendsWhoInstalledApp.data, function(friend){
			console.log('friend '+friend.name);
			var rowView = new FriendRosterView({model: FriendRoster});
			$(rowView.render().el).prependTo(roster_area);
		})
		
		return this;
	},
	
	renderAllFans: function() {
		$("#buzz_view").hide();
		$("#all_fans_view").show();
		$("#friends_view").hide();
	},
	
	renderMyFriends: function() {
		$("#buzz_view").hide();
		$("#all_fans_view").hide();
		$("#friends_view").show();	
	},

	renderBuzz: function() {
		$("#buzz_view").show();
		$("#all_fans_view").hide();
		$("#friends_view").hide();
	},
	

	

});