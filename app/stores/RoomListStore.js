/* 
 * RoomListStore
 */

/**
 * @class LivingRoomAPI.stores.Roster
 * Definition of the store able to contains all the Roster Items.
 */
Ext.regStore('RoomListStore', {
	model: 'Room',
	autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'http://www.logoslogic.com/chat/LivingRoom/rooms.json',
        reader: {
            type: 'json',
        }
    },
    getGroupString : function(record) {
		var isPrivate = record.get('isPrivate');
		if (isPrivate == false){
			var str = 'Rooms';
		}else{
			var str = 'Active Chats';
		}
        return  "<span style='display:none'>"+record.get('isPrivate').toString() + "</span>"+str ; 
    },
    autoLoad:true

});
