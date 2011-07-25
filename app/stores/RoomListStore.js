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
    autoLoad:true

});
