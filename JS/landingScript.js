const pokedexBtn = document.querySelector("#landing-pokedex");
const itemsBtn = document.querySelector('#landing-objects');

//llevar a la pokedex al pulsar
pokedexBtn.addEventListener("click", () => {
    return window.location.href = "pokedex.html"
});


//llevar a objetos al pulsar
itemsBtn.addEventListener('click', () =>{
    return window.location.href = 'items.html'
});

//Incluir version en footer página
const versionText = document.querySelector(".appVersion")
versionText.textContent = `Versión ${window.VERSION_POKEPHONE}`