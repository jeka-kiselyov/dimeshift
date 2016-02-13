<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li><a href="{$settings->site_path}/plans">{tp}Plan your expenses{/tp}</a></li>
  <li class="active">{$plan->name|default:'Wallet'|escape:'html'}</li>
</ul>

<div class="row">
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Goal Details{/tp}</h3>
		</div>
		<div class="panel-body">


			<div class="row">
				<div class="col-xs-6">
					<p class="text-center {if $plan->start_balance >= 0}text-success{else}text-danger{/if} wallet_total"><strong>{tp}From:{/tp} {if $plan->start_balance < 0}-{/if}{if $plan->start_currency == 'USD'}${/if}{$plan->start_balance|rational}.<sup>{$plan->start_balance|decimal}</sup>{if $plan->start_currency != 'USD'} {$plan->start_currency}{/if}</strong></p>
				</div>
				<div class="col-xs-6">

					<p class="text-center {if $plan->goal_balance >= 0}text-success{else}text-danger{/if} wallet_total"><strong>{tp}To:{/tp} {if $plan->goal_balance < 0}-{/if}{if $plan->goal_currency == 'USD'}${/if}{$plan->goal_balance|rational}.<sup>{$plan->goal_balance|decimal}</sup>{if $plan->goal_currency != 'USD'} {$plan->goal_currency}{/if}</strong></p>
				</div>
				<div class="col-xs-12">

					<p class="text-center">In {$stats|count} days. From {$plan->start_datetime|wallet_date} to {$plan->goal_datetime|wallet_date}</p>

				</div>
			</div>

		</div>
	</div>
</div>
</div>

<div class="row">
<div class="col-xs-12">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{tp}Day by day report{/tp}</h3>
		</div>
		<div class="panel-body">

<table class="table table-condensed">
	<tr>
		<th>Date</th>
		<th>Total On Start</th>
		<th><span class="text-danger">Spent</span></th>
		<th><span class="text-success">Profit</span></th>
		<th>Plan</th>
	</tr>
	{if $stats|count == 0}
	{else}
		{foreach from=$stats item=s}
		<tr class="{if $s->date->unix_from > $currentTimestamp}active{else}{if $s->date->unix_from < $currentTimestamp && $s->date->unix_to > $currentTimestamp}info{else}{if ($s->allowedToSpend > 0 && $s->dayTotal < $s->allowedToSpend) || ($s->allowedToSpend < 0 && $s->dayTotal > $s->allowedToSpend)}success{else}danger{/if}{/if}{/if}">
			<td>{$s->date->unix|wallet_date}</td>
			<td>{$s->currentTotalOnStart|rational}.<sup>{$s->currentTotalOnStart|decimal}</sup></td>
			{if $s->date->unix_from > $currentTimestamp}
			<td colspan="2">&nbsp;</td>
			{else}
			<td>{$s->expensesTotal|rational}.<sup>{$s->expensesTotal|decimal}</sup></td>
			<td>{$s->profitsTotal|rational}.<sup>{$s->profitsTotal|decimal}</sup></td>
			{/if}
			<td><span class="{if $s->allowedToSpend >= 0}text-success{else}text-danger{/if}">
				{if $s->date->unix_from > $currentTimestamp && $possibleLowestSpending !== null}
					{$possibleLowestSpending|rational}.<sup>{$possibleLowestSpending|decimal}</sup>	&ndash;				
				{/if}
				{$s->allowedToSpend|rational}.<sup>{$s->allowedToSpend|decimal}</sup>
				{if $possibleLowestSpending|default:null === null}
					{assign var="possibleLowestSpending" value=$s->allowedToSpend}
				{/if}
			</span></td>
		</tr>
		{/foreach}
	{/if}
</table>

		</div>
	</div>

</div>
</div>