<div class="row">
<div class="col-xs-12 col-sm-12 col-md-9">

  {if $items|count == 0}
  <p class="text-warning">{t}No news found{/t}</p>
  {else}
  {foreach from=$items item=i}
  <div class="media">
    <a class="pull-left to_news_item" href="{$settings->site_path}/news/view/{$i->slug}.html" data-news-item-id="{$i->id}">
      <img class="media-object img-thumbnail" src="{$settings->site_path}/uploads/images/{$i->preview_image}" style="max-width: 117px;">
    </a>
    <div class="media-body">
      <h4 class="media-heading"><a href="{$settings->site_path}/news/view/{$i->slug}.html" class="to_news_item" data-news-item-id="{$i->id}">{$i.title|escape:'html'}</a></h4>
      <p>{$i->description}</p>

      <p class="text-muted">{t}posted on{/t} {$i->time_created|date_format:'M j, Y'}</p>
      <a href="{$settings->site_path}/news/view/{$i->slug}.html" class="btn btn-default btn-xs to_news_item" role="button" data-news-item-id="{$i->id}">{t}Read More{/t}</a>
    </div>
  </div>
  {/foreach}
  {/if}

  <ul class="pager">
  {if $news_category_id|default:0 == 0}
    <li class="previous {if $items|count < $perPage}disabled{/if}"><a href="{$settings->site_path}/news/recent/{$currentPage+1}" id="go_to_next">&larr; {t}Older{/t}</a></li>
    <li class="next {if $currentPage <= 1}disabled{/if}"><a href="{$settings->site_path}/news/recent/{$currentPage-1}" id="go_to_prev">{t}Newer{/t} &rarr;</a></li>
  {else}
    <li class="previous {if $items|count < $perPage}disabled{/if}"><a href="{$settings->site_path}/news/category/{$news_category_id}/{$currentPage+1}" id="go_to_next">&larr; {t}Older{/t}</a></li>
    <li class="next {if $currentPage <= 1}disabled{/if}"><a href="{$settings->site_path}/news/category/{$news_category_id}/{$currentPage-1}" id="go_to_prev">{t}Newer{/t} &rarr;</a></li>
  {/if}
  </ul>

</div>
<div class="col-xs-12 col-sm-12 col-md-3">
  {include file="shared/widgets/news_sidebar.tpl"}
</div>
</div>