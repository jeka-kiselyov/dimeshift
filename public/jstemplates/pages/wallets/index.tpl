<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{t}Home{/t}</a></li>
  <li class="active">{t}Your Wallets{/t}</li>
</ul>


<div class="row">
<div class="col-xs-12 col-md-9">

	{if $items|count == 0}
		{if $status|default:'active' == 'active'}
			<div class="alert alert-warning" role="alert">{t}You have no wallets{/t} <a href="{$settings->site_path}/wallets/add" class="btn btn-primary btn-xs">{t}Add{/t}</a></div>
		{else}
			<div class="alert alert-warning" role="alert">{t}You have no hidden wallets{/t}</div>			
		{/if}
	{else}
		<div class="list-group wallet_item">
		{foreach from=$items item=i}
			<a href="{$settings->site_path}/wallets/{$i->id}" class="list-group-item item" data-id="{$i->id}" 
				{if $i->origin|default:'mine' == 'shared'}style="background: #eee"{/if}>
			    
				
				<div class="pull-right {if $i->total >= 0}text-success{else}text-danger{/if} 
				transaction_amount"><strong>{if $i->total < 0}-{/if}{if $i->currency == 'USD'}${/if}{$i->total|rational}.<sup>{$i->total|decimal}</sup>{if $i->currency != 'USD'} {$i->currency}{/if}</strong></div>

				<div class="item_buttons hideme wallet_buttons">
				{if $i->origin|default:'mine' == 'mine'}
					<button class="btn btn-default btn-xs item_button_remove"><span class="glyphicon glyphicon-trash"></span> {if $i->status|default:'active' == 'active'}{t}Hide{/t}{else}{t}Remove{/t}{/if}</button>
					{if $i->status|default:'active' == 'active'}
					<button class="btn btn-default btn-xs item_button_edit"><span class="glyphicon glyphicon-pencil"></span> {t}Edit{/t}</button>
					<button class="btn btn-default btn-xs item_button_accesses"><span class="glyphicon glyphicon-user"></span> {t}Manage Accesses{/t}</button>
					{/if}
					{if $i->status|default:'active' == 'hidden'}
					<button class="btn btn-default btn-xs item_button_restore"><span class="glyphicon glyphicon-repeat"></span> {t}Restore{/t}</button>
					{/if}
				{/if}
				</div>
				<h4 class="list-group-item-heading">
				{if $i->origin|default:'mine' == 'shared'}<span class="glyphicon glyphicon-share-alt" title="{t}This wallet is shared with you by another user{/t}"></span> {/if}
				{$i->name|escape:'html'}</h4>

			</a>
		{/foreach}

		{if $status|default:'active' == 'active'}
			<div class="list-group-item list-group-item-info"><a href="{$settings->site_path}/wallets/add" class="btn btn-primary">{t}Add{/t}</a></div>
		{/if}
		</div>	
	{/if}

</div>
<div class="col-xs-12 col-md-3">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{t}Filter{/t}</h3>
		</div>
		<div class="panel-body">
			<ul class="nav nav-pills nav-stacked">
				<li {if $status|default:'active' == 'active'}class="active"{/if}><a href="#" class="filter_menu" data-status="active"><span class="glyphicon glyphicon-ok"></span> {t}Active{/t}</a></li>
				<li {if $status|default:'active' == 'hidden'}class="active"{/if}><a href="#" class="filter_menu" data-status="hidden"><span class="glyphicon glyphicon-trash"></span> {t}Trash{/t}</a></li>
			</ul>
		</div>
	</div>


	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">{t}Access{/t}</h3>
		</div>
		<div class="panel-body">
			<ul class="nav nav-pills nav-stacked">
				<li {if $origin|default:'both' == 'both'}class="active"{/if}><a href="#" class="origin_menu" data-origin="both"><span class="glyphicon glyphicon-ok"></span> {t}Both{/t}</a></li>
				<li {if $origin|default:'both' == 'mine'}class="active"{/if}><a href="#" class="origin_menu" data-origin="mine"><span class="glyphicon glyphicon-user"></span> {t}Yours{/t}</a></li>
				<li {if $origin|default:'both' == 'shared'}class="active"{/if}><a href="#" class="origin_menu" data-origin="shared"><span class="glyphicon glyphicon-share-alt"></span> {t}Shared with you{/t}</a></li>
			</ul>
		</div>
	</div>


</div>
</div>
