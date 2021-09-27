let stockage = localStorage;
let totalOrderPrice = 0;

function verificationPanier() {
    if (stockage.length == 0) {     //Si le localstorage est vide
        generateErrorMessage();     //On affiche un message d'erreur
    } else {        //Sinon
        for (let i = 0; i < stockage.length; i++) {     //Pour chaque élément du localstorage
            let key = stockage.key(i);                  //On récupère la key qui correspond à l'id du produit
            let value = stockage.getItem(key);          //On récupère la valeur lié à la key, c'est à dire la quantité
            fetch(`http://localhost:3000/api/teddies/${key}`)   //On fait une requête au serveur avec la key récupéré
            .then(function(res) {
                if(res.ok) {
                    return res.json();
                } else {
                    stockage.removeItem(key)
                }
            })
            .then(function(result) {
                createOrderResume (result, value);  //On appelle la fonction qui vas créer le resumer de la commande
            })
        }
    }
}verificationPanier()

//Fonction qui crée le resumer de la commande grâce aux informations recupérées par la requête fetch et à la quantité recupéré dans le localstorage
function createOrderResume(result, value) {
    const orderResume = document.getElementById('order_resume');
    const orderProduct = document.createElement('article')
    orderProduct.classList.add("order_product");
    orderResume.appendChild(orderProduct);

    const photo = document.createElement('img');
    photo.classList.add("order_product__photo");
    photo.setAttribute("src", result.imageUrl);
    orderProduct.appendChild(photo);

    const name = document.createElement('h2');
    name.classList.add("order_product__name");
    name.innerText = result.name;
    orderProduct.appendChild(name);

    const quantity = document.createElement('p');
    quantity.classList.add("order_product__quantity");
    quantity.innerText = value;
    orderProduct.appendChild(quantity);

    const unitPrice = document.createElement('p');
    unitPrice.classList.add("order_product__unitprice");
    unitPrice.innerText = (result.price / 100) + " €";
    orderProduct.appendChild(unitPrice);

    const totalPrice = document.createElement('p');
    totalPrice.classList.add("order_product__totalprice");
    totalPrice.innerText = value * (result.price / 100) + " €";     //Calcul du prix de chaque produit en foction de la quantité dans le panier
    orderProduct.appendChild(totalPrice);

    totalOrderPrice = totalOrderPrice + (value * (result.price / 100));     //Calcul du prix total de la commande
    let total = document.getElementById('total_order_price');
    total.innerText = totalOrderPrice;
}

//Fonction qui génère le message d'erreur
function generateErrorMessage() {
    const messageError = document.createElement('div');
    messageError.innerHTML = "<p>Votre panier est vide.</p>";
    let elt = document.getElementById('cart_main');
    elt.parentNode.replaceChild(messageError, elt);
    messageError.classList.add("error_message");
}

const button = document.getElementById('order_button');
button.addEventListener('click', function(e) {      //Lorsque l'utilisateur clique sur le bouton pour passer commande
    if (!document.getElementById('order_form').checkValidity()) {   //On vérifie la validité du formulaire de commande, Si il n'est pas valide
        const formError = document.createElement('div');            //On affiche un message d'erreur
        formError.innerHTML = "<p>Merci de compléter toutes les informations demandées.</p>";
        let form = document.getElementById('order_form');
        form.appendChild(formError);
        formError.classList.add("error_message");
        removeMessage(formError);   //On supprime le message d'erreur
    } else {        //Sinon le formualire est valide
        const order = {         //On crée un objet qui vas contenir toutes les informations saisies dans le formulaires
            contact: {
                firstName: document.getElementById('first_name').value,
                lastName: document.getElementById('last_name').value,
                address: document.getElementById('adress').value,
                city: document.getElementById('city').value,
                email: document.getElementById('email').value
            },
            products: []        //Ainsi qu'un array
        }
        for (let i = 0; i < stockage.length; i++) {     //Pour chaque élément dans le localstorage
            order.products.push(stockage.key(i))        //On ajoute la key, c'est à dire l'id de produit dans l'array
        }
        fetch("http://localhost:3000/api/teddies/order", {      //On envoie une requête au serveur
            method: "POST",                                     
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)         //On envoie l'objet order sous format json
        })
        .then(function(res) {
            return res.json();      //On recupère la réponse du serveur au format json
        })
        .then(function(data) {
            stockage.setItem('orderId', data.orderId)       //On stock dans le localstorage l'id de commande que la serveur nous à retourner
            const totalPrice = document.getElementById('total_order_price').innerText;  //On recupère le prix total de la commande
            stockage.setItem('totalPrice', totalPrice);     //On envoie le prix total dans le localstorage
            document.location.href = "confirmation.html"    //On redirige l'utilisateur sur la page de confirmation
        })
        .catch(function(error) {
            console.log(error)     //En cas d'erreur, on génère un message d'erreur
        })
    }
})

//fonction qui supprime un message avec une animation
function removeMessage(message) {
    message.style.transition = "opacity 1000ms";
    message.style.opacity = 0;
    message.offsetWidth;
    message.style.opacity = 1;
    setTimeout(function() {
        message.style.opacity = 0;
    }, 2000);
    message.offsetWidth;
    setTimeout(function() {
        message.parentNode.removeChild(message);
    }, 3000);
}