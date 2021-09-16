//On récupère l'id présent dans l'URL de la page
const id = new URL(document.location).searchParams.get("id");

function createProductPage() {
    fetch(`http://localhost:3000/api/teddies/${id}`)
    .catch(function(error) {    
        generateErrorMessage();
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(result) {
        console.log(result);
        associationInfoProduit(result);
    })
}createProductPage();

function generateErrorMessage() {
    const messageError = document.createElement('div');
    messageError.innerHTML = "<p>Une erreur est survenue, nous ne parvenons pas à accéder au produit demandé. Assurez-vous que le serveur est bien lancé sur le port 3000.</p>";
    let elt = document.getElementById('main');
    elt.replaceChild(messageError, document.getElementById('content'));
    messageError.classList.add("error_message");
}

function associationInfoProduit(result) {
    const photo = document.getElementById('photo_produit');
    photo.setAttribute("src", result.imageUrl)

    const name = document.getElementById('name');
    name.innerHTML = result.name;

    const description = document.getElementById('description');
    description.innerText = result.description;

    const price = document.getElementById('price');
    price.innerText = "Prix : " + (result.price / 100) + " €";

    for(let i in result.colors) {
        const color = document.getElementById('color');
        const option = document.createElement('option');
        option.setAttribute("value", result.colors[i]);
        option.innerText = result.colors[i];
        color.appendChild(option);
    }
}

const button = document.getElementById('button');
button.addEventListener('click', function() {
    let quantity = document.getElementById('qty').value;
    console.log('submit');
    console.log(id);
    console.log(quantity);
    if (quantity < 1 || quantity === undefined) {
        const error = document.createElement('p');
        error.classList.add("error_message");
        error.innerText = "Erreur ! La quantité indiquée n'est pas valide.";
        document.getElementById('option').appendChild(error);
        removeMessage(error);
    } else {
        let localQuantity = localStorage.getItem(id);
        if (localQuantity === null) {
            localStorage.setItem(id, quantity);
        } else {
            quantity = parseInt(quantity, 10) + parseInt(localQuantity, 10);
            localStorage.setItem(id, quantity);
        }
        const validation = document.createElement('p');
        validation.classList.add("validation");
        validation.innerText = "Votre panier à été mis à jour.";
        document.getElementById('option').appendChild(validation);
        removeMessage(validation);
    }
})

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