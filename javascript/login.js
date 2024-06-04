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

document.addEventListener('DOMContentLoaded', function () {
    // Visibility of password
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
        myHeaders.append("Authorization", "Basic ZWNBMlpGaF9JUHp2ekYweDVzSDNEczV6Omp4bkxJWlFVRHRaVEp6UG96V1EyYVdQTkE1Ync0a3Uy");

        const raw = "";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://auth.europe-west1.gcp.commercetools.com/oauth/rsproject/customers/token?grant_type=password&username=" + email + "&password=" + password, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            
            console.log("Response object:", response.json());
            console.log("Access token retrieved successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error retrieving access token:", error);
        });
    });
});
