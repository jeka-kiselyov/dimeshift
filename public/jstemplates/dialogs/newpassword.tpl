<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}New Password{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      <form method="post" action="{$settings->site_path}/user/newpassword" role="form" id="newpassword_modal_form">
      <fieldset>

        <div class="form-group">
          <label class="sr-only" for="input_password">{t}Password{/t}</label>
          <input type="password" name="password" class="form-control" id="input_password" placeholder="Password">
        </div>

        <div class="form-group">
          <label class="sr-only" for="input_confirm_password">{t}Confirm password{/t}</label>
          <input type="password" name="confirm_password" class="form-control" id="input_confirm_password" placeholder="{t}Confirm Password{/t}">
        </div>

        <div class="alert alert-danger errors-container" id="newpassword_invalid_password_alert" style="display: none;">
          {t}Invalid username or password{/t}
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Save{/t}" data-loading-text="{t}Saving...{/t}" id="newpassword_modal_form_submit">
        </div>

      </fieldset>
      </form>

      </div>
      <div class="modal-body modal-body-success" style="display: none;">
        <div class="alert alert-info" role="alert">{t}Done. You can{/t} <a href="{$settings->site_path}/user/signin">{t}sign in{/t}</a> {t}now{/t}.</div>
      </div>
      <div class="modal-footer">
        <div class="pull-right">
        </div>
      </div>
    </form>
  </div>
</div>

