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

