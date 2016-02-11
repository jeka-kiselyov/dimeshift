//plans.js
App.Collections.Plans = Backbone.Collection.extend({
    model: App.Models.Plan,
    user_id: false,
    url: function() {
        return App.settings.apiEntryPoint + 'plans';
    },
    setUserId: function(user_id) {
        this.user_id = user_id;
    },
});