/**
 * Created by wangrui on 2017/10/23.
 */


var $add = $("#add");
var $master_template_modal = $("#master_template_modal");
var $master_del_modal = $("#master_del_modal");
var $metadatas_modal = $("#metadatas_modal");

var $template_id = $("#id");
var $channel = $("#channel");
var $canvas = $("#canvas");
var $png_file = $("#png_file");
var $description = $("#description");
var $display_name = $("#display_name");
var $is_single = $("#is_single");
var $image_dimensions = $("#image_dimensions");
var $html_contents = $("#html_contents");
var $css_contents = $("#css_contents");
var $show = $("#show");

var $name = $("#name");
var $m_display_name = $("#m_display_name");
var $enable = $("#enable");
var $mock_value = $("#mock_value");
var $field_name = $("#field_name");
var $field_type = $("#field_type");
var $css = $("#css");

var G_METADATAS = {};

$add.on("click", function (e) {
    e.preventDefault();
    $template_id.val("");
    $channel.val("");
    $canvas.val("");
    $description.val("");
    $display_name.val("");
    $is_single.val("true");
    $image_dimensions.val("");
    $html_contents.val("");
    $css_contents.val("");
    $show.html("");
    $master_template_modal.modal("show");
});

$png_file.on('change', function(e){
    console.log('change.....');
    var files = this.files;
    if(files.length){
        checkFile(this.files);
    }
});

function checkFile(files){
    var file = files[0];
    var reader = new FileReader();
    if(!/image\/\w+/.test(file.type)){
        $show.html("Is not image.");
        return false;
    }
    reader.onload = function(e){
        $show.html('<img src="'+e.target.result+'" alt="img" height="200" width="200"/>');
    }
    reader.readAsDataURL(file);
}

var UploadMetaData = function(template_id){
    var success = function(data){
        if(data["status"] == "success"){
                GetMasterTemplateInfo();
                G_METADATAS = {};
        }
    }
    var data = {
        master_id: template_id,
        metadatas: JSON.stringify(G_METADATAS)
    }
    if (Object.keys(G_METADATAS).length != 0)
        my_ajax(true, '/uploadmetadatas', 'post', data, false, success);
};

$("#btn_submit").on("click", function (e) {
    e.preventDefault();
    $master_template_modal.modal("hide");
    App.blockUI($page_content, false);
    $.ajaxFileUpload(
        {
            url: "/operate",
            secureuri: false,
            type: "post",
            fileElementId: 'png_file',
            data: {
                id: $template_id.val(),
                channel: $channel.val(),
                canvas: $canvas.val(),
                description: $description.val(),
                display_name: $display_name.val(),
                image_dimensions: $image_dimensions.val(),
                is_single: $is_single.val(),
                html_contents: $html_contents.val(),
                css_contents: $css_contents.val()
            },

            dataType: 'json',
            success: function (data, status){
                App.unblockUI($page_content);
                if(data["status"] == "fail"){
                    alert_message($("#error_modal"), 0, 'Operate Fail.');
                }

                UploadMetaData(data["id"]);
            },
            error: function (XMLHttpRequest) {
                error_func(XMLHttpRequest);
            }
        }
    );
});
var COMMON_DATA = {};

var GetMasterTemplateInfo = function(){
    var ajax_source = "/getmastertemplateinfo";
    var success = function(data){
        var str_html = "";
        for(var i=0; i<data.length; i++){
            COMMON_DATA[data[i]["id"]] = data[i];
            str_html += "<tr>";
//            str_html += "<td>" + data[i]["id"] + "</td>";
            str_html += "<td>" + data[i]["channel"] + "</td>";
            str_html += "<td>" + data[i]["canvas"] + "</td>";
//            str_html += "<td>" + data[i]["preview_url"] + "</td>";
            str_html += "<td><img src='" + data[i]["preview_url"] + "' height=\"100\" width=\"100\"/></td>";
            str_html += "<td>" + data[i]["description"] + "</td>";
            str_html += "<td>" + data[i]["display_name"] + "</td>";
            str_html += "<td>" + data[i]["is_single"] + "</td>";
            str_html += "<td>" + data[i]["image_dimensions"] + "</td>";
//            str_html += "<td>" + data[i]["html_contents"] + "</td>";
//            str_html += "<td>" + data[i]["css_contents"] + "</td>";
            str_html += "<td>";
            str_html += '<a onclick="mod_master(' + "'" + data[i]["id"] + "'" + ')"' + 'class="btn default btn-xs" data-toggle="modal"> <i class="fa fa-edit"></i></a>';
            str_html += '&nbsp; <a onclick="del_master(' + "'" + data[i]["id"] + "'" + ')"' + 'class="btn default btn-xs red" data-toggle="modal"> <i class="fa fa-trash-o"></i></a>';
            str_html += "</td>";
            str_html += "</tr>";
        }
        $("#master_template_table").html(str_html);
    }
    my_ajax(true, ajax_source, 'get', {}, false, success);
};

