<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{tp}Home{/tp}</a></li>
  <li class="active">{tp}Settings{/tp}</li>
</ul>


<div class="row">
	<div class="col-xs-12 col-md-9">

	<div id="profile_change_password_container">
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


	</div>
	<div class="col-xs-12 col-md-3">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">{tp}Settings{/tp}</h3>
			</div>
			<div class="panel-body">
				<ul class="nav nav-pills nav-stacked">
					<li class="active"><a href="#"><span class="glyphicon glyphicon-lock" ></span> {tp}Change Password{/tp}</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
