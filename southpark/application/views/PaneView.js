var PaneView = Backbone.View.extend({
	el: $('#pane-container'),

	initialize: function() {
		_.bindAll(this, 'render', 'getScrollPane', 'renderAllFans', 'renderMyFriends', 'renderBuzz');
		// re-render if there is a change
		// additional behaviours
		var self = this;		
			
		// - when window is resized, recalc pane
		// $(window).resize(function() {
		// 	self.getScrollPane().reinitialise();
		// });
		// 

		//
		this.render();
		// done
		return this;
	},
	
	getScrollPane: function() {
	//	return $('.scroll-pane').jScrollPane({scrollbarWidth:3}).data('jsp');
	},
	
	render: function() {

		// // display the tweet pane
		// $("#tweets").css({'display': 'block', 'height': '100%'});				
		// // display the current location
		// $("#current-location").html("Location: " + position.lat() + ", " + position.lng());
		// // hide the rows
		// $("#rows").slideUp('fast', function() {
		// 	// get the data
		// 	var url = getTweetUrl( position, radius );
		//             $.getJSON(url, function(data) {
		// 		// clear 
		// 		$("#rows").html('');
		// 		// append each tweet
		// 		if (data && data.results.length > 0) {
		// 			var $rows = $("#rows");
		// 			_.each(data.results, function(item) {
		// 				var rowView = new TweetView({model: item});
		// 				$(rowView.render().el).prependTo($rows);
		// 			});
		// 		} else {
		// 			// show there are no tweets at this location
		// 			$("#rows").html('<div class="row"><div class="thumb"></div><div class="details">There is no tweet at this location.</div><div>');
		// 		}
		// 		// show the results
		// 		$('#rows').slideDown('fast', function() {
		// 			// resize the scroll pane
		// 			var pane = self.getScrollPane();
		// 			pane.scrollTo(0,0);
		// 			pane.reinitialise();
		// 			// 
		// 			$('#load').fadeOut('fast');
		// 		});
		// 	});
		// });
		
		// // show loading
		// $("#load").remove();
		// $("#rows-content").append('<span id="load">Loading....</span>');
		// $("#load").fadeIn();
		//
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