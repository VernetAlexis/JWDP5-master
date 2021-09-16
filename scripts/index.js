function getProducts() {
    fetch("http://localhost:3000/api/teddies")
        .catch(function(error) {                //En cas d'erreur
            generateErrorMessage()              //Appeler la fonction qui vas générer un message
        })
        .then(function(res) {
            if (res.ok) {                       //Si il n'y a pas d'erreur
                return res.json();              //Retourner le .json
            }
        })
        .then(function(produits) {
            attributeProductInfo(produits);     //Appeler la fonction qui vas générer les cartes pour chaque produits
        })
}getProducts();


//fonction qui crée le message d'erreur
function generateErrorMessage() {
    const messageError = document.createElement('div');
    messageError.innerHTML = "<p>Une erreur est survenue, nous ne pouvons pas afficher nos produits. Assurez-vous que le serveur est bien lancé sur le port 3000.</p>";
    let elt = document.getElementById('main');
    elt.replaceChild(messageError, document.getElementById('product_container'));
    messageError.classList.add("error_message");
}


//fonction qui crée une carte pour chaque produits
function attributeProductInfo(produits) {
    for (let i in produits) {       //Pour chaque produits
        //Création du liens vers la page de produit
        let container = document.getElementById('product_container');
        const productLink = document.createElement('a');
        container.appendChild(productLink);
        productLink.href = `product.html?id=${produits[i]._id}`;

        //Création d'un article qui vas contenir toutes les infos
        const product = document.createElement('article');
        product.classList.add('product');
        productLink.appendChild(product);

        //Ajout de l'image importer depuis l'API
        const productImage = document.createElement('img');
        product.appendChild(productImage);
        productImage.setAttribute("src", produits[i].imageUrl);

        //Création d'une div qui vas contenir le nom et le prix du produit
        const productContent = document.createElement('div');
        product.appendChild(productContent);
        productContent.classList.add('product_content');

        //Ajout du nom du produit
        const productName = document.createElement('h2');
        productContent.appendChild(productName);
        productName.innerText = produits[i].name;

        //Ajout du prix du produit
        const price = document.createElement('p');
        productContent.appendChild(price);
        const priceFormat = produits[i].price / 100;
        price.innerText = priceFormat + " €";
    }
}