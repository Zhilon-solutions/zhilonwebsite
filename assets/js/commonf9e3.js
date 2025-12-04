$(document).ready(function(){


    // Consent
    window.getCookie = (name = 'consent') => {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };
    jQuery.validator.addMethod("singleemail", function (value, element, params) {
        if (value != "") {
            var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
            return re.test(value);
        } else {
            return true;
        }
    }, "Please enter a valid email address.");
    $(".removeemoji").keyup(function () {
        var e = $(this).val();
        if (
            ((re = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g),
            re.test(e))
        ) {
            var u = e.replace(
                /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
                ""
            );
            $(this).val(u);
        }
    });
    jQuery.validator.addMethod("namevalidation", function (value, element, params) {
        result = true;
        if (value != "") {
           var re = /^[A-Za-z][A-Za-z ]*(?:_[A-Za-z ]+)*$/;
           result = re.test(value);
           return result;
        } else {
           return result;
        }
     }, 'Invalid input');
    $(".validfield").keyup(function () {
        var e = $(this).val();
        if (((re = /[`~!@#$%^&*()|+\=?;:'"<>\{\}\[\]\\\/]/gi), re.test(e))) {
            var u = e.replace(/[`~!@#$%^&*()|+\=?;:'"<>\{\}\[\]\\\/]/gi, "");
            $(this).val(u);
        }
    });

    $(".validemail").keyup(function () {
        var e = $(this).val();
        if (((re = /[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi), re.test(e))) {
            var u = e.replace(/[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi, "");
            $(this).val(u);
        }
    });

    $(".validfieldtextarea").keyup(function () {
        var e = $(this).val();
        if (((re = /[`~!@#$%^&()|+\=;<>\{\}\[\]\\\/]/gi), re.test(e))) {
            var u = e.replace(/[`~!@#$%^&()_|+\=;<>\{\}\[\]\\\/]/gi, "");
            $(this).val(u);
        }
    });

    $(".validdate").keyup(function () {
        var e = $(this).val();
        if (((re = /[`~!#$%^&*()_|+\=?;:'",123456789ABCDEFGHIJKLMNOPQRSTUVWXabcdefghijklmnopqrst<>\{\}\[\]\\\/]/gi), re.test(e))) {
            var u = e.replace(/[`~!#$%^&*()_|+\=?;:'",123456789ABCDEFGHIJKLMNOPQRSTUVWXabcdefghijklmnopqrst<>\{\}\[\]\\\/]/gi, "");
            $(this).val(u);
        }
    });

    $('.toUpperCase').on('input', function() {
        var val = $(this).val();
        $(this).val(val.charAt(0).toUpperCase() + val.slice(1));
    });

    $(document).on('click', '.ok-btn', function () {
        $('#modal-formSuccess').removeClass('show-modal');
        $('#modal-formError').removeClass('show-modal');
        $('html').removeClass('body-hide');
    });

    // Consent 
    window.getCookie = (name = 'consent') => {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };
})
// newsletter
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$.validator.addMethod("customEmail", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
}, "Please enter a valid email address.");


$('#newsLetterFrom').validate({
    rules: {
        news_email: {
            required: true,
            customEmail: true
        },
    },
    messages: {
        news_email: {
            required: "Please enter email address",
        },
    },
    errorElement: "i",
    submitHandler: function (form) {
        grecaptcha.ready(function() {
            grecaptcha.execute(SITE_KEY, {action: 'newsletter'}).then(function(token) {
                $('#recaptoken').val(token);

                let formData = new FormData(form);
                formData.append('consent_cookie',  String(getCookie('consent')));
                let url = SITE_URL + 'newsletter';

                $.ajax({
                    type: "POST",
                    url: url,
                    data: formData,
                    contentType: false,
                    processData: false,
                    beforeSend: function () {
                        $('#news-submit-btn').addClass('d-none');
                        $('#loading-div').removeClass('d-none');
                    },
                    success: function(response) {
                        if(response.success) {
                            $("#newsLetterFrom")[0].reset();
                            $('#modal-formSuccess').addClass('show-modal');
                            $('html').addClass('body-hide');
                            $('#success_msg_h4').html('Excellent!');
                            $('#success_msg').html(response.message);
                            $('#news-submit-btn').removeClass('d-none');
                            $('#loading-div').addClass('d-none');
                        } else {
                            $('#modal-formError').addClass('show-modal');
                            $('#error_msg').html(response.message);
                            $('#news-submit-btn').removeClass('d-none');
                            $('#loading-div').addClass('d-none');
                        }
                    },
                    error: function(error) {
                        let message = error.responseJSON?.message;
                        $('#modal-formError').addClass('show-modal');
                        $('#error_msg').html(message);
                        $('#news-submit-btn').removeClass('d-none');
                        $('#loading-div').addClass('d-none');
                    }
                });
            });
        });
    }
});
