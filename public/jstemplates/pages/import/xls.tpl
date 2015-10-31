<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li><a href="{$settings->site_path}/wallets">{tp}Wallets{/tp}</a></li>
  <li class="active">{tp}Import .xls file{/tp}</li>
</ul>


<div class="row">
<div class="col-xs-12 col-md-12">


	{if $step == 1 && !$sample}
	<div class="panel panel-default" id="step_1">
		<div class="panel-heading">Step 1. Select .xls file to import</div>
		<div class="panel-body">

			<div class="alert alert-danger" role="alert" style="display: none;">
				{tp}Invalid xls file. Please select another one and try again{/tp}
			</div>

			<input type="file" id="file_input" style="display: none;">
			<input type="button" class="select_file_button btn btn-primary" value="{t}Select file{/t}" data-loading-text="{t}Uploading...{/t}">
			<p>{tp}Please select your local .xls file{/tp}</p>
			<a href="{$settings->site_path}/wallets/{$wallet_id}" class="btn btn-default">{tp}Cancel{/tp}</a>

		</div>
	</div>
	{/if}

	{if $step == 1 && $sample}
	<div class="panel panel-default" id="step_2">
		<div class="panel-heading">Step 2. Select columns to import</div>
		<div class="panel-body">

			<div style="overflow-x: scroll">
			{if $sample}
			<table class="table table-striped  table-condensed table-bordered">
				<tr>
				{for $var=1 to $sampleWidth}
					<td>
						<select name="import_row_{$var}_type" class="import_row_type">
							<option value=''>Do not import</option>
							<option value='description' {if $selectedFields.description==$var} selected="selected"{/if}>Description</option>
							<option value='date' {if $selectedFields.date==$var} selected="selected"{/if}>Date</option>
							<option value='time' {if $selectedFields.time==$var} selected="selected"{/if}>Time</option>
							<option value='amount' {if $selectedFields.amount==$var} selected="selected"{/if}>Amount</option>
							<option value='abs_amount' {if $selectedFields.abs_amount==$var} selected="selected"{/if}>Expense amount</option>
						</select>

						<div>
							<select id="import_row_{$var}_date_format" class="import_row_date_format " style="display: none;">
							{foreach from=$dateFormats item=f}
								<option value='{$f|escape}'>{$f|escape}</option>
							{/foreach}
							</select>
						</div>

						<div>
							<select id="import_row_{$var}_time_format" class="import_row_time_format " style="display: none;">
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
						{foreach from=$row.items item=c}
							<td><div class="sample_cell">{$c}</div></td>
						{/foreach}
					</tr>
					{else}
					<tr class="active">
						<td colspan="{$sampleWidth}">... {$row.skiped} more rows</td>
					</tr>
					{/if}
					</tr>
				{/foreach}
			</table>
			{/if}
			</div>

			<div class="pull-right">
				<p class="text-danger pull-left bg-warning" id="proccess_step1_warning" style="padding: 7px; display: block;">
					{tp}Amount and Date fields are required{/tp}
				</p>
				<input type="button" disabled="disabled" id="proccess_step1_button" class=" btn btn-primary pull-right" value="{t}Preview{/t}">
			</div>
		</div>
	</div>
	{/if}

	{if $step == 2}
	<div class="panel panel-default" id="step_2">
		<div class="panel-heading">Step 3. Preview and settings</div>
		<div class="panel-body">

			{if $importPreview}
			<table class="table table-striped  table-condensed table-bordered">
				<tr>
					<th>Date</th>
					<th>Time</th>
					<th>Description</th>
					<th>Amount</th>
				</tr>
				{foreach from=$importPreview item=i}
				<tr>
					<td>{$i.date|wallet_date}</td>
					<td>{$i.date|wallet_time}</td>
					<td class="sample_cell">{if $i.description}{$i.description|escape}{else}&nbsp;{/if}</td>
					<td>{$i.amount|escape}</td>
				</tr>
				{/foreach}
				<tr>
					<td colspan="4">{tp}Few more rows{/tp}</td>
				</tr>
			</table>
			{/if}


			<div class="checkbox">
				<label>
					<input type="checkbox" checked="checked" id="do_not_import_duplicates"> {tp}Do not import transaction, if it's already in database{/tp}
				</label>
			</div>

			<input type="button" id="proccess_step2_button" class="btn btn-primary pull-right" value="{t}Import{/t}">
			<input type="button" id="proccess_step2_cancel" class="btn btn-default pull-right" value="{t}Back{/t}">
		</div>
	</div>
	{/if}

	{if $step == 3}

	<div class="panel panel-default" id="step_2">
		<div class="panel-heading">Step 4. Import</div>
		<div class="panel-body">
			<div class="progress">
				<div class="progress-bar progress-bar-striped active" id="import_progress_bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 1%">
				<span class="sr-only">&nbsp;</span>
			</div>
			</div>
		</div>
	</div>


	{/if}


	{if $step == 4}

	<div class="panel panel-default" id="step_2">
		<div class="panel-heading">Finished</div>
		<div class="panel-body">
			<p>Import operation is finished. <a href="{$settings->site_path}/wallets/{$wallet_id}">Check out you updated wallet</a></p>
		</div>
	</div>


	{/if}

</div>
</div>