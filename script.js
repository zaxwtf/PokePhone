//Version PokePhone
const VERSION_POKEPHONE = "0.0.6"


//Parte fija PokeAPI
const API = "https://pokeapi.co/api/v2";


//Colores tipos pokemon
const TYPE_COLORS ={
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    grass: "#7AC74C",
    electric: "#F7D02C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
}

 //función para hacer lista de pokemons

    async function ListarPokemons(offset, limit) {
        try{
            const res = await fetch(`${API}/pokemon?offset=${offset}&limit=${limit}`)
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
    const pokemonGuardados = localStorage.getItem("pokedex_data")
    const versionGuardada =localStorage.getItem("pokephone_version")

    if (pokemonGuardados && versionGuardada === VERSION_POKEPHONE){
        pokemonsNormalizados = JSON.parse(pokemonGuardados)
        renderizar(pokemonsNormalizados)
    } else{

        //Paso A: listar los primeros 20 Pokemons rapidamente
        const primerosPokemons = await ListarPokemons(0, 20)
        const primerosNormalizados = NormalizarPokemon(primerosPokemons)
        pokemonsNormalizados = primerosNormalizados
        renderizar(pokemonsNormalizados)

        //Paso B: Listar el resto de pokemons con la funcion auxiliar CargarRestoPokemons
        CargarRestoPokemons(pokemonsNormalizados)
    }
}

async function CargarRestoPokemons(primeros20) {
    const restoPokemons = await ListarPokemons(20, 1005)
    if (restoPokemons){
        const restoPokemonsNormalizados = NormalizarPokemon(restoPokemons)
        pokemonsNormalizados = [...primeros20, ...restoPokemonsNormalizados]
    }
    //Guardamos los datos en localStorage
    localStorage.setItem("pokedex_data", JSON.stringify(pokemonsNormalizados))
    localStorage.setItem("pokephone_version", VERSION_POKEPHONE)

    // refrescamos la vista para que aparezcan los pokemons si no hay aplicadas busquedas
        const inputBuscar = document.getElementById("buscador-input");
        if (inputBuscar && inputBuscar.value === "") {
            renderizar(pokemonsNormalizados);
        }
}



    //funcion para Normalizar una array con los nombres de todos los pokemon y sus tipos
function NormalizarPokemon(listaANormalizar) {
    const resultado = listaANormalizar.map(item => {
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
        generacion: especie.generation.name,
        estadisticas: pokemon.stats.map((s) => {return{nombre: s.stat.name, valor: s.base_stat}}),
        grito: pokemon.cries ? pokemon.cries.latest : null
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
            <img src="${pokemon.sprites}" alt="${pokemon.nombre}">
            <div class = "card-content">
                <h2>${pokemon.nombre}</h2>
                <p>${pokemon.tipos.join(" · ")}</p>
            </div>
        </article>
    `,
        )
        .join("");

        //Funcion para cambiar color a las card segun tipo
        
    
        ColorearTarjetas(pokemons)
        
        


        

        //Funcion para que detecte cuando hacemos click a una de las tarjetas y nos mande a renderizar la pagina de info de ese pokemon en concreto
        const TarjetasPokemons = document.querySelectorAll(".card")

        TarjetasPokemons.forEach(TarjetaPokemon => TarjetaPokemon.addEventListener("click", () =>{   
            const PokemonClickado = pokemonsNormalizados.find(pokemon => pokemon.id === Number(TarjetaPokemon.id))
            console.log(PokemonClickado)
            if (PokemonClickado && PokemonClickado.grito){
            const audio = new Audio(PokemonClickado.grito)
            audio.volume = 0.4
            audio.play().catch(error => console.error("Error al reproducir el sonido:", error));
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

            renderizarInfo([PokemonClickado])
        }))

        
    }

GetPokemons()

function ColorearTarjetas(pokemons){
    const PokemonCard = document.querySelectorAll(".card")
    PokemonCard.forEach((card, index) => {
            const PokemonActual = pokemons[index]

            const tipo1 = PokemonActual.tipos[0]
            const tipo2 = PokemonActual.tipos[1]
            const colorPrimario = TYPE_COLORS[tipo1]
            card.style.setProperty("--type-primary", colorPrimario)
            if (tipo2 && TYPE_COLORS[tipo2]) {
            card.style.setProperty("--type-secondary", TYPE_COLORS[tipo2]);
        } else {
            card.style.setProperty("--type-secondary", colorPrimario);
        }
        })
}

//Función para renderizar Tarjeta de información de un pokemon en concreto
function renderizarInfo(pokemon){
    const contenedor = document.getElementById("resultado"); 
    contenedor.innerHTML = pokemon.map(
        (poke) =>`
        <article class="TarjetaInfo" id="${poke.id}Info">
            <div class="PokemonHeader ${poke.tipos[0]}Header">
                <img src="${poke.sprites}" alt="${poke.nombre}">
                <div class= "PokemonName">
                    <h2>${poke.nombre}</h2>
                    <p>${poke.tipos.join(" · ")}</p>
                </div>
                <h2>Pokedex: ${poke.id}<h2>
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
                        ${poke.estadisticas.map(p =>`<p>${p.nombre}=  ${p.valor}</p>`).join("")}
                        </div>
                    </div>
                    <button id="btnRegresar">←</button>
                </div>
            </div>
        </article>
        
        `
        
        )

        const btnRegresar = document.getElementById("btnRegresar")

        btnRegresar.addEventListener("click", ()=>{
        renderizar(filtrarpokemons())
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

inputBuscar.addEventListener("keydown", (e) =>{
    if (e.key === "Enter"){
        const contenedor = document.getElementById("resultado");
    const busqueda = inputBuscar.value.replaceAll(" ", "").toLowerCase()
    const pokemonBuscado = pokemonsNormalizados.find(pokemon => pokemon.nombre.toLowerCase() === busqueda)
    if (pokemonBuscado) {
        renderizar([pokemonBuscado]); // Pasamos el pokemon dentro de un array porque renderizar espera una lista
    } else {
        alert("¡Pokémon no encontrado! Revisa si está bien escrito.");
    }
    inputBuscar.value = ""
    }
})



//Función para filtrar pokemon por tipos

SelectorTipos.addEventListener("change", () => renderizar(filtrarpokemons()));

SelectorGen.addEventListener("change", () => renderizar(filtrarpokemons()));



//Incluir version en footer página
const versionText = document.querySelector(".appVersion")
versionText.textContent = `Versión ${VERSION_POKEPHONE}`