<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li class="active">{tp}Plan your expenses{/tp}</li>
</ul>


<div class="row" {if $step != 0}style="display: none;"{/if}>
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Your plans{/tp}</h3>
		</div>
		<div class="panel-body">

			<ul class="list-group">
			{if $plans|count == 0}
			{else}
				{foreach from=$plans item=p}
				<li class="list-group-item">{$p->name|escape:'html'}&nbsp;
					<div class="pull-right">
						<button class="btn btn-default btn-xs" data-id="{$p->id}"><span class="glyphicon glyphicon-list-alt"></span> View Report</button>
						<button class="btn btn-default btn-xs edit_plan_button" data-id="{$p->id}"><span class="glyphicon glyphicon-pencil"></span> Edit</button>
					</div>
				</li>
				{/foreach}
			{/if}
			</ul>

			<button class="btn btn-primary" type="submit" id="button_create_new">Create new</button>

		</div>
	</div>

</div>
</div>

<div class="row" {if $step != 1}style="display: none;"{/if}>
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Basic settings{/tp}</h3>
		</div>
		<div class="panel-body">


		<div class="row">
			<div class="col-xs-6">
				<p>{tp}Plan name{/tp}</p>

		        <div class="form-group">
					<label class="sr-only" for="input_name">{t}Plan name{/t}</label>
					<input type="text" name="input_name" class="form-control" id="input_name" {if $preparedData->name|default:'Undefined' != 'Undefined'}value="{$preparedData->name|escape:'html'}"{/if} placeholder="{t}Plan name{/t}">
				</div>
			</div>
			<div class="col-xs-6">
				<p>{tp}Wallets to use for planning{/tp}</p>

				{if $wallets|count == 0}
				{else}
				<div class="list-group">
					{foreach from=$wallets item=w}
						{assign var="checked" value=0}
						{if $preparedData->wallets|default:''}
						{foreach from=$preparedData->wallets item=pwid}
							{if $pwid == $w->id}
								{assign var="checked" value=1}
							{/if}
						{/foreach}
						{/if}
					<a href="#" class="list-group-item step1_wallet_checkbox {if $checked}active{/if}" data-id="{$w->id}"><span class="glyphicon glyphicon-{if $checked}check{else}unchecked{/if}"></span> {$w->name|escape:'html'}&nbsp;</a>
					{/foreach}
				</div>
				{/if}
			</div>
		</div>

		<button class="btn btn-default" type="submit" id="button_step1_back">Back</button>
		<button class="btn btn-primary" type="submit" id="button_step1_next" {if !$preparedData->wallets|default:''}disabled="disabled"{/if}>Next</button>

		</div>
	</div>

</div>
</div>


<div class="row" {if $step != 2}style="display: none;"{/if}>
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Plan settings{/tp}</h3>
		</div>
		<div class="panel-body">


		<div class="row">
			<div class="col-xs-4">
				<p>{tp}Current balance is{/tp}</p>

				<p class="text-center {if $preparedData->start_balance >= 0}text-success{else}text-danger{/if} wallet_total"><strong>

					<span id="cb_minus">-</span><span id="cb_c_dollar">$</span><span id="cb_rational">0</span>.<sup><span id="cb_decimal">00</span></sup> <span id="cb_c_other">USD</span> 

				</strong></p>
				<div id="cb_o">
					<p class="text-center">or</p>
					<p class="text-center {if $preparedData->start_balance >= 0}text-success{else}text-danger{/if} wallet_total"><strong>

						<span id="cb_o_minus">-</span><span id="cb_o_c_dollar">$</span><span id="cb_o_rational">0</span>.<sup><span id="cb_o_decimal">00</span></sup> <span id="cb_o_c_other">USD</span> 

					</strong></p>
				</div>


		        <div class="form-group">
		          <label for="input_name">{t}Calculate in different currency{/t}</label>
		          <select name="input_start_currency" id="input_start_currency" class="form-control">
		            <option value="">{t}Select Currency{/t}</option>
		            {foreach from=$settings.currencies item=c key=id}
		              <option value="{$id}" {if $id == $preparedData->start_currency|default:'USD'}selected="selected"{/if}>{$c}</option>
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
		          <input type="number" step="0.01" name="input_goal_balance" class="form-control" id="input_goal_balance" value="{$preparedData->goal_balance|default:'0.00'}" placeholder="{t}Amount{/t}">
		        </div>

		        <div class="form-group">
		          <label for="input_name">{t}Select Currency{/t}</label>
		          <select name="input_goal_currency" id="input_goal_currency" class="form-control">
		            <option value="">{t}Select Currency{/t}</option>
		            {foreach from=$settings.currencies item=c key=id}
		              <option value="{$id}" {if $id == $preparedData->goal_currency|default:'USD'}selected="selected"{/if}>{$c}</option>
		            {/foreach}
		          </select>
		        </div>

				<button class="btn btn-default" type="submit" id="set_goal_to_start">Set to <span id="set_goal_to_start_c">USD</span></button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<p>Means you
					<span id="preview_spend">can spend up to </span>
					<span id="preview_get">have to get </span>

					<span id="preview_diff_c_dollar">$</span><span id="preview_diff_rational">100</span>.<span id="preview_diff_decimal">00</span> <span id="preview_diff_c_other">USD</span> 

					<span id="preview_one_day">in next day</span>
					<span id="preview_few_days">
					in next <span id="preview_days_count">32</span> days. 
					</span>

					<span id="preview_d_diff_c_dollar">$</span><span id="preview_d_diff_rational">100</span>.<span id="preview_d_diff_decimal">00</span> <span id="preview_d_diff_c_other">USD</span>
					 per day. 
			</div>
		</div>

			<button class="btn btn-default" type="submit" id="button_step2_back">Back</button>
			<button class="btn btn-primary" type="submit" id="button_step2_save">Confirm and save</button>
		</div>
	</div>


</div>
</div>