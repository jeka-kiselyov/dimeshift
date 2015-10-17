<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Set Total To{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      <form method="post" action="{$settings->site_path}/wallets/add_profit" role="form">
      <fieldset>

        <div class="form-group">
          <label class="sr-only" for="input_total">{t}Total{/t}</label>
          <input type="number" min="0" step="0.01" name="total" class="form-control" id="input_total" placeholder="{t}Total{/t}">
        </div>


        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Set{/t}" data-loading-text="{t}Saving...{/t}">
        </div>

      </fieldset>
      </form>

      </div>
      <div class="modal-body modal-body-success" style="display: none;">
      </div>
      <div class="modal-footer">
        <div class="pull-right">
        </div>
      </div>
    </form>
  </div>
</div>

