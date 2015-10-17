<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Add Income{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      <form method="post" action="{$settings->site_path}/wallets/add_profit" role="form">
      <fieldset>

        <div class="form-group">
          <label class="sr-only" for="input_amount">{t}Amount{/t}</label>
          <input type="number" min="0" step="0.01" name="amount" class="form-control" id="input_amount" placeholder="{t}Amount{/t}">
        </div>

        <div class="form-group">
          <label class="sr-only" for="input_description">{t}Description{/t}</label>
          <input type="text" name="description" class="form-control" id="input_description" placeholder="{t}Desciption{/t}">
        </div>

        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Add{/t}" data-loading-text="{t}Saving...{/t}">
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

