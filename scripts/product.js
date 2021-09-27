//On récupère l'id présent dans l'URL de la page
const id = new URL(document.location).searchParams.get("id");

//Fonction principal qui va appeler les autres fonction qui permettent de créer le contenu de la page
function createProductPage() {
    fetch(`http://localhost:3000/api/teddies/${id}`)  //On fait un requete au serveur en utilisant l'id recupérer
    .catch(function(error) {
        generateErrorMessage();     //En cas d'erreur, on génère un message d'erreur
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();      //Sinon on renvoie le .json
        }
    })
    .then(function(result) {
        associationInfoProduit(result);     //On utilise les informations qu'on viens de récupérer pour créer le contenu de la page
    })
}createProductPage();

//Fonction qui génère le message d'erreur
function generateErrorMessage() {
    const messageError = document.createElement('div');
    messageError.innerHTML = "<p>Une erreur est survenue, nous ne parvenons pas à accéder au produit demandé. Assurez-vous que le serveur est bien lancé sur le port 3000.</p>";
    let elt = document.getElementById('main');
    elt.replaceChild(messageError, document.getElementById('content'));
    messageError.classList.add("error_message");
}

//Fonction qui utilise les information recupérées par le resuête fetch et les associe au différent éléments HTML de la page
function associationInfoProduit(result) {
    const photo = document.getElementById('photo_produit');     //Associe l'image du produit à la balise img de la page
    photo.setAttribute("src", result.imageUrl)

    const name = document.getElementById('name');       //Associe le nom du produit
    name.innerHTML = result.name;

    const description = document.getElementById('description');     //Associe la description du produit
    description.innerText = result.description;

    const price = document.getElementById('price');             //Associe le prix du produit
    price.innerText = "Prix : " + (result.price / 100) + " €";  //On divise le prix récupéré pour l'avoir sous le bon format

    for(let i in result.colors) {                           //Utilisation d'une boucle pour creer les différentes options de couleurs
        const color = document.getElementById('color');
        const option = document.createElement('option');
        option.setAttribute("value", result.colors[i]);
        option.innerText = result.colors[i];
        color.appendChild(option);
    }
}

const button = document.getElementById('button');
button.addEventListener('click', function() {                   //Evenement qui se déclenche lorsque l'utilisateur clique sur le bouton "ajouter au panier"
    let quantity = document.getElementById('qty').value;
    if (quantity < 1 || quantity === undefined) {               //On vérifie la quantité de produits saisi par l'utlisateur
        const error = document.createElement('p');              //Si elle est inférieur à 1 ou vide, alors on affiche un message d'erreur
        error.classList.add("error_message");
        error.innerText = "Erreur ! La quantité indiquée n'est pas valide.";
        document.getElementById('option').appendChild(error);
        removeMessage(error);       //On appelle une fonction qui supprime le message d'erreur
    } else {         //Lorsque la quantité saisie est valide           
        let localQuantity = localStorage.getItem(id);   //On recupère la quantité du produit enregistrer dans le local storage
        if (localQuantity === null) {       //Si cette quantité est null
            localStorage.setItem(id, quantity);     //Alors on ajoute l'identifiant du produit et la quantité saisie par l'utilisateur dans le local storage
        } else {            //Sinon au moins un exemplaire du produit est déja présent dans le local storage
            quantity = parseInt(quantity, 10) + parseInt(localQuantity, 10);    //On additionne la quantité saisie par l'utilisateur et celle déjà présente dans le local storage
            localStorage.setItem(id, quantity);     //On met à jour le local storage avec cette nouvelle quantité
        }
        const validation = document.createElement('p');             //On affiche un message indiquant que le panier à bien été mis à jour
        validation.classList.add("validation");
        validation.innerText = "Votre panier à été mis à jour.";
        document.getElementById('option').appendChild(validation);
        removeMessage(validation);      //On appelle la fonction qui vas supprimer le message de validation
    }
})

//Fonction qui supprime le message passé en paramètre avec une animation
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