<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">
        {if $item->status|default:'active' == 'active'}
          {t}Are you sure that you want to hide{/t} {if $item->name|default:''==''}{t}this wallet{/t}{else}{t}wallet{/t} {$item->name|escape:'html'}{/if}?
        {else}
          {t}Are you sure that you want to remove{/t} {if $item->name|default:''==''}{t}this wallet{/t}{else}{t}wallet{/t} {$item->name|escape:'html'}{/if}?
        {/if}
        </h4>
      </div>
      <form method="post" action="{$settings->site_path}/wallets/remove" role="form">
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

        {if $item->status|default:'active' == 'active'}
          <p>{t}You will be able to restore it from Trash folder{/t}</p>
        {else}
          <p>{t}All wallet data(transactions etc.) will be lost{/t}</p>
        {/if}
        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

      </div>
      <div class="modal-footer">

        <div class="form-group">
          <input type="button" class="process_button btn btn-danger pull-left" value="{if $item->status|default:'active' == 'active'}{t}Yes, Hide It{/t}{else}{t}Yes, Remove{/t}{/if}" data-loading-text="{t}Removing...{/t}">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Cancel{/t}" data-loading-text="{t}Canceling...{/t}">
        </div>

      </div>
      </form>
  </div>
</div>

