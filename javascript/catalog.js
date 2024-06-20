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
            )
            if (discount) {
                const discountedPrice = originalPrice / 2
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
        const productId = product.id;
        productCard.setAttribute('data-product-id', productId);
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


            const detailedView = document.querySelector('.detailed-product');
            detailedView.setAttribute('detailed-data-product-id', productId);

            document.querySelector('.product-container').style.display = 'none'
            document.querySelector('.detailed-product').style.display = 'flex'
        })
        container.appendChild(productCard)
    })
}


function getCustomerId() {

    const customerId = localStorage.getItem('customerId');
    

    if (customerId) {
        console.log("Retrieved customerId:", customerId);
        return customerId;
    } else {
        console.log("No customerId found in localStorage.");
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProductsAndDiscounts()
    document.querySelector('.back').addEventListener('click', () => {
        document.querySelector('.product-container').style.display = 'flex'
        document.querySelector('.detailed-product').style.display = 'none'
    })
})


document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.getElementById('add-to-cart');

    addToCartButton.addEventListener('click', async () => {

        const accessToken = await  fetchAccessToken()
        const newToken = 'Bearer ' + accessToken
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", newToken);


        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };



        var userId = getCustomerId();
        console.log("user-id:" + userId);
        if (userId !== null) {
            fetch(`https://api.europe-west1.gcp.commercetools.com/rsproject/carts/customer-id=${userId}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }else if (response.status === 404) {
                        const cartId = localStorage.getItem('cartId');
                        console.log("cartId from LS: " + cartId)
                        if(cartId == null){
                            const raw = JSON.stringify({
                                "currency": "EUR"
                              });
                              
                              const requestOptions = {
                                method: "POST",
                                headers: myHeaders,
                                body: raw,
                                redirect: "follow"
                              };
                              
                              fetch("https://api.europe-west1.gcp.commercetools.com/rsproject/carts", requestOptions)
                                .then((response) => response.text())
                                .then((result) =>{
                                    console.log(result);
                                    const parsedResult = JSON.parse(result);
                                    console.log(parsedResult);
    
                                    const cartId = parsedResult.id;
                                    console.log("Cart id: " + cartId);
    
                                    localStorage.setItem('cartId', cartId);
    
                                })
                                .catch((error) => console.error(error));
                        }


                    }  else {
                        throw new Error('Failed to fetch cart data');
                    }
                })
                .then(data => {
                    console.log('Cart data:', data);
                })
                .catch(error => {
                    console.error('Error fetching cart data:', error);
                });
        } else {
            console.log("User ID is null, cannot make API request.");
        }
    });
});
   
