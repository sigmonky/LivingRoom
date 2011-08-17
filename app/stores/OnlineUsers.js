/* 
 * OnlineUsers
 */

/**
 * @class LivingRoomAPI.stores.OnlineUsers
 * Definition of the store able to contains all the Online users.
 */
Ext.regStore('OnlineUsers', {
	model: 'RosterItem',
	autoLoad: true,
	proxy: {
		type: 'memory',
	   	reader: {
	    	type: 'json'
	   	}
	},
	sorters: [
	{
		property: 'name',
		direction: 'ASC'
	}],
	
    getGroupString : function(record) {
		var chatState = record.get('chatState');
		if (chatState == 'active'){
			var str = 'Active Chats';
		}else if (chatState == 'invite'){
			var str = 'Invite More Friends To Chat';
		}
		else{
			var str = 'Online Friends';
		}
        return  "<span style='display:none'>"+record.get('thumb') + "</span>"+str ;  
	//	return record.get('thumb');
    },
});
