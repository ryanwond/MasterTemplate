/**
 * Created by wangrui on 2017/10/23.
 */


var $add = $("#add");
var $master_template_modal = $("#master_template_modal");
var $master_del_modal = $("#master_del_modal");

$add.on("click", function (e) {
    e.preventDefault();
    $master_template_modal.modal("show");
});

var GetMasterTemplateInfo = function(){
    var ajax_source = "/getmastertemplateinfo";
    var aoColumns = [
        {
            "mDataProp": "id",
            'sClass': 'center',
            "sTitle": "id"
        },
        {
            "mDataProp": "channel",
            'sClass': 'center',
            "sTitle": "channel"
        },
        {
            "mDataProp": "canvas",
            'sClass': 'center',
            "sTitle": "canvas"
        },
        {
            "mDataProp": "preview_url",
            'sClass': 'center',
            "sTitle": "preview_url"
        },
        {
            "mDataProp": "description",
            'sClass': 'center',
            "sTitle": "description"
        },
        {
            "mDataProp": "display_name",
            'sClass': 'center',
            "sTitle": "display_name"
        },
        {
            "mDataProp": "is_single",
            'sClass': 'center',
            "sTitle": "is_single"
        },
        {
            "mDataProp": "image_dimensions",
            'sClass': 'center',
            "sTitle": "image_dimensions"
        },
        {
            "mDataProp": "html_contents",
            'sClass': 'center',
            "sTitle": "html_contents"
        },
        {
            "mDataProp": "css_contents",
            'sClass': 'center',
            "sTitle": "css_contents"
        },
        {
            "sTitle": "operation",
            "sClass": "center",
            "sDefaultContent": "<button onclick=\"mod_master(this)\" class=\"btn default btn-xs\" data-toggle=\"modal\"><i class=\"fa fa-edit\"></i></button>"
            + "&nbsp;&nbsp;&nbsp;&nbsp;<button onclick=\"del_master(this)\" class=\"btn default btn-xs red\" data-toggle=\"modal\"> <i class=\"fa fa-trash-o\"></i></button>"
        }
    ];
    dataTablePage($("#master_template_table"), aoColumns, ajax_source, {}, false, null);
};

GetMasterTemplateInfo();

var mod_master = function (data) {
    $master_template_modal.modal("show");
};


var del_master = function (data) {
    $master_del_modal.modal("show");
};