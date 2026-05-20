//Parte fija PokeAPI
const API = "https://pokeapi.co/api/v2";

 //función para hacer lista de pokemons

    async function ListarPokemons() {
        try{
            const res = await fetch(`${API}/pokemon?limit=151`)
            if (!res.ok) throw new Error(`Dato no encontrado (${res.status})`);
            const data = await res.json()
            const urls = data.results.map(pokemon => pokemon.url)
            const promesas = urls.map(async (url) => {
                const resPokemon = await fetch(url)
                const dataPokemon = await resPokemon.json()
                return dataPokemon
            }
            )
            const PokemonCompletos = await Promise.all(promesas)
            return PokemonCompletos

        }catch (error) {
    console.error("Error:", error.message);
    return null
    }
}

let pokemons = []
let pokemonsNormalizados = []
async function GetPokemons() {
    pokemons = await ListarPokemons()
    pokemonsNormalizados = NormalizarPokemon()
    renderizar(pokemonsNormalizados)
}


function renderizar(pokemons){
    const contenedor = document.getElementById("resultado"); 
    contenedor.innerHTML = pokemons.map(
        (pokemon) => `
        <article class= "card" id= "${pokemon.nombre}Tarjeta">
            <div class= "${pokemon.tipos[0]}">
                <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
                <div class: "card-content>
                    <h2>${pokemon.nombre}</h2>
                    <p>${pokemon.tipos.join(" · ")}</p>
                </div>
            </div>
        </article>
    `,
        )
        .join("");
}

GetPokemons()




    //funcion para Normalizar una array con los nombres de todos los pokemon y sus tipos
function NormalizarPokemon() {
    const resultado = pokemons.map(pokemon => ({id: pokemon.id, nombre: pokemon.name, tipos: pokemon.types.map(t => t.type.name), sprites: pokemon.sprites.front_default}))
    return resultado
}



//Funcion para filtrar pokemons por tipo
function filtrarpokemons(tipo) {
    const pokemons = NormalizarPokemon()
    const filtrado = pokemons.filter(p => p.Tipos.includes(tipo))
    return filtrado
}



const botonBuscar = document.getElementById("buscador-button")
const inputBuscar = document.getElementById("buscador-input")

botonBuscar.addEventListener("click", () => {
    const contenedor = document.getElementById("resultado");
    const pokemonBuscado = pokemonsNormalizados.find(pokemon => pokemon.nombre === inputBuscar.value)
    console.log(pokemonsNormalizados)
    console.log(pokemonBuscado)
    contenedor.innerHTML = 
        `
        <article class= "card" id= "${pokemonBuscado.nombre}Tarjeta">
            <div class= "${pokemonBuscado.tipos[0]}">
                <img src="${pokemonBuscado.sprites}" alt="${pokemonBuscado.nombre}">
                <div class: "card-content>
                    <h2>${pokemonBuscado.nombre}</h2>
                    <p>${pokemonBuscado.tipos.join(" · ")}</p>
                </div>
            </div>
        </article>
    `
})