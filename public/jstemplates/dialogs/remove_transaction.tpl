<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">
          {t}Are you sure that you want to remove this transaction?{/t}
        </h4>
      </div>
      <form method="post"  role="form">
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

      </div>
      <div class="modal-footer">

        <div class="form-group">
          <input type="button" class="process_button btn btn-danger pull-left" value="{t}Yes, Remove{/t}" data-loading-text="{t}Removing...{/t}">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Cancel{/t}" data-loading-text="{t}Canceling...{/t}">
        </div>

      </div>
      </form>
    </form>
  </div>
</div>

