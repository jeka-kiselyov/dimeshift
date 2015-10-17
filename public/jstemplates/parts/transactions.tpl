{if $state == 'loading'}
	<div class="list-group-item">
		<div class="page_loading"></div>
	</div>
{else}
<div id="transactions_container">
	{if $collection|default:false && $collection.hasNextPeriod()}
		{if $collection.diffToCurrentPeriod() < 2}
			<div class="list-group-item">
				<button type="button" class="btn btn-default btn-sm  btn-info btn-block" id="goto_next">
				<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> {$collection.nextPeriodToReadableFormat()}</button>
			</div>
		{else}
			<div class="list-group-item">
				<div class="btn-group btn-group-justified" role="group">
					<div class="btn-group" role="group">
						<button type="button" class="btn btn-default btn-sm btn-info" id="goto_current">
						<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> {$collection.currentPeriodToReadableFormat()}</button>
					</div>
					<div class="btn-group" role="group">
						<button type="button" class="btn btn-default btn-sm btn-info" id="goto_next">
						<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> {$collection.nextPeriodToReadableFormat()}</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}




	{if $transactions|count > 0}
		{foreach from=$transactions item=t}
		<div class="list-group-item item" data-id="{$t->id}">
			<div class="pull-left transaction_time">
				{assign var="current_transaction_time_date" value=$t->datetime|wallet_date}
				<div class="transaction_time_date">{if $last_time_date|default:'' != $current_transaction_time_date}{$current_transaction_time_date}{else}&nbsp;{/if}</div>
				<div class="transaction_time_time">{$t->datetime|wallet_time}</div>
				{assign var="last_time_date" value=$current_transaction_time_date}
			</div>

			<div class="pull-right {if $t->amount >= 0}text-success{else}text-danger{/if} transaction_amount"><strong>{if $item->currency == 'USD'}${/if}{$t->amount|rational}.<sup>{$t->amount|decimal}</sup>{if $item->currency != 'USD'} {$item->currency}{/if}</strong></div>
			
			<h6 class="list-group-item-heading">{$t->description|escape:'html'|default:'&nbsp;'}</h6>
		</div>
		{/foreach}
	{else}
	<div class="list-group-item">
		{t}No transactions for{/t} {$collection.periodToReadableFormat()}
	</div>	
	{/if}

	{if $collection|default:false && $collection.hasPrevPeriod()}
	<div class="list-group-item">
		<button type="button" class="btn btn-default btn-sm btn-info btn-block" id="goto_prev">
		<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span> {$collection.prevPeriodToReadableFormat()}</button>
	</div>
	{/if}



</div>
{/if}