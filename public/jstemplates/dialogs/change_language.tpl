<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">
          {t}Change DimeShift language{/t}
        </h4>
      </div>
      <form method="post"  role="form">
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

        <div class="process_button_container btn-group-vertical" role="group" style="display: block">
        {foreach from=$locales item=locale key=key}
          {if $current_locale == $key}
          <button type="button" class="btn btn-default btn-block btn-primary process_button" data-code="{$key}">{$locale.name}</button>
          {else}
          <button type="button" class="btn btn-default btn-block process_button" data-code="{$key}">{$locale.name}</button>
          {/if}
        {/foreach}
        </div>

      </div>
      <div class="modal-footer">

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Cancel{/t}" data-loading-text="{t}Canceling...{/t}">
        </div>

      </div>
      </form>
    </form>
  </div>
</div>

