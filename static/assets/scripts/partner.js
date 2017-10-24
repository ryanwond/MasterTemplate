/**
 * Created by wangrui on 14/12/11.
 */

create_del_modal($("#partner_del_modal"), "是否删除此渠道信息?", "confirm_del_partner");

$("#partner_add").bind("click", function(e){
    e.preventDefault();
    $("#partner_id").val("");
    $("#partner_nname").val("");
    $("#partner_name").val("");
    $("#partner_code").val("");
    $("#partner_desc").val("");
    $("#partner_modal").modal("show");
});

var partnerValidation = function () {
    var partner_form = $('#partner_form');
    var validate_data = {
        partner_nname: {
            required: true
        },
        partner_name: {
            required: true
        },
        partner_code: {
            required: true,
            rangelength: [3,3]
        }
    };
    var messages_data = {
        partner_nname: {
            required: "请输入别名"
        },
        partner_name: {
            required: "请输入名称."
        },
        partner_code: {
            required: "请输入编码.",
            rangelength: "请输入三位编码"
        }
    };
    var submit_method = function() {
        var partner_id = $("#partner_id").val();
        var partner_nname = $("#partner_nname").val();
        var partner_name = $("#partner_name").val();
        var partner_code = $("#partner_code").val();
        var partner_desc = $("#partner_desc").val();
        var success  = function(data){
            $("#partner_modal").modal("hide");
            if (data["status"] == 0) {
                alert_message($("#partner_alert_modal"), 0, "编码重复,请重新输入.");
            } else if (data["status"] == 2) {
                alert_message($("#partner_alert_modal"), 0, "操作数据库失败.");
            }

            getPartnerData();
        };
        var data = {
            partner_id: partner_id,
            partner_name: partner_name,
            partner_nname: partner_nname,
            partner_code: partner_code,
            partner_desc: partner_desc
        };
        my_ajax(true, '/operate_partner', 'get', data, true, success);
    };
    commonValidation(partner_form, validate_data, messages_data, submit_method);
};

partnerValidation();

var getPartnerData = function(){
    var ajax_source = "/querypartnerpage";
    var aoColumns = [
        {
            "mDataProp": "id",
            "sClass": "center",
            "bVisible": false
        },
        {
            "mDataProp": "name",
            "sClass": "center",
            "sTitle": "名称"
        },
        {
            "mDataProp": "code",
            "sClass": "center",
            "sTitle": "编码"
        },
        {
            "sTitle": "操作",
            "sClass": "center",
            "sDefaultContent": "<button onclick=\"mod_func(this)\" class=\"btn default btn-xs\" data-toggle=\"modal\">修改 <i class=\"fa fa-edit\"></i></button>" +
                "<button onclick=\"del_func(this)\" class=\"btn default btn-xs red\" data-toggle=\"modal\">删除 <i class=\"fa fa-trash-o\"></i></button>"
        }
    ];

    dataTablePage($("#table_partner"), aoColumns, ajax_source, {}, false, null);
};
getPartnerData();

var mod_func = function(btn){
    var nRoW = $(btn).parents('tr')[0];
    var data = $("#table_partner").dataTable().fnGetData(nRoW);
    $("#partner_id").val(data["id"]);
    $("#partner_nname").val(data["alias"]);
    $("#partner_name").val(data["name"]);
    $("#partner_code").val(data["code"]);
    $("#partner_desc").val(data["desc"]);
    $("#partner_modal").modal("show");
};

var del_func = function(btn){
    var nRoW = $(btn).parents('tr')[0];
    var data = $("#table_partner").dataTable().fnGetData(nRoW);
    $("#partner_del_modal").modal("show");
    $("#confirm_del_partner").attr('onclick', "confirm_del(" + data["id"] + ")");
};

var confirm_del = function(id){
    var success = function(data){
        if (data["status"] < 0) {
            alert_message($("#partner_alert_modal"), 0, "操作失败.")
        } else {
            $("#partner_del_modal").modal("hide");
            getPartnerData();
        }
    };
    var data = {
        id: id
    };
    my_ajax(true, '/delete_partner', 'get', data, true, success);
};
