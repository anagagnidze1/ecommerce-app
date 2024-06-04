var min = 8
var upper = /[A-Z]/
var lower = /[a-z]/
var num = /[0-9]/
var email = /^[a-zA-Z0-9]+@[a-z]+\.com/
var specialCharacters = /[!@#$%^&*(),\.?":{}|<>]/
var messages = Array.from(document.querySelectorAll('.message'))
var countries = [
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
function checkOne(first, last, mail, password) {
    var answ = {
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
function checkTwo(date, country, city, street, code) {
    var answ = {
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
document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        var first = document.querySelector('#firstname')
        var firstName = document.querySelector('#firstname').value
        var last = document.querySelector('#lastname')
        var lastName = document.querySelector('#lastname').value
        var email = document.querySelector('#email')
        var emailValue = document.querySelector('#email').value
        var password = document.querySelector('#password')
        var passwordValue = document.querySelector('#password').value
        var date = document.querySelector('#birthdate')
        var country = document.querySelector('#country')
        var city = document.querySelector('#city')
        var street = document.querySelector('#street')
        var code = document.querySelector('#code')


        console.log(firstName);
        console.log(lastName);
        console.log(emailValue);
        console.log(passwordValue);
        console.log("Country value:", country);


        var today = new Date()
        var age = today.getFullYear() - new Date(date.value).getFullYear()
        var monthDiff = today.getMonth() - new Date(date.value).getMonth()
        var dayDiff = today.getDate() - new Date(date.value).getDate()
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--
        }
        var firstHalf = checkOne(
            first,
            last,
            email,
            password
        )
        var secondHalf = checkTwo(
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
            messages[3].innerHTML = ''.concat(firstHalf.passwordMessage)
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
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer FlB2-eSKWS57OCjq4OqYg27ZqXQ9T3Yu");

        console.log("Creating JSON...");

        const raw = JSON.stringify({
        "email": emailValue,
        "firstName": firstName,
        "lastName": lastName,
        "password": passwordValue
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        };

        fetch("https://api.europe-west1.gcp.commercetools.com/rsproject/customers", requestOptions)
        .then(async (response) => {
            if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            console.log("Customer created successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error creating customer:", error);
        });

    })
})
