// router.js
App.router = new(Backbone.Router.extend({

  setUrl: function(path) {
    this.navigate(path);
  },
  redirect: function(path) {
    if (typeof(App.page) !== 'undefined' && App.page && typeof(App.page.isReady) !== 'undefined' && !App.page.isReady)
      App.loadingStatus(false);
    this.navigate(path, {
      trigger: true
    });
  },

  routes: {
    "(/)": "index", // #help
    "help": "help", // #help
    "wallets(/)": "wallets", // #wallets
    "profile(/)": "profile", // #wallets
    "wallets/:id": "wallet", // #wallets/4
    "wallets/:id/import(/)": "importXLS", // #wallets/4
    "user/updatepassword/:code/:hash": "updatePassword"
  },

  dialogs: {
    "user/signin": "Signin",
    "user/registration": "Registration",
    "user/restore": "Restore",
    "user/logout": "Logout",
    "user/fillprofile": "FillProfile",
    "wallets/add": "AddWallet",
    "user/change_language": "ChangeLanguage"
  },

  index: function() {
    App.showPage('Index');
  },

  profile: function() {
    App.showPage('Profile');
  },

  updatePassword: function(code, hash) {
    App.showPage('UpdatePassword', {
      password_restore_code: code,
      password_restore_hash: hash
    });
  },

  wallet: function(id) {
    App.showPage('Wallet', {
      id: id
    });
  },

  importXLS: function(wallet_id) {
    App.showPage('ImportXLS', {
      wallet_id: wallet_id
    });
  },

  wallets: function() {
    App.showPage('Wallets');
  },

  init: function() {
    Backbone.history.start({
      pushState: App.settings.history.pushState,
      silent: App.settings.history.startSilent
    });
    Backbone.history.isRoutingURL = function(fragment) {
      for (var k in this.handlers)
        if (this.handlers[k].route.test(fragment))
          return true;
      return false;
    };

    var that = this;

    if (Backbone.history && Backbone.history._hasPushState) {
      $(document).on("click", "a", function(evt) {
        if (typeof(evt.ctrlKey) !== 'undefined' && evt.ctrlKey)
          return true;
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";
        href = href.split(App.settings.sitePath).join('');
        href = href.slice(-1) == '/' ? href.slice(0, -1) : href;
        href = href.slice(0, 1) == '/' ? href.slice(1) : href;

        /// trying to find dialog
        for (var k in that.dialogs)
          if (k == href) {
            console.log('Showing "' + that.dialogs[k] + '" dialog from document click event');
            App.showDialog(that.dialogs[k]);

            return false;
          }

          // Ensure the protocol is not part of URL, meaning its relative.
        if (href.slice(protocol.length) !== protocol && Backbone.history.isRoutingURL(href)) {
          console.log('Navigating to "' + href + '" from document click event');
          evt.preventDefault();
          App.router.navigate(href, {
            trigger: true
          });

          return false;
        }

        return true;
      });
    }
  }

}))();