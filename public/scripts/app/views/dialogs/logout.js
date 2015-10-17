// logout.js
App.Views.Dialogs.Logout = App.Views.Abstract.Dialog.extend({

	dialogName: 'logout', // don't need template for this one, as we are not going to show it
	initialize: function() {
		App.currentUser.signOut();
		App.viewStack.clear();
		App.router.redirect('/');
		$('#fill_profile_invitation').hide();
	}
});