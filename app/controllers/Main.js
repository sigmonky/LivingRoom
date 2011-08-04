/* 
 * LivingRoomAPI
 */

/**
 * @class BonjourBonjour.controllers.Main
 * @extends Ext.Controller
 * Controller able to manage the event attenders view
 */
Ext.regController('Main', {

	index: function(options) {

	},
	
	showRoomRoster: function(){
		
		this.viewRoster = this.render({
			xtype: 'RoomRosterView'
			});

		/*	this.viewConfig.query('#backButton')[0].on(
				'tap',
				this.showChat,
				this
			);
		*/
		this.application.viewport.setActiveItem(
			this.viewRoster,
			{
				type: 'flip',
				duration: '400'
			}
		); 
	}

});