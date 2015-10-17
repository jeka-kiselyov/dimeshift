<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{t}Home{/t}</a></li>
  <li><a href="{$settings->site_path}/wallets">{t}Wallets{/t}</a></li>
  <li class="active">{$item->name|default:'Wallet'|escape:'html'}</li>
</ul>


<div class="row">

	<div class="col-xs-12 col-sm-12 col-md-4 pull-right">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">{$item->name|escape:'html'}</h3>
			</div>
			<div class="panel-body">
			
				<p class="text-center {if $item->total >= 0}text-success{else}text-danger{/if} wallet_total"><strong>{if $item->total < 0}-{/if}{if $item->currency == 'USD'}${/if}{$item->total|rational}.<sup>{$item->total|decimal}</sup>{if $item->currency != 'USD'} {$item->currency}{/if}</strong></p>
				
				<button type="button" id="add_profit_button" class="btn btn-success btn-block">{t}Add Income{/t}</button>
				<div class="pull-right">{t}or{/t} <a href="#" class="action" id="set_total_to_button">{t}set total to{/t}</a></div>
			</div>
		</div>

	</div>

	<div class="col-xs-12 col-sm-12 col-md-8 pull-left">

		<div class="list-group">
			<div class="list-group-item ">
				<h3 class="panel-title">{t}Transactions{/t}</h3>

				<div class="form-group">
					<form method="post" id="add_transaction_form">
						<input type="text" class="form-control" id="add_transaction_text" placeholder="{t}Describe expense and press Enter to add{/t}">
						<input type="number" min="0" step="0.01" class="form-control hideme" id="add_transaction_amount" placeholder="{t}Transaction amount{/t}">
						<button type="submit" class="hideme">
					</form>
				</div>
			</div>

			<div id="transactions_container">

			</div>

		</div>	


	</div>

	<div class="col-xs-12 col-sm-12 col-md-4 pull-right">


		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title" data-i18n="Expenses per day trends">{t}Expenses per day trends{/t}</h3>
			</div>
			<div class="panel-body">
				<div id="balance_canvas" class="ct-chart ct-perfect-fourth" ></div>
			</div>
		</div>
	</div>


</div>