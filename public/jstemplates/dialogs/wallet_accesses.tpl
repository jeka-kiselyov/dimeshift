<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Users with access{/t} {if $item->name|default:''==''}{t}to this wallet{/t}{else}{t}to wallet{/t} "{$item->name|escape:'html'}"{/if}</h4>
      </div>

      <form method="post" role="form">
      <fieldset>

      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

      {if $status == 'loading'}
        <div class="page_loading"></div>
      {else}

        {if $accesses|count == 0}
          <div class="alert alert-warning" role="alert">{t}Only you have access to this wallet{/t}</div>  
        {else}
        <div class="table-responsive" style="max-height: 300px; overflow-y: scroll;">
          <table class="table table-hover table-striped">
          {foreach from=$accesses item=a}
            <tr>
              <td style="width: 39px;">
                <img src="{$a->gravatar}" class="img-circle" style="max-width: 39px; height: auto;">
              </td>
              <td style="max-width: 300px; overflow: hidden;">
                <strong title="{$a->to_email|escape}" data-id="{$a->id}" id="emails_with_access_{$a->id}">{$a->to_email|escape}</strong>
              </td>
              <td style="text-align: center;">{if !$a->to_user_id || $a->to_user_id == '0'}<span class="glyphicon glyphicon-user" style="color: #ccc;" title="{t}Not registered yet{/t}"></span>{else}<span class="glyphicon glyphicon-user"></span>{/if}</td>
              <td><div class="pull-right"><a href="#" class="btn btn-default btn-xs item_button_remove_access" data-id="{$a->id}"><span class="glyphicon glyphicon-trash"></span>  {t}Remove Access{/t}</a></div></td>
            </tr>
          {/foreach}
          </table>
        </div>
        {/if}

      {/if}

        <h4>{t}Add access{/t}</h4>
        <div class="form-group">
          <label class="sr-only" for="input_email">{t}Email{/t}</label>
          <input type="email" name="email" class="form-control" id="input_email" placeholder="{t}Email{/t}">
        </div>

        <div class="alert alert-danger errors-container" style="display: none;">
        </div>



      <div class="modal-body modal-body-success" style="display: none;">
      </div>

      </div>
      <div class="modal-footer">
        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="{t}Give Access{/t}" data-loading-text="{t}Saving...{/t}">
        </div>
      </div>
      </fieldset>
      </form>
  </div>
</div>

