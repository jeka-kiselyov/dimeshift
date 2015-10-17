<div class="panel panel-default">
	<div class="panel-heading">
		<h3 class="panel-title">{t}Categories{/t}</h3>
	</div>
	<div class="panel-body">
		{if $categories|count > 0}
			<ul class="nav nav-pills nav-stacked">
			{foreach from=$categories item=c}
				<li id="news_sidebar_item_{$c->id}"><a href="{$settings->site_path}/news/category/{$c->id}" class="filter_menu">{$c->name|escape:'html'}</a></li>
			{/foreach}
			</ul>
		{else}
			{t}No categories defined{/t}
		{/if}
	</div>
</div>