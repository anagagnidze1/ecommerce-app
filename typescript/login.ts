const min_length: number = 8
const uppercase: RegExp = /[A-Z]/
const lowercase: RegExp = /[a-z]/
const number: RegExp = /[0-9]/
const mail: RegExp = /^[a-zA-Z0-9]+@[a-z]+\.com/
const vis = document.querySelector('.checkbox') as HTMLInputElement

interface answer {
    email: boolean
    password: boolean
    passwordMessage: string
    emailMessage: string
}

function login(email: string, password: string): answer {
    const answ: answer = {
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

function errorEmail(
    form: HTMLFormElement,
    email: HTMLInputElement,
    password: HTMLInputElement,
    answ: answer
) {
    email.style.border = '1px solid red'
    ;(document.querySelector('.emailMessage') as HTMLElement).innerHTML =
        answ.emailMessage
    ;(document.querySelector('.emailMessage') as HTMLElement).style.display =
        'block'
    password.blur()
    email.blur()
    form.reset()
}

function errorPassword(
    form: HTMLFormElement,
    email: HTMLInputElement,
    password: HTMLInputElement,
    answ: answer
) {
    password.style.border = '1px solid red'
    ;(document.querySelector('.passwordMessage') as HTMLElement).innerHTML =
        answ.passwordMessage
    ;(document.querySelector('.passwordMessage') as HTMLElement).style.display =
        'block'
    password.blur()
    email.blur()
    form.reset()
}

document.addEventListener('DOMContentLoaded', () => {
    // visibility of password
    vis.addEventListener('change', () => {
        if (vis.checked) {
            ;(document.querySelector('#password') as HTMLInputElement).type =
                'text'
        } else {
            ;(document.querySelector('#password') as HTMLInputElement).type =
                'password'
        }
    })

    const form = document.querySelector('form') as HTMLFormElement
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const email = document.querySelector('#email') as HTMLInputElement
        const password = document.querySelector('#password') as HTMLInputElement
        const answer = login(email.value, password.value)
        if (!answer.password && !answer.email) {
            errorEmail(form, email, password, answer)
            errorPassword(form, email, password, answer)
        } else if (!answer.password) {
            const mes = document.querySelector(
                '.emailMessage'
            ) as HTMLDivElement
            mes.innerHTML = ''
            email.style.border = '1px solid #ccc'
            errorPassword(form, email, password, answer)
        } else if (!answer.email) {
            const mes = document.querySelector(
                '.passwordMessage'
            ) as HTMLDivElement
            mes.innerHTML = ''
            password.style.border = '1px solid #ccc'
            errorEmail(form, email, password, answer)
        } else {
            password.style.border = '1px solid #ccc'
            form.submit()
        }
    })
})
