<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li class="active">{tp}Plan your expenses{/tp}</li>
</ul>


<div class="row">
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Your plans{/tp}</h3>
		</div>
		<div class="panel-body">

			<ul class="list-group">
				<li class="list-group-item">Plan 1
					<div class="pull-right">
						<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-list-alt"></span> View Report</button>
						<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-pencil"></span> Edit</button>
					</div>
				</li>
				<li class="list-group-item">Plan 2
					<div class="pull-right">
						<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-list-alt"></span> View Report</button>
						<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-pencil"></span> Edit</button>
					</div>
				</li>
			</ul>

			<button class="btn btn-primary" type="submit">Create new</button>

		</div>
	</div>

</div>
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Select wallets to use for planning{/tp}</h3>
		</div>
		<div class="panel-body">
			<div class="list-group">
				<a href="#" class="list-group-item"><span class="glyphicon glyphicon-unchecked"></span> Sample Cash Wallet</a>
				<a href="#" class="list-group-item active"><span class="glyphicon glyphicon-check"></span> Sample Bank Wallet</a>
			</div>

			<button class="btn btn-primary" type="submit">Next</button>
		</div>
	</div>


</div>

<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Plan settings{/tp}</h3>
		</div>
		<div class="panel-body">


		<div class="row">
			<div class="col-xs-4">
				<p>{tp}Current balance is{/tp}</p>

				<p class="text-center text-success wallet_total"><strong>$22.<sup>88</sup></strong></p>


		        <div class="form-group">
		          <label for="input_name">{t}Select Currency{/t}</label>
		          <select name="currency" id="input_currency" class="form-control">
		            <option value="">{t}Select Currency{/t}</option>
		            {foreach from=$settings.currencies item=c key=id}
		              <option value="{$id}" {if $id == 'USD'}selected="selected"{/if}>{$c}</option>
		            {/foreach}
		          </select>
		        </div>
			</div>
			<div class="col-xs-4">
				<p>{tp}And on{/tp}</p>

				<div style="overflow:hidden;">
				    <div class="form-group">
				        <div class="row">
				            <div class="col-md-12">
				                <div class="datetimepicker"></div>
				            </div>
				        </div>
				    </div>
				</div>

			</div>
			<div class="col-xs-4">
				<p>{tp}Plan is to keep{/tp}</p>

		        <div class="form-group">
		          <label class="sr-only" for="input_amount">{t}Amount{/t}</label>
		          <input type="number" min="0" step="0.01" name="amount" class="form-control" id="input_amount" value="22.88" placeholder="{t}Amount{/t}">
		        </div>

		        <div class="form-group">
		          <label for="input_name">{t}Select Currency{/t}</label>
		          <select name="currency" id="input_currency" class="form-control">
		            <option value="">{t}Select Currency{/t}</option>
		            {foreach from=$settings.currencies item=c key=id}
		              <option value="{$id}" {if $id == 'USD'}selected="selected"{/if}>{$c}</option>
		            {/foreach}
		          </select>
		        </div>

			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<p>Means you can spend up to $100.00 in next 32 days. $10 per day. $70 per week.</p>

			</div>
		</div>

			<button class="btn btn-primary" type="submit">Confirm and save</button>
		</div>
	</div>


</div>
</div>