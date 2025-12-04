$(document).ready(function () {
    let intelInput, intelInput2;
    let mainFormNo = $("#contact_number");
    let popupFormNo = $("#contact_number_global_form");

    if (mainFormNo.length) {
        intelInput = window.intlTelInput(mainFormNo[0], window.telConfigInd);
    }
    if (popupFormNo.length) {
        intelInput2 = window.intlTelInput(popupFormNo[0], window.telConfigInd);
    }
    
// if (popupFormNo.length) {
//     console.log('Initializing with countryCode:', countryCode); // Debug: check country code
//     intelInput2 = window.intlTelInput(popupFormNo[0], window.telConfigInd);
//     console.log('Initialized instance:', intelInput2); // Debug: check if initialized
// }


    var $contactForm = $('#contactUsForm').length ? $('#contactUsForm') : $('#contactUsForm1');

    $(document).on('change', 'select[name="contact_category_id"]', function () {
        var $category = $(this);
        var $offerCat = $contactForm.find('#offer_cat');
        var $contactSubat = $contactForm.find('select[name="contact_subcategory_id"]');

        $.ajax({
            type: 'POST',
            url: SITE_URL + 'contact-sub-category',
            data: {
                contact_category_id: $category.val(),
            },
            success: function (response) {
                if (response.success) {
                    $offerCat.css('opacity', '1');
                    $contactSubat.prop('disabled', false).html(response.subcategories).parent('.form-select').addClass('has-value').find('i.error').remove();
                } else {
                    $offerCat.css('opacity', '0.2');
                    $contactSubat.prop('disabled', true);
                }
            }
        });
    });

    $(document).on('change', 'select[name="contact_category_id_1"]', function () {
        var $category = $(this);
        var $offerCat = $contactForm.find('#offer_cat');
        var $contactSubat = $contactForm.find('select[name="contact_subcategory_id_1"]');

        $.ajax({
            type: 'POST',
            url: SITE_URL + 'contact-sub-category',
            data: {
                contact_category_id: $category.val(),
            },
            success: function (response) {
                if (response.success) {
                    $offerCat.css('opacity', '1');
                    $contactSubat.prop('disabled', false).html(response.subcategories).parent('.form-select').addClass('has-value').find('i.error').remove();
                } else {
                    $offerCat.css('opacity', '0.2');
                    $contactSubat.prop('disabled', true);
                }
            }
        });
    });
    
    const validationRules = {
        errorElement: "i",
        ignore: [],
        rules: {
            first_name: { required: true, minlength: 3, maxlength: 90, namevalidation: true },
            last_name: { required: true, minlength: 3, maxlength: 90, namevalidation: true },
            city: { required: true, minlength: 3, maxlength: 90, namevalidation: true },
            email: { required: true, singleemail: true, minlength: 3, maxlength: 90 },
            looking_for: { required: true },
            country_id: { required: true },
            contact_number: { required: true, number: true, minlength: 4, maxlength: 15 },
            company_name: { minlength: 3, maxlength: 90 },
            message: { required: true, minlength: 6, maxlength: 300 },
            captcha: { required: true, number: true, captchaValidation: true },
            contact_category_id: { required: () => $('#looking_for').val() == 2 },
            contact_subcategory_id: { required: () => $('#looking_for').val() == 2 },
            contact_category_id_1: { required: () => $('#looking_for_1').val() == 2 },
            contact_subcategory_id_1: { required: () => $('#looking_for_1').val() == 2 }
        },
        messages: {
            first_name: { required: "Please enter your first name" },
            last_name: { required: "Please enter your last name" },
            city: { required: "Please enter your city", maxlength: "City name cannot exceed 90 characters" },
            email: { required: "Please enter your email", email: "Please enter a valid email", maxlength: "Email cannot exceed 90 characters" },
            looking_for: { required: "Please select a service" },
            country_id: { required: "Please select your country of residence" },
            contact_number: { required: "Please enter your contact number", number: "Please enter a valid contact number", minlength: "Contact number must be at least 4 digits", maxlength: "Contact number cannot exceed 15 digits" },
            company_name: { required: "Company name cannot exceed 50 characters" },
            message: { required: "Please enter your message", minlength: "Message must be at least 6 characters", maxlength: "Message cannot exceed 500 characters" },
            captcha: { required: "Please enter the captcha", number: "Captcha must be a number", captchaValidation: "Captcha validation failed" },
            contact_category_id: { required: "Please select a category" },
            contact_subcategory_id: { required: "Please select a sub category" }
        }
    };

    // Load reCAPTCHA script async
    function loadRecaptcha(callback) {
        if (typeof grecaptcha !== 'undefined') return callback();
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?render=" + SITE_KEY;
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Submission handler (works for both forms)
    function handleSubmit(form) {
        const $btn = $(form).find('[type="submit"]');
        const btnTxt = $btn.val();

        loadRecaptcha(() => {
            grecaptcha.ready(() => {
                grecaptcha.execute(SITE_KEY, { action: 'ContactRequestForm' }).then(token => {
                    let data = new FormData(form);
                    data.append('recaptoken', token);
                    if (intelInput) {
                        data.append('contact_number', intelInput.getNumber(intlTelInputUtils.numberFormat.E164));
                    } else if (intelInput2) {
                        data.append('contact_number', intelInput2.getNumber(intlTelInputUtils.numberFormat.E164));
                    }
                    data.append('consent_cookie', String(getCookie('consent')));

                    $.ajax({
                        url: SITE_URL + 'contact-request',
                        type: 'POST',
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            $btn.prop('disabled', true).val('Please Wait...');
                        },
                        success: function (res) {
                            $btn.prop('disabled', false).val(btnTxt);
                            form.reset();
                            if (res.success) {
                                // Remove 'has-value' except for #looking_for field
                                $(form).find('.form-wrap').not(function () {
                                    return $(this).find('#looking_for').length > 0 || $(this).find('#looking_for_1').length > 0;
                                }).removeClass('has-value');
                                $('#modal-formSuccess').addClass('show-modal');
                                $('html').addClass('body-hide');
                                $('#success_msg_h4').html('Thank you for reaching out to us!');
                                $('#contact-popup').removeClass('show-modal');
                                $('body').css({
                                    position: '',
                                    top: '',
                                    left: '',
                                    right: '',
                                    width: '',
                                });
                                $(window).scrollTop(scrollPos); // restore scroll
                                $('#success_msg').html(res.message);
                                $('.hidden_div').show();
                            } else {
                                $('#modal-formError').addClass('show-modal');
                                $('#error_msg_h4').html('Oh No!');
                                $('#error_msg').html(res.message);
                            }
                        },
                        error: function () {
                            $('#modal-formError').addClass('show-modal');
                            $('#error_msg_h4').html('Oh No!');
                            $('#error_msg').html('Oops! Something went wrong.');
                            $btn.prop('disabled', false).val(btnTxt);
                        }
                    });
                });
            });
        });
    }

    // Initialize validation for each form separately
    $("#contactUsForm").validate($.extend(true, {}, validationRules, { submitHandler: handleSubmit }));
    $("#contactUsForm1").validate($.extend(true, {}, validationRules, { submitHandler: handleSubmit }));


   

    $('body').on('change', '#looking_for', function () {
        let $formWrap = $(this).closest('.form-wrap');
    
        // Add has-value class only if not already present
        if (!$formWrap.hasClass('has-value')) {
            $formWrap.addClass('has-value');
        }
        $('.hidden_div').toggle($(this).val() == 2);
    });
    
    $('body').on('change', '#looking_for_1', function () {
        let $formWrap = $(this).closest('.form-wrap');
    
        // Add has-value class only if not already present
        if (!$formWrap.hasClass('has-value')) {
            $formWrap.addClass('has-value');
        }
        $('.hidden_div').toggle($(this).val() == 2);
    });
    
    $('#looking_for').length > 0 && $('#looking_for').trigger('change');
    $('#looking_for_1').length > 0 && $('#looking_for_1').trigger('change');

    // conatct submit button disabled
    $('#conf_check_box').on('click', function () {
        $('#conf_check_box').is(':checked') ? $('#button-loader').prop('disabled', false) : $('#button-loader').prop('disabled', true);
    });

    $('#button-loader-common').prop('disabled', true);
    $('#conf_check_box_1').on('click', function () {
        $('#conf_check_box_1').is(':checked') ? $('#button-loader-common').prop('disabled', false) : $('#button-loader-common').prop('disabled', true);
    });
});




