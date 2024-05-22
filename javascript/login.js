var min_length = 8
var uppercase = /[A-Z]/
var lowercase = /[a-z]/
var number = /[0-9]/
var mail = /^[a-zA-Z0-9]+@[a-z]+\.com/
var vis = document.querySelector('.checkbox')
function login(email, password) {
    var answ = {
        email: true,
        password: true,
        passwordMessage: '',
        emailMessage: '',
    }
    if (!mail.test(email)) {
        answ.emailMessage =
            'Email address must be properly formatted (e.g., user@example.com).'
        answ.email = false
    } else if (email[0] === ' ' || email[email.length - 1] === ' ') {
        answ.emailMessage =
            'Email must not contain leading or trailing whitespace'
        answ.email = false
    }
    if (password.length < min_length) {
        answ.passwordMessage = 'Password must be at least 8 characters long'
        answ.password = false
    } else if (!uppercase.test(password)) {
        answ.passwordMessage =
            'Password must contain at least one uppercase letter'
        answ.password = false
    } else if (!lowercase.test(password)) {
        answ.passwordMessage =
            'Password must contain at least one lowercase letter'
        answ.password = false
    } else if (!number.test(password)) {
        answ.passwordMessage = 'Password must contain at least one number'
        answ.password = false
    } else if (password[0] === ' ' || password[password.length - 1] === ' ') {
        answ.passwordMessage =
            'Password must not contain leading or trailing whitespace'
        answ.password = false
    }
    return answ
}
function errorEmail(form, email, password, answ) {
    email.style.border = '1px solid red'
    document.querySelector('.emailMessage').innerHTML = answ.emailMessage
    document.querySelector('.emailMessage').style.display = 'block'
    password.blur()
    email.blur()
    form.reset()
}
function errorPassword(form, email, password, answ) {
    password.style.border = '1px solid red'
    document.querySelector('.passwordMessage').innerHTML = answ.passwordMessage
    document.querySelector('.passwordMessage').style.display = 'block'
    password.blur()
    email.blur()
    form.reset()
}
document.addEventListener('DOMContentLoaded', function () {
    // visibility of password
    vis.addEventListener('change', function () {
        if (vis.checked) {
            document.querySelector('#password').type = 'text'
        } else {
            document.querySelector('#password').type = 'password'
        }
    })
    var form = document.querySelector('form')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        var email = document.querySelector('#email')
        var password = document.querySelector('#password')
        var answer = login(email.value, password.value)
        if (!answer.password && !answer.email) {
            errorEmail(form, email, password, answer)
            errorPassword(form, email, password, answer)
        } else if (!answer.password) {
            var mes = document.querySelector('.emailMessage')
            mes.innerHTML = ''
            email.style.border = '1px solid #ccc'
            errorPassword(form, email, password, answer)
        } else if (!answer.email) {
            var mes = document.querySelector('.passwordMessage')
            mes.innerHTML = ''
            password.style.border = '1px solid #ccc'
            errorEmail(form, email, password, answer)
        } else {
            password.style.border = '1px solid #ccc'
            form.submit()
            window.location.href = '../src/index.html'
            document.querySelector('')
        }
    })
})
