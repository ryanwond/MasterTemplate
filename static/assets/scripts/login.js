var Login = function () {
	var handleLogin = function() {
		$('.login-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                }
	            },
	            messages: {
	                username: {
	                    required: "username is required."
	                },
	                password: {
	                    required: "password is required."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-danger', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
                    var username = $("input[name='username']").val();
                    var password = $("input[name='password']").val();
                    $.ajax({
                        type: 'post',
                        url: '/login',
                        data: {username: username, password: password},
                        dataType: 'JSON',
                        success: function (data) {
                            if (data["status"] == "fail"){
                                $('.alert-danger span').html(data["errmsg"]);
                                $('.alert-danger').show();
                            }
                            else{
                                window.location.href = "/";
                            }
                        },
                        error: function () {
                        }
                    })
	            }
	        });

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                    $('.login-form').submit(); //form validation success, call ajax form submit
	                }
	                return false;
	            }
	        });
	};
    handleLogin();
}();