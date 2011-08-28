var BuzzView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, 'render');
        this.model.bind('all', this.render);
        this.model.view = this;
    }
    , render: function () {
        var text = this.model.get('text');
        var userName = this.model.get('user').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        $(this.el).html(userName + ': ' + text);
        return this;
    }
    , remove: function () {
        $(this.el).remove();
    }
});