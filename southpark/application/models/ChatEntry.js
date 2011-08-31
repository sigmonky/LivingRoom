/* Chat Message  */

models.ChatEntry = Backbone.Model.extend({
  defaults: {
    jid: '',
	//     facebook_id: '',
	// nickname: '',
	// time: '',
	text:'',
  }
});

models.ChatCollection = Backbone.Collection.extend({
    model: models.ChatEntry
});