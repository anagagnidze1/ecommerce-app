var min_length = 8;
var uppercase = /[A-Z]/;
var lowercase = /[a-z]/;
var number = /[0-9]/;
var mail = /^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/;
var vis = document.querySelector('.checkbox');

function login(email, password) {
    var answ = {
        email: true,
        password: true,
        passwordMessage: '',
        emailMessage: '',
    };
    if (!mail.test(email)) {
        answ.emailMessage =
            'Email address must be properly formatted (e.g., user@example.com).';
        answ.email = false;
    } else if (email[0] === ' ' || email[email.length - 1] === ' ') {
        answ.emailMessage =
            'Email must not contain leading or trailing whitespace';
        answ.email = false;
    }
    if (password.length < min_length) {
        answ.passwordMessage = 'Password must be at least 8 characters long';
        answ.password = false;
    } else if (!uppercase.test(password)) {
        answ.passwordMessage =
            'Password must contain at least one uppercase letter';
        answ.password = false;
    } else if (!lowercase.test(password)) {
        answ.passwordMessage =
            'Password must contain at least one lowercase letter';
        answ.password = false;
    } else if (!number.test(password)) {
        answ.passwordMessage = 'Password must contain at least one number';
        answ.password = false;
    } else if (password[0] === ' ' || password[password.length - 1] === ' ') {
        answ.passwordMessage =
            'Password must not contain leading or trailing whitespace';
        answ.password = false;
    }
    return answ;
}

function errorEmail(form, email, password, answ) {
    if (email) {
        email.style.border = '1px solid red';
        document.querySelector('.emailMessage').innerHTML = answ.emailMessage;
        document.querySelector('.emailMessage').style.display = 'block';
        password.blur();
        email.blur();
        form.reset();
    }
}

function errorPassword(form, email, password, answ) {
    if (password) {
        password.style.border = '1px solid red';
        document.querySelector('.passwordMessage').innerHTML = answ.passwordMessage;
        document.querySelector('.passwordMessage').style.display = 'block';
        password.blur();
        email.blur();
        form.reset();
    }
}

function storeUserDetails(userDetails) {
    localStorage.setItem('user', JSON.stringify(userDetails));
}



document.addEventListener('DOMContentLoaded', function () {

    vis.addEventListener('change', function () {
        var passwordField = document.querySelector('#password');
        if (vis.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    var form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var emailField = document.querySelector('#email');
        var passwordField = document.querySelector('#password');
        var email = emailField.value;
        var password = passwordField.value;
        var answer = login(email, password);

        console.log("email");
        console.log("password");

        if (!answer.password && !answer.email) {
            errorEmail(form, emailField, passwordField, answer);
            errorPassword(form, emailField, passwordField, answer);
        } else if (!answer.password) {
            var mes = document.querySelector('.emailMessage');
            mes.innerHTML = '';
            emailField.style.border = '1px solid #ccc';
            errorPassword(form, emailField, passwordField, answer);
        } else if (!answer.email) {
            var mes = document.querySelector('.passwordMessage');
            mes.innerHTML = '';
            passwordField.style.border = '1px solid #ccc';
            errorEmail(form, emailField, passwordField, answer);
        } else {
            passwordField.style.border = '1px solid #ccc';
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer bYfdpj5qLeUf-08qk8JEPrJ1CaW3fDFP");

        const raw = JSON.stringify({
        "email": email,
        "password": password,
        
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        fetch("https://api.europe-west1.gcp.commercetools.com/rsproject/login", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to login: ${response.status}`);
            }
            return response.text();
        })
        .then((result) => {
            const parsedResult = JSON.parse(result);
            console.log(parsedResult);


            const customerId = parsedResult.customer.id;
            console.log("Customer id: " + customerId);

            localStorage.setItem('customerId', customerId);

            window.location.href = "index.html";
        })
        .catch((error) => console.error('Error during login:', error));
    
    });
});