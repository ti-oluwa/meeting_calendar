// Purpose: Contains utility functions used in the project

// Get the URL parameters and store them in a Proxy object
const URLParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});


/**
 * Waits for the given element to be available in the DOM
 * @param {String} selector The CSS selector of the element to wait for
 * @returns {Promise<Element>} The element that was waited for
 */
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
        }
    }
    return cookieValue;
};


/**
 * Gets the timezone of the client.
 * @returns {string} the timezone of the client
 */
function getClientTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}


/**
 * Gets the element that displays messages for the form field
 * @param {Element} formField The form field
 * @returns The message element of the form field
 */
function getMsgEl(formField) {
    if (!formField.classList.contains('form-field')) {
        throw new Error('Field must have class "form-field"');
    }
    return formField.querySelector('.field-message');
}


/**
 * Sets and displays the error message for the form field
 * @param {Element} formField The form field that has an error
 * @param {string} errorMsg The error message to display
 */
function formFieldHasError(formField, errorMsg) {
    const msgEl = getMsgEl(formField);
    if (!msgEl) throw new Error('Field must have a message element with class "field-message"');

    const fieldInput = formField.querySelector('.form-input');
    if (!fieldInput) throw new Error('Field must have a form-input element');
    
    msgEl.innerHTML = errorMsg;

    fieldInput.classList.add('invalid-field');
    fieldInput.addEventListener('input', () => {
        fieldInput.classList.remove('invalid-field');
        msgEl.innerHTML = '';
    });
}


/**
 * Clears the error messages from the form fields
 * @param {HTMLFormElement} form The form to clear the error messages from
 */
function clearFieldErrors(form){
    form.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('invalid-field');
    });
    form.querySelectorAll('.field-message').forEach(msgEl => {
        msgEl.innerHTML = '';
    });
}


/**
 * Checks if the email is valid 
 * @param {string} email The email to validate
 * @returns {boolean} true if the email is valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9\._]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
}


/**
 * Checks if the password is valid and sets custom validity message if not
 * @param {Element} passwordInput1 The first password input field
 * @param {Element} passwordInput2 The second password input field
 * @returns {boolean} true if the password is valid, false otherwise
 */
function validatePassword(passwordInput1, passwordInput2) { 
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+/;
    if (!specialChars.test(passwordInput1.value)) {
        formFieldHasError(passwordInput1.parentElement, 'Password must contain at least 1 special character');
        return false;
    }
    if (!/\d/.test(passwordInput1.value)) {
        formFieldHasError(passwordInput1.parentElement, 'Password must contain a number');
        return false;
    }
    if (/^\d$/.test(passwordInput1.value)) {
        formFieldHasError(passwordInput1.parentElement, 'Password cannot be all numbers');
        return false;
    }
    if (passwordInput1.value.length < 8) {
        formFieldHasError(passwordInput1.parentElement, 'Password must be at least 8 characters');
        return false;
    }
    if (passwordInput1.value !== passwordInput2.value) {
        formFieldHasError(passwordInput2.parentElement, 'Passwords do not match');
        return false;
    } 
    return true;
}


/**
 * Adds the `onPost` and `onResponse` functions to the form submit button
 * @param {HTMLButtonElement} formCardButton The submit button of the form
 * @param {string} onClickText The text to display on the button when clicked until the response is received(when `onResponse` is called)
 */
function addOnPostAndOnResponseFuncAttr(formCardButton, onClickText){
    let initialText = formCardButton.innerHTML;
    formCardButton.onPost = function(){
        this.disabled = true;
        this.innerHTML = onClickText;
    };

    formCardButton.onResponse = function(){
        this.disabled = false;
        this.innerHTML = initialText;
    };
}


/**
 * Shows a notification using Noty.js
 * @param {string} type The type of notification to show. Can be 'success', 'error', 'warning', 'info'
 * @param {string} text The text to display in the notification
 * @param {number} timeout The duration of the notification in milliseconds
 * @param {boolean} progressBar Whether to show the progress bar or not
 * @param {boolean} hoverPause Whether to pause the timeout when the notification is hovered over
 * @param {string} theme The theme to use for the notification. Available themes are 'mint', 'nest', 'relax', 'sunset', 'metroui', 'semanticui', 'bootstrap-v4'
 * @param {string} layout The layout to use for the notification
 * @param {string[]} closeWith The events that close the notification. Can be 'click', 'button', 'hover', 'backdrop'
 */
function pushNotification(
    type, 
    text, 
    timeout=3000, 
    progressBar=true,
    hoverPause=true,
    theme='semanticui', 
    layout='topRight', 
    closeWith=['click', 'button']
) {
    new Noty({
        type: type,
        text: text,
        timeout: timeout,
        progressBar: progressBar,
        closeWith: closeWith,
        theme: theme,
        layout: layout,
        killer: true,
        pauseOnHover: hoverPause
    }).show();
}


/**
 * Ensures that hyphens in all keys in the given object are changed to underscores
 * @param {object} obj object with possible hyphenated keys
 * @returns {object} The object with underscored keys
 */
function underScoreObjectKeys(obj){
    const newObj = {};
    for (let key in obj){
        newObj[key.replace('-', '_')] = obj[key];
    };
    return newObj;
};