GetMasterTemplateInfo();

var Display_Metadatas = function(){
    var str_html = "";
    for(var d in G_METADATAS){
        str_html += "<tr>";
        str_html += "<td>" + d + "</td>";
        str_html += "<td>";
        str_html += '<a onclick="mod_meta(' + "'" + d + "'" + ')"' + 'class="btn default btn-xs" data-toggle="modal"> <i class="fa fa-edit"></i></a>';
        str_html += '&nbsp; <a onclick="del_meta(' + "'" + d + "'" + ')"' + 'class="btn default btn-xs red" data-toggle="modal"> <i class="fa fa-trash-o"></i></a>';
        str_html += "</td>"
        str_html += "</tr>";
    }
    $("#metadatas_table").html(str_html);
}

var del_meta = function(name){
    delete G_METADATAS[name];
    Display_Metadatas();
}

var mod_meta = function(name){
    $name.val(name);
    $name.attr("disabled", true);
    var temp_meta = G_METADATAS[name];
    $m_display_name.val(temp_meta["display_name"]);
    $mock_value.val(temp_meta["mock_value"]);
    $field_name.val(temp_meta["field_name"]);
    $field_type.val(temp_meta["field_type"]);
    $css.val(temp_meta["css"]);
    $enable.val(temp_meta["enable"]);
    $metadatas_modal.modal("show");
}


var mod_master = function (d_id) {
    $template_id.val(d_id);
    var master_data = COMMON_DATA[d_id];
    $channel.val(master_data["channel"]);
    $canvas.val(master_data["canvas"]);
    $description.val(master_data["description"]);
    $display_name.val(master_data["display_name"]);
    $is_single.val(master_data["is_single"]);
    $image_dimensions.val(master_data["image_dimensions"]);
    $html_contents.val(master_data["html_contents"]);
    $css_contents.val(master_data["css_contents"]);
    $show.html('<img src="'+master_data["preview_url"]+'" alt="no image" height="200" width="200"/>');
    console.log(master_data);
    if(master_data.hasOwnProperty("metadatas")){
        G_METADATAS = master_data["metadatas"];
    }
    Display_Metadatas();
    $master_template_modal.modal("show");
};


var del_master = function (d_id) {
    $master_del_modal.modal("show");
    $("#confirm_del").attr("onclick", 'func_del_master("' + d_id + '");');
};

var func_del_master = function(d_id){
    var success = function(data){
        $master_del_modal.modal("hide");
        if(data["status"] == "fail"){
            alert_message($("#error_modal"), 0, 'Delete Fail.');
        }
        GetMasterTemplateInfo();
    }
    var req_data = {
        master_id: d_id
    }
    my_ajax(true, '/delete', 'get', req_data, true, success);
}


$("#add_metadatas").on("click", function(e){
    e.preventDefault();
    $name.attr("disabled", false);
    $name.val("");
    $m_display_name.val("");
    $mock_value.val("");
    $field_name.val("");
    $field_type.val("");
    $css.val("");
    $enable.val("true");
    $metadatas_modal.modal("show");
});


$("#btn_confirm").on("click", function(e){
    e.preventDefault();
    var name = $name.val();
    if (name.length == 0){
        return false;
    }
    var meta_data = {
        "@": "mst.render.template_metadata",
        "name": name,
        "display_name": $m_display_name.val(),
        "enable": $enable.val(),
        "mock_value": $mock_value.val(),
        "field_name": $field_name.val(),
        "field_type": $field_type.val(),
        "css": $css.val()
    };
    G_METADATAS[name] = meta_data;
    Display_Metadatas();
    console.log(G_METADATAS);
    $metadatas_modal.modal("hide");
});

$("#btn_cancel").on("click", function(e){
    e.preventDefault();
    $metadatas_modal.modal("hide");
})
