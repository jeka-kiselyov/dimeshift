


<div class="panel panel-default">
	<div class="panel-heading">
		<h3 class="panel-title">{tp}Goals{/tp}</h3>
	</div>
	{if $plans|count > 0}
		<div class="list-group">
			{foreach from=$plans item=p}
				{if $p->plan->status != 'finished'}
				{assign var="hasActivePlans" value=true}
				<a href="{$settings->site_path}/plans/{$p->plan->id}" class="list-group-item">
					<h4 class="list-group-item-heading">{$p->plan->name|escape:'html'}</h4>
					{if $areStatsReady}
						{assign var="allowedToSpend" value=$p->allowedToSpend}
						<p class="list-group-item-text">
						{tp}You{/tp}

						{if $allowedToSpend < 0}
						<span id="preview_spend">{tp}can spend up to{/tp} </span>
						{else}
						<span id="preview_get">{tp}have to get{/tp} </span>
						{/if}

						{if $p->plan->goal_currency == 'USD'}${/if}{$allowedToSpend|rational}.<sup>{$allowedToSpend|decimal}</sup>{if $p->plan->goal_currency != 'USD'} {$p->plan->goal_currency}{/if}

						{tp}today{/tp}
						</p>
					{else}
						<p class="list-group-item-text">
							Loading
						</p>
					{/if}
				</a>
				{/if}
			{/foreach}
		</div>
	{/if}

	{if !$hasActivePlans}
		<div class="panel-body">
			{tp}There're no goals defined for this wallet{/tp}
			<a href="{$settings->site_path}/plans" class="btn btn-default btn-block">{tp}Set Goal{/tp}</a>
		</div>
	{/if}
</div>