<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Sign In{/t}</h4>
      </div>
      <div class="modal-body signin_dialog" style="padding-bottom: 0;">
<!-- 
      <h3>{t}Sign In With{/t}</h3>

      <div class="social_signin">
        <a href="#" class="btn btn-social btn-facebook"><span class="fa fa-facebook"></span> Facebook</a>
        <a href="#" class="btn btn-social btn-google"><span class="fa fa-google"></span> Google</a>
        <a href="#" class="btn btn-social btn-twitter"><span class="fa fa-twitter"></span> Twitter</a>
      </div>

      <h3>{t}Or Sign In With Your DimeShift Account{/t}</h3> -->

      <form method="post" action="{$settings->site_path}/user/signin" role="form" id="signin_modal_form">
      <fieldset>
        <div class="form-group">
          <label class="sr-only" for="input_username">{t}Username or Email{/t}</label>
          <input type="text" name="username" class="form-control" id="input_username" placeholder="{t}Username or Email{/t}">
        </div>
        <div class="form-group">
          <label class="sr-only" for="input_password">{t}Password{/t}</label>
          <input type="password" name="password" class="form-control" id="input_password" placeholder="{t}Password{/t}">
        </div>
        <div class="alert alert-danger errors-container" id="signin_invalid_password_alert" style="display: none;">
          {t}Invalid username or password{/t}
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Sign In{/t}" data-loading-text="{t}Signing in...{/t}" id="signin_modal_form_submit">
        </div>
      </fieldset>
      </form>

      </div>
      <div class="modal-footer">
        <a href="{$settings->site_path}/user/registration" class="btn btn-default btn-sm">{t}Register{/t}</a>
        <a href="{$settings->site_path}/user/restore" class="btn btn-default btn-sm">{t}Restore your password{/t}</a>
      </div>
  </div>
</div>

