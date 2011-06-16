/**
 * Set the application Routes
 */
Ext.Router.draw(function(map) {
    
    //These are default fallback routes and can be removed if not needed
    map.connect(':controller/:action');
    map.connect(':controller/:action/:id');

});