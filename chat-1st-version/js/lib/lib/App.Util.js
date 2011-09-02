Ext.ns('App.util');

App.Util = {
	facebookAccessToken: '',
	 
	GetFacebookTokenFromUrl: function(){
		queryObj = {};
        var qs = window.location.href;
		console.log ('qs = ' +qs );
		var fragments = qs.split('?');
		console.log('fragments.lenght = '+ fragments.length)
		if (fragments.length >= 2) {
			console.log("fragments 1 " + fragments[2]);
            qs = fragments[2];
        }
		return qs;
	}
}