//Parte fija PokeAPI
const API = "https://pokeapi.co/api/v2";

 //función para hacer lista de pokemons

    async function ListarPokemons() {
        try{
            const res = await fetch(`${API}/pokemon?limit=1000`)
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

    if (pokemons.length === 0) {
        contenedor.innerHTML = `<p class="no-results">No se encontraron Pokémon.</p>`;
        return;
    }

    contenedor.innerHTML = pokemons.map(
        (pokemon) => `
        <article class= "card" id= "${pokemon.nombre}Tarjeta">
            <div class= "${pokemon.tipos[0]}">
                <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
                <div class = "card-content">
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
    if (tipo === "todos"){
        return pokemonsNormalizados
    }
    const pokemons = pokemonsNormalizados
    const filtrado = pokemons.filter(p => p.tipos.includes(tipo))
    return filtrado
}



// Función para buscar pokemon por nombre

const botonBuscar = document.getElementById("buscador-button")
const inputBuscar = document.getElementById("buscador-input")
const SelectorTipos = document.getElementById("TypeSelector")

botonBuscar.addEventListener("click", () => {
    const contenedor = document.getElementById("resultado");
    const busqueda = inputBuscar.value.trim().toLowerCase()
    const pokemonBuscado = pokemonsNormalizados.find(pokemon => pokemon.nombre.toLowerCase() === busqueda)
    if (pokemonBuscado) {
        renderizar([pokemonBuscado]); // Pasamos el pokemon dentro de un array porque renderizar espera una lista
    } else {
        alert("¡Pokémon no encontrado! Revisa si está bien escrito.");
    }
    inputBuscar.value = ""
})




//Función para filtrar pokemon por tipos

SelectorTipos.addEventListener("change", () => {
    const tipoSeleccionado = SelectorTipos.value;
    const pokemonsFiltrados = filtrarpokemons(tipoSeleccionado);
    renderizar(pokemonsFiltrados);
});

// SelectorTipos.addEventListener("change", () => {
//     const contenedor = document.getElementById("resultado");
    

//     switch(SelectorTipos.value){
//         case "fire":
//             contenedor.innerHTML = filtrarpokemons("fire").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;

//         case "grass":
//             contenedor.innerHTML = filtrarpokemons("grass").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;

//         case "water":
//             contenedor.innerHTML = filtrarpokemons("water").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "electric":
//             contenedor.innerHTML = filtrarpokemons("electric").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "ground":
//             contenedor.innerHTML = filtrarpokemons("ground").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "rock":
//             contenedor.innerHTML = filtrarpokemons("rock").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "steel":
//             contenedor.innerHTML = filtrarpokemons("steel").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "psychic":
//             contenedor.innerHTML = filtrarpokemons("psychic").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "normal":
//             contenedor.innerHTML = filtrarpokemons("normal").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "dark":
//             contenedor.innerHTML = filtrarpokemons("dark").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "fighting":
//             contenedor.innerHTML = filtrarpokemons("fighting").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "flying":
//             contenedor.innerHTML = filtrarpokemons("flying").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "ghost":
//             contenedor.innerHTML = filtrarpokemons("ghost").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "ice":
//             contenedor.innerHTML = filtrarpokemons("ice").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "fairy":
//             contenedor.innerHTML = filtrarpokemons("fairy").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "poison":
//             contenedor.innerHTML = filtrarpokemons("poison").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "bug":
//             contenedor.innerHTML = filtrarpokemons("bug").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//         case "dragon":
//             contenedor.innerHTML = filtrarpokemons("dragon").map(
//         (pokemon) => `
//         <article class= "card" id= "${pokemon.nombre}Tarjeta">
//             <div class= "${pokemon.tipos[0]}">
//                 <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
//                 <div class: "card-content>
//                     <h2>${pokemon.nombre}</h2>
//                     <p>${pokemon.tipos.join(" · ")}</p>
//                 </div>
//             </div>
//         </article>
//     `,
//         )
//         .join("");
//         break;
        
//     }
// })