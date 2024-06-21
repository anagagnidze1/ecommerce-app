async function fetchAccessToken() {
    const myHeaders = new Headers()
    myHeaders.append(
        'Authorization',
        'Basic ZWNBMlpGaF9JUHp2ekYweDVzSDNEczV6Omp4bkxJWlFVRHRaVEp6UG96V1EyYVdQTkE1Ync0a3Uy'
    )

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    }

    try {
        const response = await fetch(
            'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials',
            requestOptions
        )
        if (!response.ok) {
            throw new Error(`Failed to fetch access token: ${response.status}`)
        }
        const result = await response.json()
        console.log('Token response received ' + result.access_token)
        return result.access_token
    } catch (error) {
        console.error('Error fetching access token:', error)
        throw error
    }
}

async function fetchProductsAndDiscounts() {
    try {
        const accessToken = await fetchAccessToken()
        const newToken = 'Bearer ' + accessToken

        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', newToken)

        const productRequestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
        }

        const discountRequestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
        }

        const [productResponse, discountResponse] = await Promise.all([
            fetch(
                'https://api.europe-west1.gcp.commercetools.com/rsproject/products',
                productRequestOptions
            ),
            fetch(
                'https://api.europe-west1.gcp.commercetools.com/rsproject/discount-codes',
                discountRequestOptions
            ),
        ])

        if (!productResponse.ok) {
            throw new Error(`HTTP error! status: ${productResponse.status}`)
        }
        if (!discountResponse.ok) {
            throw new Error(`HTTP error! status: ${discountResponse.status}`)
        }

        const productData = await productResponse.json()
        const discountData = await discountResponse.json()

        console.log('Products fetched:', productData)
        console.log('Discounts fetched:', discountData)

        const discounts = discountData.results
        const products = productData.results.slice(0, 20)

        applyDiscountsAndRender(products, discounts)
    } catch (error) {
        console.error('Error fetching products or discounts:', error)
    }
}

function applyDiscountsAndRender(products, discounts) {
    products.forEach((product) => {
        const currentData = product.masterData.current
        const priceObject = currentData.masterVariant.prices.find(
            (price) => price.value.currencyCode === 'USD'
        )
        if (priceObject) {
            const originalPrice = priceObject.value.centAmount / 100
            const discount = discounts.find(
                (discount) => discount.code === 'BOGO'
            ) // Example: apply BOGO discount if available
            if (discount) {
                const discountedPrice = originalPrice / 2 // Example: 50% off
                priceObject.discountedPrice = discountedPrice.toFixed(2)
            } else {
                priceObject.discountedPrice = null
            }
            priceObject.originalPrice = originalPrice.toFixed(2)
        }
    })

    renderProductCards(products)
}

let id = 1
let cartId = 'd'
const cartItems = []

function renderProductCards(products) {
    console.log('Rendering products:', products)
    const container = document.getElementById('product-container')
    if (!container) {
        console.error('Product container not found')
        return
    }

    container.innerHTML = ''

    products.forEach((product) => {
        const currentData = product.masterData.current
        const name = currentData.name['en-US'] || 'No Name'
        const description = currentData.description['en-US'] || 'No Description'
        const priceObject = currentData.masterVariant.prices.find(
            (price) => price.value.currencyCode === 'USD'
        )
        const price = priceObject ? priceObject.originalPrice : 'N/A'
        const discountedPrice =
            priceObject && priceObject.discountedPrice
                ? priceObject.discountedPrice
                : null
        const imageUrl = currentData.masterVariant.images[0]
            ? currentData.masterVariant.images[0].url
            : 'placeholder.jpg'

        const productCard = document.createElement('div')
        productCard.className = 'product-card'
        productCard.id = id
        id++
        productCard.innerHTML = `
            <img src="${imageUrl}" alt="${name}" />
            <h3>${name}</h3>
            <div class="description-container">${description}</div>
            <p class="price">Price: $${price}</p>
            ${discountedPrice ? `<p class="discounted-price">Discounted Price: $${discountedPrice}</p>` : ''}
        `
        productCard.addEventListener('click', () => {
            document.querySelector('.D-name').innerHTML = name
            document.querySelector('.image').src = `${imageUrl}`
            document.querySelector('.D-price').innerHTML =
                `Price: ${price} <span class='D-discount'>Discount: ${discountedPrice}</span>`
            document.querySelector('.D-description').innerHTML = description
            document.querySelector('.product-container').style.display = 'none'
            document.querySelector('.detailed-product').style.display = 'flex'
            document.querySelector('.add').addEventListener('click', () => {
                createCart(cartId, product)
            })
        })
        container.appendChild(productCard)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProductsAndDiscounts()
    document.querySelector('.back').addEventListener('click', () => {
        document.querySelector('.product-container').style.display = 'flex'
        document.querySelector('.detailed-product').style.display = 'none'
    })
})

async function createCart(id, product) {
    cartItems.push(product)
    console.log(cartItems)
    const firstRequestHeaders = new Headers()
    firstRequestHeaders.append(
        'Authorization',
        'Bearer bYfdpj5qLeUf-08qk8JEPrJ1CaW3fDFP'
    )

    const firstRequestOptions = {
        method: 'GET',
        headers: firstRequestHeaders,
        redirect: 'follow',
    }
    const firstResponse = await fetch(
        `https://api.europe-west1.gcp.commercetools.com/rsproject/carts/${id}`,
        firstRequestOptions
    )
    if (firstResponse.status === 404) {
        const secondRequestHeaders = new Headers()
        secondRequestHeaders.append('Content-Type', 'application/json')
        secondRequestHeaders.append(
            'Authorization',
            'Bearer bYfdpj5qLeUf-08qk8JEPrJ1CaW3fDFP'
        )

        const raw = JSON.stringify({
            currency: 'EUR',
        })

        const secondRequestOptions = {
            method: 'POST',
            headers: secondRequestHeaders,
            body: raw,
            redirect: 'follow',
        }

        const secondResponse = await fetch(
            'https://api.europe-west1.gcp.commercetools.com/rsproject/carts',
            secondRequestOptions
        )

        const secondResult = await secondResponse.json()
        cartId = secondResult.id
        console.log(secondResult.id)
    } else {
        console.log('else')
        const firstResult = await firstResponse.json()
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append(
            'Authorization',
            'Bearer bYfdpj5qLeUf-08qk8JEPrJ1CaW3fDFP'
        )

        const raw = JSON.stringify({
            version: firstResult.version,
            actions: [
                {
                    action: 'addLineItem',
                    productId: product.id,
                    variantId: product.lastVariantId,
                    quantity: 1,
                },
            ],
        })

        const thirdRequestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }

        const thirdResponse = await fetch(
            `https://api.europe-west1.gcp.commercetools.com/rsproject/carts/${id}`,
            thirdRequestOptions
        )

        const thirdResult = await thirdResponse.json()
        console.log(thirdResult.message)
        console.log(firstResult.lineItems)
    }
}

module.exports = { cartItems }
