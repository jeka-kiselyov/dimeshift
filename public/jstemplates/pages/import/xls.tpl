<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li><a href="{$settings->site_path}/wallets">{tp}Wallets{/tp}</a></li>
  <li class="active">{tp}Import .xls file{/tp}</li>
</ul>


<div class="row">
<div class="col-xs-12 col-md-12">


	{if !$sample}
	<div class="panel panel-default" id="step_1">
		<div class="panel-heading">Step 1. Select .xls file to import</div>
		<div class="panel-body">

			<div class="alert alert-danger" role="alert" style="display: none;">
				{tp}Invalid xls file. Please select another one and try again{/tp}
			</div>

			<input type="file" id="file_input" style="display: none;">

			<input type="button" class="select_file_button btn btn-primary pull-left" value="{t}Select file{/t}" data-loading-text="{t}Uploading...{/t}">
			<input type="button" class="btn btn-default" value="{t}Cancel{/t}" data-loading-text="{t}Canceling...{/t}">

		</div>
	</div>
	{/if}

	{if $sample}
	<div class="panel panel-default" id="step_2">
		<div class="panel-heading">Step 2. Select columns to import</div>
		<div class="panel-body">

			<div style="overflow-x: scroll">
			{if $sample}
			<table class="table table-striped  table-condensed table-bordered">
				<tr>
					<td>&nbsp;</td>
				{for $var=1 to $sampleWidth}
					<td>
						<select name="import_row_{$var}_type" class="import_row_type">
							<option value=''>Do not import</option>
							<option value='description'>Description</option>
							<option value='date'>Date</option>
							<option value='time'>Time</option>
							<option value='amount'>Amount</option>
							<option value='abs_amount'>Expense amount</option>
						</select>

						<div>
							<select id="import_row_{$var}_date_format" class="import_row_date_format" style="display: none;">
							{foreach from=$dateFormats item=f}
								<option value='{$f|escape}'>{$f|escape}</option>
							{/foreach}
							</select>
						</div>

						<div>
							<select id="import_row_{$var}_time_format" class="import_row_time_format" style="display: none;">
							{foreach from=$timeFormats item=f}
								<option value='{$f|escape}'>{$f|escape}</option>
							{/foreach}
							</select>
						</div>

					</td>
				{/for}
				</tr>
				{foreach from=$sample item=row key=i}
					{if $row.items|count}
					<tr class="sample_import_row" id="sample_import_row_{$row.y}">
						<td>
							<input type="checkbox" name="do_not_import[$row.y]">
						</td>
						{foreach from=$row.items item=c}
							<td><div class="sample_cell">{$c}</div></td>
						{/foreach}
					</tr>
					{else}
					<tr class="active">
						<td>&nbsp;</td><td colspan="{$sampleWidth}">... {$row.skiped} more rows</td>
					</tr>
					{/if}
					</tr>
				{/foreach}
			</table>
			{/if}
			</div>

		</div>
	</div>
	{/if}


</div>
</div>