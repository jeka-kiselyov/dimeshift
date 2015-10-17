<ul class="breadcrumb">
  <li><a href="{$settings->site_path}">{t}Home{/t}</a></li>
  <li class="active">{t}Settings{/t}</li>
</ul>


<div class="row">
	<div class="col-xs-12 col-md-9">

	<div id="profile_change_password_container">
		<div class="alert alert-info" role="alert" style="display: none;">
			{t}Your password has been successfully changed{/t}
		</div>
		<div class="alert alert-danger" role="alert" style="display: none;">
			<span class="errorNo1" data-input="current_password_input">{t}Invalid current password{/t}</span>
			<span class="errorNo2" data-input="new_password_repeat_input">{t}Passwords missmatch{/t}</span>
			<span class="errorNo3" data-input="new_password_input">{t}New password is too short{/t}</span>
		</div>
		<form id="change_password_form">
			<div class="form-group">
				<label for="current_password_input">{t}Current Password{/t}</label>
				<input type="password" class="form-control" 
					id="current_password_input" 
					placeholder="{t}Current Password{/t}">
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

			<input type="submit" class="btn btn-primary" value="{t}Change Password{/t}">
		</form>
	</div>


	</div>
	<div class="col-xs-12 col-md-3">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">{t}Settings{/t}</h3>
			</div>
			<div class="panel-body">
				<ul class="nav nav-pills nav-stacked">
					<li class="active"><a href="#"><span class="glyphicon glyphicon-lock" ></span> {t}Change Password{/t}</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
