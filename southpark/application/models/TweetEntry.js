/* Twitter Message  */

var TweetEntry = Backbone.Model.extend({
  defaults: {
    author: '',
    image_url: '',
	time: '',
	text:''
  }
});

/*https://async.fi/2011/07/backbone-js-automagic-syncing-of-collections-and-models/ */

models.TweetCollection = Backbone.Collection.extend({
    model: models.TweetEntry
});

/*var TweetCollection = Backbone.Collection.extend({
  model: TweetModel,
  sync: function(method, collection, success, error) {
    var requestData={};
    if(collection.length>0) {
        requestData.last_tweet_id=collection.last.id 
    }
    var params = {
        url:          "/tweet",
        type:         "POST",
        data:         requestData,
        success:      success,
        error:        error
    };
    $.ajax(params);
  }
}
*/