/* Twitter Message  */

var TweetEntry = Backbone.Model.extend({
  defaults: {
    author: '',
    image_url: '',
	time: '',
	text:''
  }
});

models.TweetCollection = Backbone.Collection.extend({
    model: models.TweetEntry
});