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
			store: 'FriendListStore',
            itemTpl: '<div class="x-roster-user"><div class="action delete x-button">Delete</div>' +
					    '<div class="x-user-picture">' +
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
	
			console.log('beforeactivate');
			var url = 'https://graph.facebook.com/me/friends?access_token='+getFacebookTokenFromUrl();
			console.log('urll '+ url);
			
			
			Ext.regStore('FriendListStore', {
					model: 'Friend',
					autoLoad: false,
					proxy: {
						type: 'memory',
					   	reader: {
					    	type: 'json'
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
				
			Ext.util.JSONP.request({
		    		url: 'https://graph.facebook.com/me/friends',
					params: {
						access_token: '185799971471968%7Ce83f2eff9c114736aac52c0b.3-527305423%7C_DlATFHB_CJa2hlpSxwDGbCaYEE'
					},
				    callbackKey: 'callback',
				    // Callback
				    callback: function (data) {
						var data = data.results;
						console.log('data =' +data.length);
						
						var friendStore = Ext.StoreMgr.get('FriendListStore');
						console.log('data.length ='+data.data.length);
					    for (var i = 0, ln = data.data.length; i < ln; i++) {
						
	                        var friend = data[i];
							var friend = Ext.ModelMgr.create({id: data.id, name: data.name}, 'Friend');
							friendStore.add(friend);
					    	friendStore.sync();
							var obj = friendStore.getAt(0);
							console.log('obj is ' + obj.get('name'));
	                    }
	                

				  	}	
			});
			
			
			
			
			
			
			
		/*	Ext.regStore('FriendListStore', {
				model: 'Friend',
				autoLoad: true,
			    proxy: {
			        type: 'ajax',
			      //  url: 'https://graph.facebook.com/me/friends?access_token='+getFacebookTokenFromUrl(),
					url: 'https://graph.facebook.com/me/friends?access_token=185799971471968%7Ce83f2eff9c114736aac52c0b.3-527305423%7C_DlATFHB_CJa2hlpSxwDGbCaYEE',
			        reader: {
			            type: 'jsonp',
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
			    autoLoad:true

			}); */

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