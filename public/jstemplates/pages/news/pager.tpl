{if $total_pages > 1}
<div class="pagination">
	<span>Pages</span>
	{if $current_page > 1}<a href="{$page_url_format|sprintf:''}">1</a>{/if}
	{if $current_page > 4}<a href="{$page_url_format|sprintf:($current_page-4)}">{$current_page-3}</a>{/if}
	{if $current_page > 3}<a href="{$page_url_format|sprintf:($current_page-3)}">{$current_page-2}</a>{/if}
	{if $current_page > 2}<a href="{$page_url_format|sprintf:($current_page-2)}">{$current_page-1}</a>{/if}
	{if $current_page > 0}<a href="{$page_url_format|sprintf:($current_page-1)}">{$current_page}</a>{/if}
	<a href="#" onclick="return false;" class="current_page">{$current_page+1}</a>
	{if $current_page < $total_pages}<a href="{$page_url_format|sprintf:($current_page+1)}">{$current_page+2}</a>{/if}
	{if $current_page < $total_pages - 2}<a href="{$page_url_format|sprintf:($current_page+2)}">{$current_page+3}</a>{/if}
	{if $current_page < $total_pages - 3}<a href="{$page_url_format|sprintf:($current_page+3)}">{$current_page+4}</a>{/if}
	{if $current_page < $total_pages - 4}<a href="{$page_url_format|sprintf:($current_page+4)}">{$current_page+5}</a>{/if}
	{if $current_page < $total_pages - 1}<a href="{$page_url_format|sprintf:($total_pages)}">{$total_pages+1}</a>{/if}
</div>
{/if}