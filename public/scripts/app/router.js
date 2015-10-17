// router.js
App.router = new (Backbone.Router.extend({

  setUrl: function(path) {
    this.navigate(path);
  },
  redirect: function(path) {
    if (typeof(App.page) !== 'undefined' && App.page && typeof(App.page.isReady) !== 'undefined' && !App.page.isReady)
      App.loadingStatus(false);
    this.navigate(path, {trigger: true});
  },
  routes: {
    "(/)": "index",// #help
    "help": "help",// #help
    "wallets(/)": "wallets",// #wallets
    "profile(/)": "profile",// #wallets
    "wallets/:id": "wallet",// #wallets/4
    "static/view/:id": "static",// #wallets/4
    "news/recent/:page(/)": "newsItems",// #news/recent/3
    "news/recent(/)": "newsItems",// #news/recent
    "news/category/:id/:page(/)": "newsCategory",// #news/category/1/2
    "news/category/:id(/)": "newsCategory",// #news/category/1
    "news/view/:slug.html": "newsItem",// #news/view/someslug.html
  },

  dialogs: {
    "user/signin": "Signin",
    "user/registration": "Registration",
    "user/restore": "Restore",
    "user/newpassword": "NewPassword",
    "user/logout": "Logout",
    "user/fillprofile": "FillProfile",

    "wallets/add": "AddWallet"
  },

  index: function() {
    App.showPage('Index');
  },

  profile: function() {
    App.showPage('Profile');
  },

  static: function(id) {
    App.showPage('Static', {slug: id});
  },

  help: function() {
    console.log('routing help');
  },

  wallet: function(id) {
    App.showPage('Wallet', {id: id});
  },

  wallets: function() {
    App.showPage('Wallets');
  },

  newsItems: function(page) {
    if (typeof(page) === 'undefined') 
      page = 1;
    App.showPage('NewsItems', {page: page});
  },

  newsCategory: function(newsCategoryId, page) {
    if (typeof(page) === 'undefined') 
      page = 1;

    App.showPage('NewsItems', {page: page, newsCategoryId: newsCategoryId});    
  },

  newsItem: function(slug) {
    App.showPage('NewsItem', {slug: slug});
  },

  init: function() {
    Backbone.history.start({pushState: App.settings.history.pushState, silent: App.settings.history.startSilent});
    Backbone.history.isRoutingURL = function(fragment) {
      for (var k in this.handlers)
        if (this.handlers[k].route.test(fragment))
          return true;
      return false;
    };

    var that = this;

    if (Backbone.history && Backbone.history._hasPushState) {
      $(document).on("click", "a", function(evt){
        if (typeof(evt.ctrlKey) !== 'undefined' && evt.ctrlKey)
          return true;
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";
        href = href.split(App.settings.sitePath).join('');
        href = href.slice(-1) == '/' ? href.slice(0, -1) : href;
        href = href.slice(0,1) == '/' ? href.slice(1) : href;

        /// trying to find dialog
        for (var k in that.dialogs)
          if (k == href)
          {
            console.log('Showing "'+that.dialogs[k]+'" dialog from document click event');
            App.showDialog(that.dialogs[k]);

            return false;
          }
            
        // Ensure the protocol is not part of URL, meaning its relative.
        if (href.slice(protocol.length) !== protocol && Backbone.history.isRoutingURL(href))
        {
          console.log('Navigating to "'+href+'" from document click event');
          evt.preventDefault();
          App.router.navigate(href, {trigger: true});

          return false;
        }

        return true;
      });
    }
  }

}))();