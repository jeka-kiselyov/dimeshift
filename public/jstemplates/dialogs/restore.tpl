<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Restore Password{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      <form method="post" action="{$settings->site_path}/user/restore" role="form" id="restore_modal_form">
      <fieldset>
        <div class="form-group">
          <label class="sr-only" for="input_email">{t}Email{/t}</label>
          <input type="email" name="email" class="form-control" id="input_email" placeholder="{t}Email{/t}">
        </div>

        <div class="alert alert-danger errors-container" id="restore_invalid_password_alert" style="display: none;">
          {t}Invalid username or password{/t}
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Restore{/t}" data-loading-text="{t}Processing...{/t}" id="restore_modal_form_submit">
        </div>

      </fieldset>
      </form>

      </div>
      <div class="modal-body modal-body-success" style="display: none;">
        <div class="alert alert-info" role="alert">{t}Instructions have been sent to your email address{/t}.</div>
      </div>
      <div class="modal-footer">
        <div class="pull-right">
        {t}Don't have an account?{/t} <a href="{$settings->site_path}/user/registration" class="btn btn-default btn-sm">{t}Register{/t}</a>
        </div>
      </div>
    </form>
  </div>
</div>

