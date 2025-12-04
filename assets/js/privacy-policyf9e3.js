$(document).ready(function () {
    function clearConsentCookie() {
        // Clear host-only cookie
        document.cookie = "consent=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        // Clear any existing domain-wide cookie
        const rootDomain = getRootDomain();
        document.cookie = "consent=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=." + rootDomain;
    }

    function setConsent(value) {
        const days = 365 * 5; // 5 years
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        // Assuming APP_URL is available in JS
        const rootDomain = getRootDomain();

        document.cookie =
            "consent=" +
            value +
            ";expires=" +
            expires.toUTCString() +
            ";path=/;SameSite=Lax";
            "consent=" + value +
            ";expires=" + expires.toUTCString() +
            ";path=/" +
            ";domain=." + rootDomain +
            ";SameSite=Lax";
    }
    // Handle the click event for the "I withdraw my consent" button
    $(".withdraw-consent").on("click", function (e) {
        e.preventDefault();
        clearConsentCookie()
        setConsent("false");
        setSuccessMessage('Consent preference updated');
    });

    // Handle the click event for the "I do not withdraw my consent" button
    $(".do-not-withdraw-consent").on("click", function (e) {
        e.preventDefault();
        clearConsentCookie()
        setConsent("true");
        setSuccessMessage('Your consent remains active');
    });

    function setSuccessMessage(message) {
        $(".fl-success").text(message).show();
        setTimeout(() => {
            $(".close-bnt").trigger("click");
            $(".fl-success").text('').hide()
        }, 3000);
    }
});