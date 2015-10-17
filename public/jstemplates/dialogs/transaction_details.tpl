<div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="dialog_label">{t}Transaction Details{/t}</h4>
      </div>
      <div class="modal-body modal-body-default" style="padding-bottom: 0;">

        <table class="table table-hover table-striped">
          <tr>
            <td><strong>{t}Amount{/t}</strong></td>
            <td><strong>{if $wallet->currency == 'USD'}${/if}{$item->amount|rational}.<sup>{$item->amount|decimal}</sup> {if $wallet->currency != 'USD'} {$wallet->currency}{/if}</strong></td>
          </tr>
          <tr>
            <td><strong>{t}Date{/t}</strong></td>
            <td>{$item->datetime|date_format}</td>
          </tr>
          <tr>
            <td><strong>{t}Time{/t}</strong></td>
            <td>{$item->datetime|date_format:'g:i a'}</td>
          </tr>
          <tr>
            <td><strong>{t}Description{/t}</strong></td>
            <td>{$item->description|escape:'html'|default:'&nbsp;'}</td>
          </tr>
        </table>


<!--       <form method="post" action="{$settings->site_path}/wallets/edit" role="form">
      <fieldset>

        <div class="form-group">
          <label class="sr-only" for="input_name">Name</label>
          <input type="text" name="name" class="form-control" id="input_name" placeholder="Name" value="{$item->name|escape:'html'}">
        </div>

        <div class="alert alert-danger errors-container" style="display: none;">
        </div>

        <div class="form-group">
          <input type="submit" class="btn btn-primary pull-left" value="Save" data-loading-text="Saving...">
        </div>

      </fieldset>
      </form> -->

      </div>
      <div class="modal-footer">
        <div class="pull-right">
          <a href="#" class="btn btn-default btn-sm" id="remove_transaction_button"><span class="glyphicon glyphicon-trash"></span>  {t}Remove{/t}</a>
        </div>
      </div>
    </form>
  </div>
</div>

