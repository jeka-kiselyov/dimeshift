<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Fill Profile{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      <form method="post" role="form" id="fill_profile_modal_form">
      <fieldset>
        <div class="form-group">
          <label class="sr-only" for="input_login">{t}Username{/t}</label>
          <input type="text" name="login" class="form-control" id="input_login" placeholder="{t}Username{/t}">
        </div>
        
        <div class="form-group">
          <label class="sr-only" for="input_email">{t}Email{/t}</label>
          <input type="email" name="email" class="form-control" id="input_email" placeholder="{t}Email{/t}">
        </div>

        <div class="form-group">
          <label class="sr-only" for="input_password">{t}Password{/t}</label>
          <input type="password" name="password" class="form-control" id="input_password" placeholder="{t}Password{/t}">
        </div>

        <div class="alert alert-danger errors-container" id="registration_invalid_password_alert" style="display: none;">
          {t}Invalid username or password{/t}
        </div>
        
        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Save{/t}" data-loading-text="{t}Saving...{/t}" id="fill_profile_modal_form_submit">
        </div>

      </fieldset>
      </form>

      </div>
      <div class="modal-body modal-body-success" style="display: none;">
        <div class="alert alert-info" role="alert">{t}Thank you! From now, you can sign in to your account any time from any device.{/t}.</div>
      </div>
      <div class="modal-footer">
      </div>
    </form>
  </div>
</div>

