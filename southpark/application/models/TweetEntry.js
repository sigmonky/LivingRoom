/*https://async.fi/2011/07/backbone-js-automagic-syncing-of-collections-and-models/ */

/* Twitter Message  */

TweetEntry = Backbone.Model.extend({
  defaults: {
    author: '',
    image_url: '',
	time: '',
	text:''
  }
});

TweetCollection = Backbone.Collection.extend({
  model: TweetEntry,
  value: null,
  // url: function(){ return "http://tweetriver.com/camilarc/south-park-test.json?callback=?"}
  url: function(){ return "http://www.logoslogic.com/chat/LivingRoom/southpark/service/south-park-test.json"}
});


	/*http://stackoverflow.com/questions/5963324/polling-a-collection-with-backbone-js */
	/*http://stackoverflow.com/questions/5427038/backbone-js-updating-of-models-in-a-collection */


/*	 */

// models.TweetCollection = Backbone.Collection.extend({
//     model: models.TweetEntry
// });

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