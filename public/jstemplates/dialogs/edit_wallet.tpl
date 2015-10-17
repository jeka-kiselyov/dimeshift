<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Edit Wallet{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      <form method="post" action="{$settings->site_path}/wallets/edit" role="form">
      <fieldset>

        <div class="form-group">
          <label class="sr-only" for="input_name">{t}Name{/t}</label>
          <input type="text" name="name" class="form-control" id="input_name" placeholder="Name" value="{$item->name|escape:'html'}">
        </div>

        <div class="form-group">
          <label class="sr-only" for="input_name">{t}Currency{/t}</label>
          <select name="currency" id="input_currency" class="form-control">
            <option value="">{t}Select Currency{/t}</option>
            {foreach from=$settings.currencies item=c key=id}
              <option value="{$id}" {if $item->currency == $id}selected="selected"{/if}>{$c}</option>
            {/foreach}
          </select>
        </div>

        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Save{/t}" data-loading-text="{t}Saving...{/t}">
        </div>

      </fieldset>
      </form>

      </div>
      <div class="modal-footer">
        <div class="pull-right">
        </div>
      </div>
    </form>
  </div>
</div>

