var BuzzTweetInputView = Backbone.View.extend({
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
	}
});