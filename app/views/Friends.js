/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Friends
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.Friends = Ext.extend(Ext.Panel, {
	
	initComponent : function(){
	
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			id: 'friendsList',
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
	
	listeners: {
        beforeactivate: function(ct, prevActiveCt) {
	
			to
			console.log('beforeactivate');
			Ext.regStore('FriendListStore', {
				model: 'Friend',
				autoLoad: true,
			    proxy: {
			        type: 'ajax',
			        url: 'https://graph.facebook.com/me/friends?access_token='+getFacebookTokenFromUrl(),
			        reader: {
			            type: 'json',
			        }
			    },
			    getGroupString : function(record) {
					var isLive = record.get('isLive');
					if (isLive == false){
						var str = 'My Facebook Friends';
					}else{
						var str = 'Active Chats';
					}
			        return  "<span style='display:none'>"+record.get('isLive').toString() + "</span>"+str ; 
			    },
			    autoLoad:false

			});
			
			var itemSubList = Ext.getCmp('friendsList');
			itemSubList.update();
            friendStore = Ext.getStore('FriendListStore');
            if (friendStore) {
                friendStore.load(function(){
                    itemSubList.store.loadData(friendStore.data.items);
                });
            }
        },


        beforedeactivate: function() {

        }
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
Ext.reg('Friends', LivingRoomAPI.views.Friends);