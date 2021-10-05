function confirmation() {
    let price = document.getElementById('price');
    let id = document.getElementById('id');

    price.innerText = localStorage.getItem('totalPrice')    //On récupère le prix total dans le localstorage et on l'intègre à la page
    id.innerText = localStorage.getItem('orderId')      //On récupère l'id de commande dans le localstorage et on l'intègre à la page

    localStorage.removeItem('cart')
    localStorage.removeItem('totalPrice')       //On vide le localstorage
    localStorage.removeItem('orderId')
}confirmation()