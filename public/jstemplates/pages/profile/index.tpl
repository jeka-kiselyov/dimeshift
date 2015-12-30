<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li class="active">{tp}Settings{/tp}</li>
</ul>


<div class="row">
	<div class="col-xs-12 col-md-9">

	<div id="profile_change_password_container" class="profile_container">
		<div class="alert alert-info" role="alert" style="display: none;">
			{tp}Your password has been successfully changed{/tp}
		</div>
		<div class="alert alert-danger" role="alert" style="display: none;">
			<span class="errorNo1" data-input="current_password_input">{tp}Invalid current password{/tp}</span>
			<span class="errorNo2" data-input="new_password_repeat_input">{tp}Passwords missmatch{/tp}</span>
			<span class="errorNo3" data-input="new_password_input">{tp}New password is too short{/tp}</span>
		</div>
		<form id="change_password_form">
			<div class="form-group">
				<label for="current_password_input">{tp}Current Password{/tp}</label>
				<input type="password" class="form-control" 
					id="current_password_input" 
					placeholder="{t}Current Password{/t}" data-i18nplaceholder="Current Password">
			</div>

			<div class="form-group">
				<label for="new_password_input">{tp}New Password{/tp}</label>
				<input type="password" class="form-control" 
					id="new_password_input" 
					placeholder="{t}New Password{/t}" data-i18nplaceholder="New Password">
			</div>

			<div class="form-group">
				<label for="new_password_repeat_input">{tp}Repeat Password{/tp}</label>
				<input type="password" class="form-control" 
					id="new_password_repeat_input" 
					placeholder="{t}Repeat Password{/t}" data-i18nplaceholder="Repeat Password">
			</div>

			<input type="submit" class="btn btn-primary" data-i18nvalue="Change Password" value="{t}Change Password{/t}">
		</form>
	</div>


	<div id="profile_remove_account_container" class="profile_container" style="display: none;">

		<div id="profile_remove_account_step_1">
			<div class="alert alert-danger" role="alert">
				{tp}Please think twice. All account data will be lost.{/tp}
			</div>

			<form id="remove_account_step_1_form">
				<input type="submit" class="btn btn-primary" id="remove_account_step_1_submit" data-i18nvalue="Remove account" value="{t}Remove account{/t}">
			</form>
		</div>

		<div id="profile_remove_account_step_2" style="display: none;">

			<div class="alert alert-danger" role="alert">
				{tp}Security code{/tp} {tp}has been mailed to your email. Please fill this form to finish account removal.{/tp}
			</div>

			<div class="alert alert-info" id="profile_remove_account_done" role="alert" style="display: none;">
				{tp}Your account has been removed. We will miss you :({/tp}
			</div>

			<div class="alert alert-info" id="invalid_remove_account_code" role="alert" style="display: none;">
				{tp}Invalid{/tp} {tp}Security code{/tp}
			</div>

			<div class="form-group">
				<label for="remove_account_code">{tp}Security code{/tp}</label>
				<input type="text" class="form-control" 
					id="remove_account_code" 
					placeholder="{t}Security code{/t}" data-i18nplaceholder="Security code">
			</div>

			<form id="remove_account_step_2_form">
				<input type="submit" class="btn btn-primary" id="remove_account_step_2_submit" data-i18nvalue="Remove account" value="{t}Remove account{/t}">
			</form>
		</div>
	</div>

	</div>
	<div class="col-xs-12 col-md-3">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">{tp}Settings{/tp}</h3>
			</div>
			<div class="panel-body">
				<ul class="nav nav-pills nav-stacked">
					<li class="active"><a href="#" data-target="change_password" class="select_part"><span class="glyphicon glyphicon-lock" ></span> {tp}Change Password{/tp}</a></li>
					{if user.isDemo()}
					<li class="disabled"><a href="#"><span class="glyphicon glyphicon-trash" ></span> {tp}Remove account{/tp}</a></li>
					{else}
					<li><a href="#" data-target="remove_account" class="select_part"><span class="glyphicon glyphicon-trash" ></span> {tp}Remove account{/tp}</a></li>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</div>
