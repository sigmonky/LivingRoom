/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.RoomList
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.RoomList = Ext.extend(Ext.Panel, {
	
	initComponent : function(){
	
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			id: 'roomList',
			iconCls: 'user',
			iconMask: true,
			allowDeselect: false,
		    singleSelect: true,
		    /**
		     * @cfg {String} activeCls The CSS class that is added to each item when swiped
		     */
		    activeCls: 'search-item-active',
		
			grouped: true,
			store: 'RoomListStore',
            itemTpl: '<div class="x-roster-user"><div class="action delete x-button">Delete</div>' +
					    '<div class="x-user-picture">' +
						 	'<img src="{thumb}" width="32" height="32" />' +
					     '</div>' +
					 	'<div class="x-user-name">' +
						 	'<b>{name}</b>' +
					     '</div>' +
					  '</div>',
			listeners: {
				
				itemtap: function(list, index, item, e) {
					
					
					if (e.getTarget('.' + this.list.activeCls + ' div.delete')) {
						
			            var store    = list.getStore(),
			                selModel = this.list.getSelectionModel(),
			                instance = store.getAt(index),
			                selected = selModel.isSelected(instance),
			                nearest  = store.getAt(index + 1) || store.getAt(index - 1);

			            //if the item we are removing is currently selected, select the nearest item instead
			            if (selected && nearest) {
			                selModel.select(nearest);
			            }

			            store.removeAt(index);
			            store.sync();

			            //there were no other searches left so tell the user about that
			            if (!nearest) {
			                Ext.redirect('searches/first');
			            }
			        } else {
			            this.deactivateAll();

			            
						//Let's take the online users store
						var store = list.getStore();

						//Let's take the selected user
						var room = store.getAt(index);

						var isPrivate = room.get('isPrivate');

						console.log('is private' +isPrivate);

						if (isPrivate == false){
							Ext.dispatch({
							    controller: 'Roster',
							    action: 'openRoom',
								show: true,
								room: room
							});

						}else{

							var nickname = room.get('name');
							var jid = room.get('jid');

							Ext.dispatch({
							    controller: 'Roster',
							    action: 'returnToChatOneOneSession',
								show: true,
								nickname: nickname,
								jid: jid,
							});
						}
			        }
			        
					
					

					
				},
				
				
				itemswipe: this.onItemSwipe,
	            containertap: this.deactivateAll,
	            
				
				scope: this
				
			}
        });


		Ext.apply(this,{
		
			fullscreen: true,
			layout:'card',
			items: [this.list]
			
		});
        this.on({
            scope: this,
            itemswipe: this.onItemSwipe,
            containertap: this.deactivateAll
        });

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	switchBack: function(){
		    //this.setActiveItem(0);
			//this.setActiveItem('test1', {type:'slide', direction:'left'});
			this.setActiveItem(0, {type:'slide', direction:'right'});
		
			//this.dockedItems.items[0].setTitle("Room Topic");
	},
	
	deactivateAll: function() {
        Ext.select('div.search-item', this.el.dom).removeCls(this.activeCls);
    },
    /**
     * @private
     * Handler for the itemswipe event - shows the Delete button for the swiped item, hiding the Delete button
     * on any other items
     */
    onItemSwipe: function(list, index, node) {
			console.log('onItemSwipe');
        	var el        = Ext.get(node),
            activeCls = this.list.activeCls,
            hasClass  = el.hasCls(activeCls);
        
        this.deactivateAll();
        
		
		var store = list.getStore();

		//Let's take the selected user
		var room = store.getAt(index);
		if (room.get('isPrivate') == true){
			console.log('onItemSwipe index '+index);

        	if (hasClass) {
            	el.removeCls(activeCls);
        	} else {
            	el.addCls(activeCls);
        	}
		}
    },

    
	
});

//Component type registration
Ext.reg('RoomList', LivingRoomAPI.views.RoomList);