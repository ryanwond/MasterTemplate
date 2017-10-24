
var title = "MasterTemplate";
$("title").html(title);
//禁用modal框的空白和ESC键
$(".modal").modal({backdrop: 'static', keyboard: false});
$(".modal").modal("hide");
var $page_content = $('.page-content');
var _js_debug = false;

var my_ajax = function(is_load, url_handler, type, data, async, success_func){
    if (is_load) {
        App.blockUI($page_content, false);
    }
    $.ajaxSetup({
       cache: false
    });
    $.ajax({
        url: url_handler,
        type: type,
        data: data,
        dataType: 'json',
        async: async,
//        timeout: 20000,
        error: function (x, t, e) {
            if (is_load) {
                App.unblockUI($page_content);
            }
            show_error_modal(0, x.responseText);
        },
        success: function (data) {
            if (_js_debug) {
                console.log(data);
            }
            if (is_load) {
                App.unblockUI($page_content);
            }
            success_func(data);
        }
    })
};

var disPlayUsername = function () {
    var user_name = $.cookie("user_session");
    $("#username").html(user_name);
};
disPlayUsername();


var setLeftStyle = function () {
    var str_selected = '<span class="selected"></span>';
    if (typeof(channel_second) != "undefined" && channel_second != null && channel_second != "") {
        $("#channel" + channel_id + '_' + channel_second).addClass("active");
        $("#channel" + channel_id + ' a arrow').addClass("open");
    }
    $("#channel" + channel_id).addClass("active");
    $("#channel" + channel_id + " a").append(str_selected)
};
setLeftStyle();


var alert_message = function (modal_name, tag, message) {
    var mess = '<div class="modal-dialog modal-wide"><div class="modal-content">';
    mess += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal"></button>';
    mess += '<h4 class="modal-title">Message</h4></div>';
    mess += '<div class="modal-body">';
    if (tag == 1) {
        mess += '<div class="note note-success">';
    } else {
        mess += '<div class="note note-danger">';
    }
    var arry = message.split("|");
    mess += '<h4 class="block">';
    for (var a in arry) {
        mess += arry[a] + '<br>';
    }
    mess += '</h4></div></div>';
    mess += '<div class="modal-footer"><button type="button" data-dismiss="modal" class="btn red">Close</button></div></div></div>';
    modal_name.html(mess);
    modal_name.modal("show");
};


var create_del_modal = function (modal_div, message, confirm_id){
    var mess = '<div class="modal-dialog"><div class="modal-content">';
    mess += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal"></button>';
    mess += '<h4 class="modal-title">Message</h4></div>';
    mess += '<div class="modal-body"><div class="note note-danger">';

    mess += '<h4 class="block">' + message + '</h4></div></div>';
    mess += '<div class="modal-footer"><button type="button" data-dismiss="modal" class="btn red">Close</button>';
    mess += '<button id="' + confirm_id + '" type="button" data-dismiss="modal" class="btn green">Confirm</button></div></div></div>';
    modal_div.html(mess);
};



var commonValidation = function (form1, validate_data, message_data, func) {
    var error1 = $('.alert-danger', form1);
    form1.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: validate_data,
        messages: message_data,
        invalidHandler: function (event, validator) {
            error1.show();
            App.scrollTo(error1, -200);
        },

        highlight: function (element) {
            $(element)
                .closest('.form-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            error1.hide();
            func();
        }
    });
};



var iDisplayStart = 0;
var iDisplayLength = 10;

var dataTablePage = function(div_table, aoColumns, ajaxSource, data, sort_tag, func_callback){
    div_table.dataTable({
        "bPaginate" : true,
        "bFilter" : false,
        "bDestroy": true,
        "bLengthChange" : true,
        "bWidth": true,
        "iDisplayStart": iDisplayStart,
        "iDisplayLength" : iDisplayLength,
        "bSort" : sort_tag,
        "bProcessing" : true,
        "bServerSide" : true,
        "bAutoWidth": true,
        "bScrollCollapse" : true,
        "sAjaxSource": ajaxSource,
        "aoColumns": aoColumns,
        "sPaginationType": "bootstrap",
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            if (func_callback != null)
                func_callback(nRow, aData);
        },
        "fnServerData": function (sSource, aoData, fnCallback) {
            data["aoData"] = JSON.stringify(aoData);
            $.ajax({
                type: 'get',
                url: sSource,
                data: data,
                dataType: 'JSON',
                async: false,
                success: function (resp) {
                    fnCallback(resp)
                },
                error: function (XMLHttpRequest) {
                }
            })
        }
    });
};



