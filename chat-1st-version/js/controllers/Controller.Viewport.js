/**
 * Chat Controller
 *
 */
Ext.regController('Viewport', {

	/**
	 * Index action
	 *
	 * @return {void}
	 */
	index: function() {
		
		var configStore = new App.Store.Config();
		configStore.load();

		/*if (configStore.getCount() > 0) {
			this.showChat();
		} else {
			this.showConfig();
		} */
		this.showConfig();
	},

	/**
	 * Show the chat view
	 *
	 */
	showChat: function() {
		Ext.dispatch({
			controller: 'Chat',
			action    : 'index'
		});
	}, 
	
/*	showChat: function() {
		this.chatScreen = new App.View.GroupChat();
		this.application.viewport.setActiveItem(
			this.chatScreen,
			{
				type: 'flip',
				duration:400
			}
		);
	}, */

	/**
	 * Show config view
	 *
	 */
	showConfig: function() {
		if (!this.viewConfig) {

			this.viewConfig = this.render({
				xtype: 'App.View.Config'
			});

			this.viewConfig.query('#backButton')[0].on(
				'tap',
				this.showChat,
				this
			);
		}
		this.application.viewport.setActiveItem(
			this.viewConfig,
			{
				type: 'flip',
				duration: '400'
			}
		);
	}
});