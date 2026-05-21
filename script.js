//Parte fija PokeAPI
const API = "https://pokeapi.co/api/v2";

 //función para hacer lista de pokemons

    async function ListarPokemons() {
        try{
            const res = await fetch(`${API}/pokemon?limit=493`)
            if (!res.ok) throw new Error(`Dato no encontrado (${res.status})`);
            const data = await res.json()
            const urls = data.results.map(pokemon => pokemon.url)
            const promesas = urls.map(async (url) => {
                //Petición para info de los pokemon
                const resPokemon = await fetch(url)
                const dataPokemon = await resPokemon.json()

                //Petición para info mas especifica de cada especia pokemon
                const resEspecie = await fetch(dataPokemon.species.url)
                const dataEspecie = await resEspecie.json()
                return {
                    datosBasicos: dataPokemon,
                    datosEspecie: dataEspecie
                };
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




    //funcion para Normalizar una array con los nombres de todos los pokemon y sus tipos
function NormalizarPokemon() {
    const resultado = pokemons.map(item => {
        const pokemon = item.datosBasicos   //Ubicamos el objeto con los datos basicos
        const especie = item.datosEspecie   //Ubicamos el objeto con los datos de especie
        const entradaEspanol = especie.flavor_text_entries.find(entry => entry.language.name === "es" && entry.version.name);
        const descripcion = entradaEspanol ? entradaEspanol.flavor_text : "Descripción no disponible en Español."
        
        //devolvemos de la arrow function los pokemon normalizados
        return {
        id: pokemon.id, 
        nombre: pokemon.name, 
        tipos: pokemon.types.map(t => t.type.name), 
        sprites: pokemon.sprites.other['official-artwork'].front_default,
        pokedex: descripcion,
        generacion: especie.generation.name
        }
    })

    return resultado
}


// Función para renderizar lista de pokemons

function renderizar(pokemons){
    const contenedor = document.getElementById("resultado"); 

    if (pokemons.length === 0) {
        contenedor.innerHTML = `<p class="no-results">No se encontraron Pokémon.</p>`;
        return;
    }

    contenedor.innerHTML = pokemons.map(
        (pokemon) => `
        <article class= "card" id= "${pokemon.id}">
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
        

        //Funcion para que detecte cuando hacemos click a una de las tarjetas y nos mande a renderizar la pagina de info de ese pokemon en concreto
        const TarjetasPokemons = document.querySelectorAll(".card")
        const TarjetaPokemon = 0

        TarjetasPokemons.forEach(TarjetaPokemon => TarjetaPokemon.addEventListener("click", () =>{   
            const PokemonClickado = pokemonsNormalizados.find(pokemon => pokemon.id === Number(TarjetaPokemon.id))
            console.log(PokemonClickado)
            renderizarInfo([PokemonClickado])
        }))
        
    }

GetPokemons()



//Función para renderizar Tarjeta de información de un pokemon en concreto
function renderizarInfo(pokemon){
    const contenedor = document.getElementById("resultado"); 
    contenedor.innerHTML = pokemon.map(
        (poke) =>`
        <article class="TarjetaInfo" id="${poke.id}Info">
            <div class="PokemonHeader ${poke.tipos[0]}Header">
                <button id="btnRegresar">←</button>
                <img src="${poke.sprites}" alt="${poke.nombre}">
                texto informativo
            </div>
            <div class="pokemon-content">
                <div class="pokeInfo ${poke.tipos[0]}Body">
                    <div class="pokeInfo-content">
                        <h2>Info</h2>
                        <div class="info">
                            <p>
                            ${poke.pokedex}
                            </p>
                        </div>
                        <h2>Fuerte contra:</h2>
                        <div class="FuerteContra">
                            <p>
                                lo que sea
                            </p>
                        </div>
                        <h2>Estadísticas</h2>
                        <div class="estadisticas">
                            <p>
                                esto y lo otro
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        
        `
        
        )

        const btnRegresar = document.getElementById("btnRegresar")

        btnRegresar.addEventListener("click", ()=>{
        renderizar(pokemonsNormalizados)
})
}


//Boton volver para volver a renderizar lista pokemons






//Funcion para filtrar pokemons por tipo


const botonBuscar = document.getElementById("buscador-button")
const inputBuscar = document.getElementById("buscador-input")
const SelectorTipos = document.getElementById("TypeSelector")
const SelectorGen = document.getElementById("GenSelector")


function filtrarpokemons() {
    // if (tipo === "todos"){
    //     return pokemonsNormalizados
    // }
    const pokemons = pokemonsNormalizados
    // const filtrado = pokemons.filter(p => p.tipos.includes(tipo))
    // return filtrado
    const tipoSeleccionado = SelectorTipos.value
    const genSeleccionada = SelectorGen.value

    const pokemonFiltrado = pokemons.filter(p =>{
        const tipoOK = (tipoSeleccionado === "todos" || p.tipos.includes(tipoSeleccionado))  //Comprobamos si hay un tipo seleccionado
        const genOK = (genSeleccionada === "todos" || p.generacion === genSeleccionada)      //Comprobamos si hay una generación seleccionada

        return tipoOK && genOK
    })
    return pokemonFiltrado
}



// Función para buscar pokemon por nombre

botonBuscar.addEventListener("click", () => {
    const contenedor = document.getElementById("resultado");
    const busqueda = inputBuscar.value.replaceAll(" ", "").toLowerCase()
    const pokemonBuscado = pokemonsNormalizados.find(pokemon => pokemon.nombre.toLowerCase() === busqueda)
    if (pokemonBuscado) {
        renderizar([pokemonBuscado]); // Pasamos el pokemon dentro de un array porque renderizar espera una lista
    } else {
        alert("¡Pokémon no encontrado! Revisa si está bien escrito.");
    }
    inputBuscar.value = ""
})




//Función para filtrar pokemon por tipos

SelectorTipos.addEventListener("change", () => renderizar(filtrarpokemons()));

SelectorGen.addEventListener("change", () => renderizar(filtrarpokemons()));



//Función para mostrar mas informacion de un pokemon
