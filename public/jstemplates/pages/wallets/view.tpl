<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li><a href="{$settings->site_path}/wallets">{tp}Wallets{/tp}</a></li>
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
				
				<button type="button" id="add_profit_button" class="btn btn-success btn-block">{tp}Add Income{/tp}</button>
				<div class="pull-right">{tp}or{/tp} <a href="#" class="action" id="set_total_to_button">{tp}set total to{/tp}</a></div>
			</div>
		</div>

	</div>

	<div class="col-xs-12 col-sm-12 col-md-8 pull-left">

		<div class="list-group">
			<div class="list-group-item ">
				<h3 class="panel-title">{tp}Transactions{/tp}
					<span class="pull-right"><a href="{$settings->site_path}/wallets/{$item->id}/import_xls" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-import" aria-hidden="true"></span> {tp}import{/tp}</a></span>
				</h3>

				<div class="form-group">
					<form method="post" id="add_transaction_form">
						<input type="text" class="form-control" id="add_transaction_text" placeholder="{t}Describe expense and press Enter to add{/t}" data-i18nplaceholder="Describe expense and press Enter to add">
						<input type="number" min="0" step="0.01" class="form-control hideme" id="add_transaction_amount" placeholder="{t}Transaction amount{/t}" data-i18nplaceholder="Transaction amount">
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
				<h3 class="panel-title">{tp}Expenses per day trends{/tp}</h3>
			</div>
			<div class="panel-body">
				<div id="balance_canvas" class="ct-chart ct-perfect-fourth" ></div>
			</div>
		</div>
	</div>


</div>


<div class="hidden">
	<span id="tour_step_0">{t}Let's start by adding some money to your wallet.<br><br>Click "Add Profit" button and fill the form in modal window. It's simple.{/t}</span>
	<span id="tour_step_1">{t}You can also set current total with "Set Total To" dialog.<br><br>
					We don't ask you to track every transaction you've done(though you can). 
					Feel free to update your DimeShift wallet every evening, or even once in few days.<br><br>
					Click "set total to" action link and fill the form to check how it works.{/t}</span>
	<span id="tour_step_2">{t}It's time to add some expense.<br><br>
	You can add transaction with one string, e.g. "99.93, best expense ever".<br><br>
	Press Enter when tranasction description is ready.
	{/t}</span>
	<span id="tour_step_3">{t}Check out updated transactions list{/t}</span>
	<span id="tour_step_4">{t}Check out expenses per day trends. Simple chart that gets updated every time you add another tranasction.{/t}</span>
	<span id="tour_step_5">{t}Don't forget to fill your profile, so you can sign in to DimeShift next time.{/t}</span>
</div>