document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.cart').addEventListener('click', () => {
        window.location.href = '../src/catalog.html'
    })
    console.log('Rendering cart:', products)
})
