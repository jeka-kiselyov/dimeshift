$(function() {

	$('body').append("<form id='table_helper_sort_form' method='post'><input type='hidden' name='order_by' value='id' id='table_helper_sort_column'></form>");
	$('body').append("<form id='table_helper_search_form' method='post'><input type='hidden' name='q' value='id' id='table_helper_search'></form>");

});

function sort(column)
{
	$("#table_helper_sort_column").val(column);
	$("#table_helper_sort_form").submit();
}

function show_search()
{
	$("#show_filter").hide();
	$("#search_area").show();
}

function do_search()
{
	$("#table_helper_search").val($("#search_q").val());
	$("#table_helper_search_form").submit();
}

function remove_search()
{
	$("#search_q").val("");
	do_search();
}


function remove_item(item_id)
{
	$('#delete_item_modal_item_id').val(item_id);
	$('#delete_item_modal').modal({});
}


