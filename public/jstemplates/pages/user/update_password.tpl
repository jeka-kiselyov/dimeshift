<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{t}Home{/t}</a></li>
  <li class="active">{t}Update Password{/t}</li>
</ul>


<div class="row">
	<div class="col-xs-12 col-md-9">

	<div id="profile_change_password_container">
		<div class="alert alert-info" role="alert" style="display: none;">
			{t}Your password has been successfully changed. You can <a href="{$settings->site_path}/wallets">sign in</a> with your new one.{/t}
		</div>
		<div class="alert alert-danger" role="alert" style="display: none;">
			<span class="errorNo1" data-input="password_restore_code">{t}Invalid Restore Password Code{/t}</span>
			<span class="errorNo2" data-input="new_password_repeat_input">{t}Passwords missmatch{/t}</span>
			<span class="errorNo3" data-input="new_password_input">{t}New password is too short{/t}</span>
		</div>
		<form id="update_password_form">
			<div class="form-group">
				<label for="password_restore_code">{t}Restore Password Code{/t}</label>
				<input type="text" disabled="disabled" class="form-control" 
					id="password_restore_code" value="{$password_restore_code|escape:'html'}">
			</div>

			<div class="form-group">
				<label for="password_restore_hash">{t}Restore Password Hash{/t}</label>
				<input type="text" disabled="disabled" class="form-control" 
					id="password_restore_hash" value="{$password_restore_hash|escape:'html'}">
			</div>

			<div class="form-group">
				<label for="new_password_input">{t}New Password{/t}</label>
				<input type="password" class="form-control" 
					id="new_password_input" 
					placeholder="{t}New Password{/t}">
			</div>

			<div class="form-group">
				<label for="new_password_repeat_input">{t}Repeat Password{/t}</label>
				<input type="password" class="form-control" 
					id="new_password_repeat_input" 
					placeholder="{t}Repeat Password{/t}">
			</div>

			<input type="submit" class="btn btn-primary" value="{t}Update Password{/t}">
		</form>
	</div>


	</div>
	<div class="col-xs-12 col-md-3">
	</div>
</div>
