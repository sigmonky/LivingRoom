var BuzzTweetInputView = Backbone.View.extend({
	events: {
        'click .tweet_message_send_button': 'sendTweetMessage'
     },
	template: $('#tweet_message_view'),
	initialize: function() {
		$("input#input_tweet").keyup(function(){
			var box=$(this).val();
			var main = box.length *100;
			var value= (main / 140);
			var count= 140 - box.length;

			if(box.length <= 140){
				$('#tweet_count').html(count);
			}
			else
			{
				alert('Character Limit Exceeded!');
				return false;
			}
		});
			
	  _.bindAll(this, 'render');
	
	},
	render: function() {
		var template = Handlebars.compile(this.template.html());
		$(this.el).html(template(this.model));
		return this;
	},
	sendTweetMessage: function(){
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