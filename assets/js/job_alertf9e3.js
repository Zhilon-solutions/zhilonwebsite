        jQuery.validator.addMethod("singleemail", function(value, element, params) {
            if (value != "") {
                var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
                return re.test(value);
            } else {
                return true;
            }
        }, "Please enter a valid email address.");

        $('#jobAlertForm').validate({
            ignore: [],
            errorElement: "i",
            errorClass: "error",
            rules: {
                email: {
                    required: true,
                    singleemail: true,
                    minlength: 3,
                    maxlength: 90
                },
                category_id: {
                    required: true
                },
                type: {
                    required: true
                },
                callback_request: {
                    required: true
                }
            },
            messages: {
                email: {
                    required: "Please enter your email",
                    singleemail: "Please enter a valid email"
                },
                category_id: {
                    required: "Please select category"
                },
                type: {
                    required: "Please select type"
                },
                callback_request: {
                    required: "Agree to Privacy policy"
                },
            },
            errorPlacement: function(error, element) {
                error.insertAfter(element).css('text-align', 'left');
            },
            submitHandler: function(form) {
                if (rendercaptcha == false) {
                    recaptchaRender();
                }
                if (rendercaptcha) {
                    $('.jobAlertBtn').prop('disabled', true).html('Please Wait..');
                    grecaptcha.ready(function() {
                        grecaptcha.execute(SITE_KEY, {
                            action: 'JobAlertForm'
                        }).then(function(token) {
                            let data = new FormData(form);
                            data.append('recaptoken', token);
                            data.append('consent_cookie', String(getCookie('consent')));

                            $.ajax({
                                type: 'POST',
                                url: `${SITE_URL}job-alert`,
                                data: data,
                                cache: false,
                                contentType: false,
                                processData: false,
                                beforeSend: function () {
                                    $('#job-alertbutton-loader').prop("disabled", true).val("Please Wait...");
                                },
                                success: function(res) {
                                    $('#job-alertbutton-loader').prop("disabled", false).val("Confirm Job Alert");
                                    $('#myModal').removeClass('show-modal');

                                    if (res.success) {
                                        // Remove 'has-value' except for #looking_for field
                                        $(form).find('.form-wrap').not(function () {
                                            return $(this).find('[name="category_id"]').length > 0 || $(this).find('[name="type"]').length > 0;
                                        }).removeClass('has-value');

                                        $("#jobAlertForm")[0].reset();
                                        $('#modal-formSuccess').addClass('show-modal');
                                        $('html').addClass('body-hide');
                                        $('#success_msg_h4').html('Excellent!');
                                        $('#success_msg').html(res.message);
                                    } else {
                                        $('#modal-formError').addClass('show-modal');
                                        $('#error_msg_h4').html('Oh No!');
                                        $('#error_msg').html(res.message);
                                    }
                                },
                                error: function(xhr, status, error) {
                                    $('#myModal').removeClass('show-modal');
                                    $('#modal-formError').addClass('show-modal');
                                    $('#error_msg_h4').html('Error!');
                                    $('#error_msg').html('An error occurred. Please try again.');
                                    $('#job-alertbutton-loader').prop("disabled", false).val('Confirm Job Alert');

                                },
                                complete: function() {
                                    $('#job-alertbutton-loader').prop("disabled", false).val("Confirm Job Alert");
                                }
                            });
                        });
                    });
                }
            }
        });

        $('#myModal a.close-btn').on('click', function () {
            let form = $('#jobAlertForm');
            $(form).find('.form-wrap').not(function () {
                return $(this).find('[name="category_id"]').length > 0 || $(this).find('[name="type"]').length > 0;
            }).removeClass('has-value');
            form[0].reset();
            form.validate().resetForm();
            $('#job-alertbutton-loader').prop("disabled", true);
            $('#myModal').removeClass('show-modal');
        });

// conatct submit button disabled
$('#conf_check_box').on('click', function () {
    $('#conf_check_box').is(':checked') ? $('#job-alertbutton-loader').prop('disabled', false) : $('#job-alertbutton-loader').prop('disabled', true);
});