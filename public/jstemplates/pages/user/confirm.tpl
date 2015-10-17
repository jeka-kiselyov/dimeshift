<h4>Confirm your email address</h4>

{if $confirmed}
<div class="alert alert-success">
 Your email has been confirmed. You can <a href="{$settings->site_path}/user/signin/" class="signin_caller">log in</a> now.
</div>
{else}
<div class="alert alert-error">
 Invalid confirmation code.
</div>
{/if}