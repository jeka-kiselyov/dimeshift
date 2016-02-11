// plan.js
App.Models.Plan = Backbone.Model.extend({

    defaults: {
        name: null,
    },
    url: function() {
        return App.settings.apiEntryPoint + 'plans/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    }

});