
const signInForm = document.querySelector('#signin-form');
const signInButton = document.querySelector('#signin-form #submit-btn');
const emailField = document.querySelector('#signin-form #email');
const passwordField = document.querySelector('#signin-form #password');


addOnPostAndOnResponseFuncAttr(signInButton, 'Signing in...');

signInForm.onsubmit = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    if (!isValidEmail(emailField.value)) {
        formFieldHasError(emailField.parentElement, 'Invalid email address!');
        return;
    }
    
    const formData = new FormData(signInForm);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    data['timezone'] = getClientTimezone();
    
    signInButton.onPost();

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        mode: 'same-origin',
        body: JSON.stringify(data),
    }

    fetch(signInForm.action, options).then((response) => {
        if (!response.ok) {
            signInButton.onResponse();
            response.json().then((data) => {
                const errorDetail = data.detail ?? null
                pushNotification("error", errorDetail ?? 'An error occurred!');
            });
            
        }else{
            response.json().then((data) => {
                pushNotification("success", data.detail ?? 'Sign in successful!');
                const redirectURL  = data.redirect_url ?? null
                if(!redirectURL) return;
                window.location.href = redirectURL;
            });
        }
    });
};
