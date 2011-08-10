/* 
 * FriendListStore
 */

/**
 * @class LivingRoomAPI.stores.Roster
 * Definition of the store able to contains all the Roster Items.
 */

	Ext.regStore('FriendListStore', {
			model: 'Friend',
			proxy: {
				type: 'memory',
			   	reader: {
			    	type: 'json'
			   	}
			},
			sorters: [{
				property: 'thumb',
				direction: 'ASC'
			},
			{
				property: 'name',
				direction: 'ASC'
			}],
			
		    getGroupString : function(record) {
				var didInstallApp = record.get('thumb');
				if (didInstallApp == 'b'){
					var str = 'Invite More Friends To Chat';
				}else if (didInstallApp == 'c'){
					var str = 'Online Friends';
				}
				else{
					var str = 'My Facebook Friends';
				}
		        return  "<span style='display:none'>"+record.get('thumb') + "</span>"+str ;  
			//	return record.get('thumb');
		    },
		    autoLoad:false

		});