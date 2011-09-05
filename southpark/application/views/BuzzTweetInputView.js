var BuzzTweetInputView = Backbone.View.extend({
	events: {
        'click .tweet_message_send_button': 'sendTweetMessage',
     },
	template: $('#tweet_message_view'),
	initialize: function() {

			
	  _.bindAll(this, 'render');
	
	},
	render: function() {

		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
		return this;
	},
	sendTweetMessage: function(){
		console.log('sendTweetMessage')
		var message = $('.tweet_input').val();
		var dataString = 'tweet='+ message;  
		$.ajax({
		  type: 'POST',
		  url: 'http://www.logoslogic.com/chat/LivingRoom/southpark/twitter/post',
		  data: dataString,
		  success: function(){
			console.log('tweet message posted');
		  },
		});
	},
	
});