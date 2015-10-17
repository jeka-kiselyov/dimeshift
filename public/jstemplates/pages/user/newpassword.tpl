{if isset($invalid_code) && $invalid_code}
        <div class="alert alert-danger errors-container">
          Invalid restore code
        </div>
{else}

<script>
  $(function(){
    App.showDialog('NewPassword', { code: '{$code}', hash: '{$hash}'});
  });
</script>

{/if}