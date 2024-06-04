const min: number = 8
const upper: RegExp = /[A-Z]/
const lower: RegExp = /[a-z]/
const num: RegExp = /[0-9]/
const email: RegExp = /^[a-zA-Z0-9]+@[a-z]+\.com/
const specialCharacters: RegExp = /[!@#$%^&*(),\.?":{}|<>]/
const messages: HTMLDivElement[] = Array.from(
    document.querySelectorAll('.message')
)

const countries: string[] = [
    'afghanistan',
    'albania',
    'algeria',
    'andorra',
    'angola',
    'antigua and barbuda',
    'argentina',
    'armenia',
    'australia',
    'austria',
    'azerbaijan',
    'bahamas',
    'bahrain',
    'bangladesh',
    'barbados',
    'belarus',
    'belgium',
    'belize',
    'benin',
    'bhutan',
    'bolivia',
    'bosnia and herzegovina',
    'botswana',
    'brazil',
    'brunei',
    'bulgaria',
    'burkina faso',
    'burundi',
    'cabo verde',
    'cambodia',
    'cameroon',
    'canada',
    'central african republic',
    'chad',
    'chile',
    'china',
    'colombia',
    'comoros',
    'congo (congo-brazzaville)',
    'costa rica',
    'croatia',
    'cuba',
    'cyprus',
    'czechia (czech republic)',
    'denmark',
    'djibouti',
    'dominica',
    'dominican republic',
    'ecuador',
    'egypt',
    'el salvador',
    'equatorial guinea',
    'eritrea',
    'estonia',
    'eswatini (fmr. swaziland)',
    'ethiopia',
    'fiji',
    'finland',
    'france',
    'gabon',
    'gambia',
    'georgia',
    'germany',
    'ghana',
    'greece',
    'grenada',
    'guatemala',
    'guinea',
    'guinea-bissau',
    'guyana',
    'haiti',
    'honduras',
    'hungary',
    'iceland',
    'india',
    'indonesia',
    'iran',
    'iraq',
    'ireland',
    'israel',
    'italy',
    'jamaica',
    'japan',
    'jordan',
    'kazakhstan',
    'kenya',
    'kiribati',
    'kuwait',
    'kyrgyzstan',
    'laos',
    'latvia',
    'lebanon',
    'lesotho',
    'liberia',
    'libya',
    'liechtenstein',
    'lithuania',
    'luxembourg',
    'madagascar',
    'malawi',
    'malaysia',
    'maldives',
    'mali',
    'malta',
    'marshall islands',
    'mauritania',
    'mauritius',
    'mexico',
    'micronesia',
    'moldova',
    'monaco',
    'mongolia',
    'montenegro',
    'morocco',
    'mozambique',
    'myanmar (formerly burma)',
    'namibia',
    'nauru',
    'nepal',
    'netherlands',
    'new zealand',
    'nicaragua',
    'niger',
    'nigeria',
    'north korea',
    'north macedonia',
    'norway',
    'oman',
    'pakistan',
    'palau',
    'palestine state',
    'panama',
    'papua new guinea',
    'paraguay',
    'peru',
    'philippines',
    'poland',
    'portugal',
    'qatar',
    'romania',
    'russia',
    'rwanda',
    'saint kitts and nevis',
    'saint lucia',
    'saint vincent and the grenadines',
    'samoa',
    'san marino',
    'sao tome and principe',
    'saudi arabia',
    'senegal',
    'serbia',
    'seychelles',
    'sierra leone',
    'singapore',
    'slovakia',
    'slovenia',
    'solomon islands',
    'somalia',
    'south africa',
    'south korea',
    'south sudan',
    'spain',
    'sri lanka',
    'sudan',
    'suriname',
    'sweden',
    'switzerland',
    'syria',
    'taiwan',
    'tajikistan',
    'tanzania',
    'thailand',
    'timor-leste',
    'togo',
    'tonga',
    'trinidad and tobago',
    'tunisia',
    'turkey',
    'turkmenistan',
    'tuvalu',
    'uganda',
    'ukraine',
    'united arab emirates',
    'united kingdom',
    'united states of america',
    'uruguay',
    'uzbekistan',
    'vanuatu',
    'vatican city',
    'venezuela',
    'vietnam',
    'yemen',
    'zambia',
    'zimbabwe',
]

interface firstHalf {
    first: boolean
    last: boolean
    mail: boolean
    password: boolean
    passwordMessage: string
}

interface secondHalf {
    date: boolean
    country: boolean
    city: boolean
    street: boolean
    code: boolean
}

function checkOne(
    first: string,
    last: string,
    mail: string,
    password: string
): firstHalf {
    const answ: firstHalf = {
        first: true,
        last: true,
        mail: true,
        password: true,
        passwordMessage: '',
    }

    if (!email.test(mail)) {
        answ.mail = false
    }

    if (password.length < min) {
        answ.passwordMessage = 'Password must be at least 8 characters long'
        answ.password = false
    } else if (!upper.test(password)) {
        answ.passwordMessage =
            'Password must contain at least one uppercase letter'
        answ.password = false
    } else if (!lower.test(password)) {
        answ.passwordMessage =
            'Password must contain at least one lowercase letter'
        answ.password = false
    } else if (!num.test(password)) {
        answ.passwordMessage = 'Password must contain at least one number'
        answ.password = false
    } else if (password[0] === ' ' || password[password.length - 1] === ' ') {
        answ.passwordMessage =
            'Password must not contain leading or trailing whitespace'
        answ.password = false
    }

    if (first.length <= 1 || specialCharacters.test(first) || num.test(first)) {
        answ.first = false
    }

    if (last.length <= 1 || specialCharacters.test(last) || num.test(last)) {
        answ.last = false
    }

    return answ
}

function checkTwo(
    date: number,
    country: string,
    city: string,
    street: string,
    code: string
): secondHalf {
    const answ: secondHalf = {
        date: true,
        country: true,
        city: true,
        street: true,
        code: true,
    }

    if (date <= 13) {
        answ.date = false
    }

    if (!countries.includes(country.toLowerCase())) {
        answ.country = false
    }

    if (city.length <= 1 || specialCharacters.test(city) || num.test(city)) {
        answ.city = false
    }

    if (street.length < 2) {
        answ.street = false
    }

    if (!/[1-5]+/.test(code) || !/^[1-9A-Z]+$/.test(code)) {
        answ.code = false
    }

    return answ
}
export function initializeRegistrationForm() {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('form') as HTMLFormElement
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const first = document.querySelector('#firstname') as HTMLInputElement
            const last = document.querySelector('#lastname') as HTMLInputElement
            const email = document.querySelector('#email') as HTMLInputElement
            const password = document.querySelector('#password') as HTMLInputElement
            const date = document.querySelector('#birthdate') as HTMLInputElement
            const country = document.querySelector('#country') as HTMLInputElement
            const city = document.querySelector('#city') as HTMLInputElement
            const street = document.querySelector('#street') as HTMLInputElement
            const code = document.querySelector('#code') as HTMLInputElement

            console.log(first);
            console.log(last);
            console.log(email);
            console.log(password);


            const today = new Date()
            let age = today.getFullYear() - new Date(date.value).getFullYear()
            const monthDiff = today.getMonth() - new Date(date.value).getMonth()
            const dayDiff = today.getDate() - new Date(date.value).getDate()

            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--
            }

            const firstHalf = checkOne(
                first.value,
                last.value,
                email.value,
                password.value
            )

            const secondHalf = checkTwo(
                age,
                country.value,
                city.value,
                street.value,
                code.value
            )

            if (!firstHalf.first) {
                messages[0].classList.remove('remove')
                first.style.border = '1px solid red'
            } else {
                first.style.border = '1px solid #ccc'
                messages[0].classList.add('remove')
            }

            if (!firstHalf.last) {
                messages[1].classList.remove('remove')
                last.style.border = '1px solid red'
            } else {
                last.style.border = '1px solid #ccc'
                messages[1].classList.add('remove')
            }

            if (!firstHalf.mail) {
                messages[2].classList.remove('remove')
                email.style.border = '1px solid red'
            } else {
                email.style.border = '1px solid #ccc'
                messages[2].classList.add('remove')
            }

            if (!firstHalf.password) {
                messages[3].innerHTML = `${firstHalf.passwordMessage}`
                messages[3].classList.remove('remove')
                password.style.border = '1px solid red'
            } else {
                password.style.border = '1px solid #ccc'
                messages[3].classList.add('remove')
            }

            if (!secondHalf.date) {
                messages[4].classList.remove('remove')
                date.style.border = '1px solid red'
            } else {
                date.style.border = '1px solid #ccc'
                messages[4].classList.add('remove')
            }

            if (!secondHalf.country) {
                messages[5].classList.remove('remove')
                country.style.border = '1px solid red'
            } else {
                country.style.border = '1px solid #ccc'
                messages[5].classList.add('remove')
            }

            if (!secondHalf.city) {
                messages[6].classList.remove('remove')
                city.style.border = '1px solid red'
            } else {
                city.style.border = '1px solid #ccc'
                messages[6].classList.add('remove')
            }

            if (!secondHalf.street) {
                messages[7].classList.remove('remove')
                street.style.border = '1px solid red'
            } else {
                street.style.border = '1px solid #ccc'
                messages[7].classList.add('remove')
            }

            if (!secondHalf.code) {
                messages[8].classList.remove('remove')
                code.style.border = '1px solid red'
            } else {
                code.style.border = '1px solid #ccc'
                messages[8].classList.add('remove')
            }

            if (Array.from(document.querySelectorAll('.remove')).length === 9) {
                form.submit()
                window.location.href = '../src/index.html'
            }

        })
    })
}
