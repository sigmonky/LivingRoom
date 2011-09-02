Ext.ns('App.Store');



Ext.regModel('Roster', {
    fields: [
        {name: 'username',        type: 'string'}
    ]
});

App.Store.Roster = Ext.extend(Ext.data.Store, {
	constructor:function(cfg){
		cfg = cfg || {};
		var config = Ext.apply(
			{
				model: 'Roster',
				storeId: 'RosterStore'
			},
			cfg
		);
		App.Store.Config.superclass.constructor.call(
			this,
			config
		);
	}
});

Ext.reg('App.Store.Roster', App.Store.Roster);

