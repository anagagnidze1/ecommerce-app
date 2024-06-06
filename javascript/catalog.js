async function fetchAccessToken() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ZWNBMlpGaF9JUHp2ekYweDVzSDNEczV6Omp4bkxJWlFVRHRaVEp6UG96V1EyYVdQTkE1Ync0a3Uy");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials", requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch access token: ${response.status}`);
        }
        const result = await response.json();
        console.log("Token response received " + result.access_token);
        return result.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
}

async function fetchProductsAndDiscounts() {
    try {
        const accessToken = await fetchAccessToken();
        const newToken = "Bearer " + accessToken;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", newToken);

        const productRequestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        const discountRequestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        const [productResponse, discountResponse] = await Promise.all([
            fetch("https://api.europe-west1.gcp.commercetools.com/rsproject/products", productRequestOptions),
            fetch("https://api.europe-west1.gcp.commercetools.com/rsproject/discount-codes", discountRequestOptions)
        ]);

        if (!productResponse.ok) {
            throw new Error(`HTTP error! status: ${productResponse.status}`);
        }
        if (!discountResponse.ok) {
            throw new Error(`HTTP error! status: ${discountResponse.status}`);
        }

        const productData = await productResponse.json();
        const discountData = await discountResponse.json();

        console.log('Products fetched:', productData);
        console.log('Discounts fetched:', discountData);

        const discounts = discountData.results;
        const products = productData.results.slice(0, 20);

        applyDiscountsAndRender(products, discounts);
    } catch (error) {
        console.error('Error fetching products or discounts:', error);
    }
}

function applyDiscountsAndRender(products, discounts) {
    products.forEach(product => {
        const currentData = product.masterData.current;
        const priceObject = currentData.masterVariant.prices.find(price => price.value.currencyCode === 'USD');
        if (priceObject) {
            const originalPrice = priceObject.value.centAmount / 100;
            const discount = discounts.find(discount => discount.code === 'BOGO'); // Example: apply BOGO discount if available
            if (discount) {
                const discountedPrice = originalPrice / 2; // Example: 50% off
                priceObject.discountedPrice = discountedPrice.toFixed(2);
            } else {
                priceObject.discountedPrice = null;
            }
            priceObject.originalPrice = originalPrice.toFixed(2);
        }
    });

    renderProductCards(products);
}

function renderProductCards(products) {
    console.log('Rendering products:', products);
    const container = document.getElementById('product-container');
    if (!container) {
        console.error('Product container not found');
        return;
    }

    container.innerHTML = '';

    products.forEach(product => {
        const currentData = product.masterData.current;
        const name = currentData.name['en-US'] || "No Name";
        const description = currentData.description['en-US'] || "No Description";
        const priceObject = currentData.masterVariant.prices.find(price => price.value.currencyCode === 'USD');
        const price = priceObject ? priceObject.originalPrice : 'N/A';
        const discountedPrice = priceObject && priceObject.discountedPrice ? priceObject.discountedPrice : null;
        const imageUrl = currentData.masterVariant.images[0] ? currentData.masterVariant.images[0].url : 'placeholder.jpg';

        console.log(`Name: ${name}, Description: ${description}, Price: ${price}, Discounted Price: ${discountedPrice}, Image: ${imageUrl}`);

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
        <img src="${imageUrl}" alt="${name}" onclick="openModal('${imageUrl}')"/>
            <h3>${name}</h3>
            <div class="description-container">${description}</div>
            <p class="price">Price: $${price}</p>
            ${discountedPrice ? `<p class="discounted-price">Discounted Price: $${discountedPrice}</p>` : ''}
        `;
        container.appendChild(productCard);
    });
}

fetchProductsAndDiscounts();

function openModal(imageSrc) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
  }
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
}
const closeBtn = document.getElementsByClassName('close')[0];
closeBtn.onclick = function() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}