$(document).ready(function () {
    let intelInput;
    let careerFrmNo = $("#career_contact_number"); // jQuery object

    if (careerFrmNo.length) {
        intelInput = window.intlTelInput(careerFrmNo[0], window.telConfigInd);
    }

    $('#myModal a.close-btn').on('click', function () {
        let form = $('#careerFrm');
        $(form).find('.form-wrap').not(function () {
            return $(this).find('#occupation_id').length > 0;
        }).removeClass('has-value');
        form[0].reset();
        form.validate().resetForm();
        $('#job-apply-button-loader').prop("disabled", true);
        $('#myModal').removeClass('show-modal');
    });

    $("#careerFrm").validate({
        errorElement: "i",
        ignore: [],
        rules: {
            occupation_id: {
                required: true
            },
            experience: {
                required: true
            },
            name: {
                required: true,
                minlength: 3,
                maxlength: 90
            },
            email: {
                required: true,
                singleemail: true,
                minlength: 3,
                maxlength: 90
            },
            contact_number: {
                required: true,
                number: true,
                minlength: 4,
                maxlength: 15
            },
            organisation: {
                minlength: 3,
                maxlength: 90
            },
            designation: {
                minlength: 3,
                maxlength: 90
            },
            address: {
                required: true,
                minlength: 6,
                maxlength: 300
            },
            resume: {
                required: true
            },
            agreed: {
                required: true
            }
        },
        messages: {
            occupation_id: {
                required: "Please select a job"
            },
            experience: {
                required: "Please enter your experience"
            },
            name: {
                required: "Please enter your name"
            },
            email: {
                required: "Please enter your email"
            },
            contact_number: {
                required: "Please enter your contact number"
            },
            organisation: {
                required: "Please enter your current organization"
            },
            designation: {
                required: "Please enter your current designation"
            },
            address: {
                required: "Please enter your address"
            },
            resume: {
                required: "Please upload your resume"
            },
            agreed: {
                required: "Please check this"
            }
        },
        showErrors: function(errorMap, errorList) {
            this.currentElements.each(function() {
                $(this).closest(".form-element").find("span.file-error").html('');
            });

            this.defaultShowErrors();
        },
        submitHandler: function (form) {
            if(rendercaptcha == false) {
                recaptchaRender();
            }
            if(rendercaptcha) {
                const btn = $(form).find('button[type="submit"]');
                const btnTxt = btn.html();
                btn.attr('disabled', true).html(`Please Wait ...`);
                grecaptcha.ready(function() {
                    grecaptcha.execute(SITE_KEY, {action: 'CareerRequestForm'}).then(function(token) {
                        let data = new FormData(form);
                        data.append('recaptoken', token);
                        data.append('contact_number', intelInput.getNumber(intlTelInputUtils.numberFormat.E164));
                        data.append('consent_cookie',  String(getCookie('consent')));

                        $.ajax({
                            url: SITE_URL + 'job-request',
                            type: 'post',
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            beforeSend: function () {
                                $('#job-apply-button-loader').prop("disabled", true).val("Please Wait...");
                            },
                            success: function (res) {
                                if(res.success) {
                                    // Remove 'has-value' except for #occupation_id field
                                    $(form).find('.form-wrap').not(function () {
                                        return $(this).find('#occupation_id').length > 0;
                                    }).removeClass('has-value');
                                    $("#careerFrm")[0].reset();
                                    $('#upload-btn').html('')
                                    $("#myModal").removeClass("show-modal");                                    
                                    $("#modal-formSuccess").addClass("show-modal");
                                    $('html').addClass('body-hide');
                                    $('#success_msg_h4').html('Excellent!');
                                    $('#success_msg').html(res.message);
                                    $('#job-apply-button-loader').prop("disabled", false).val("Apply Now");
                                } else {
                                    $('#modal-formError').addClass('show-modal');
                                    $('#error_msg').html(res.message);
                                    $('#job-apply-button-loader').prop("disabled", false).val("Apply Now");
                                }
                                btn.attr('disabled', false).html(btnTxt);
                            },
                            error: function(){
                                $('#modal-formError').addClass('show-modal');
                                $('#error_msg').html("Somthing Went Wrong");
                            }
                        });
                    });
                });
            }
        }
    });

    $('.inputfile').on('change', function() {
        var file = this.files[0];
        var fileType = file.type;
        var fileSize = file.size;
        var validExtensions = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        var maxSize = 2 * 1024 * 1024;

        var $parent = $(this).parent();

        if ($.inArray(fileType, validExtensions) === -1) {
            $parent.addClass('textbox-error');
            let validationMessage = '';

            if ($parent.find('#file-7-error').length ){
                validationMessage = $parent.find('#file-7-error').html();
                $parent.find('#file-7-error').html('The file extension does not match the allowed types.') 
            } else {
                $parent.find('.file-error').html('The file extension does not match the allowed types.');
            }
            
            setTimeout(() => {
                $parent.find('#upload-btn').html('');
                $parent.find('.file-error').html('');
                $parent.find('#file-7-error').html(validationMessage || 'Please upload your resume');
                $parent.removeClass('textbox-error');
                // this.value = '';
            }, 3000);
        } else if (fileSize > maxSize) {
            $parent.addClass('textbox-error');
            let validationMessage = '';

            if ($parent.find('#file-7-error').length) {
                validationMessage = $parent.find('#file-7-error').html();
                $parent.find('#file-7-error').html('File size exceeds 2MB limit.') 
                $parent.siblings('#upload-btn').html(file.name);
            } else {
                $parent.find('.file-error').html('File size exceeds 2MB limit.');
                $parent.siblings('#upload-btn').html(file.name);
            }
            // this.value = '';
            setTimeout(() => {
                $parent.find('#upload-btn').html('');
                $parent.find('.file-error').html('');
                $parent.find('#file-7-error').html(validationMessage || 'Please upload your resume');
                $parent.removeClass('textbox-error');
                this.value = '';
            }, 3000);
        } else {
            $parent.removeClass('textbox-error');
            setTimeout(() => {
                $parent.find('#upload-btn').html(file.name);
            }, 3000);
        }
    });

    $('.apply').on('click', function() {
        $('.inputfile').parent().removeClass('textbox-error');
    });

    // conatct submit button disabled
    $('#conf_check_box').on('click', function () {
        $('#conf_check_box').is(':checked') ? $('#job-apply-button-loader').prop('disabled', false) : $('#job-apply-button-loader').prop('disabled', true);
    });
})
