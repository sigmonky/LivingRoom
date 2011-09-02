Ext.ns('App.util');

App.Util = {
	
	facebookAccessToken: '',
	
	setFacebookTokenFromUrl: function(){
		queryObj = {};
        var qs = window.location.href;
		var fragments = qs.split('#');
		//console.log('fragments  '+fragments);
		if (fragments.length >= 2) {
			var final = fragments[1].indexOf('&expires_in=')
            qs = fragments[1].substring(13, final);
			this.facebookAccessToken = qs;
        }else{
			this.facebookAccessToken = "";
		}
	}
}