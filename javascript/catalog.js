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

async function fetchDataAndRender() {
    try {
        const accessToken = await fetchAccessToken();
        const newToken = "Bearer " + accessToken;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", newToken);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch("https://api.europe-west1.gcp.commercetools.com/rsproject/products", requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data fetched:', data);
        renderProductCards(data.results.slice(0, 20));
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

fetchDataAndRender();

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
        const price = priceObject ? (priceObject.value.centAmount / 100).toFixed(2) : 'N/A';
        const imageUrl = currentData.masterVariant.images[0] ? currentData.masterVariant.images[0].url : 'placeholder.jpg';

        console.log(`Name: ${name}, Description: ${description}, Price: ${price}, Image: ${imageUrl}`);

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${imageUrl}" alt="${name}" />
            <h3>${name}</h3>
            <div class="description-container">${description}</div>
            <p class="price">Price: $${price}</p>
        `;
        container.appendChild(productCard);
    });
}
