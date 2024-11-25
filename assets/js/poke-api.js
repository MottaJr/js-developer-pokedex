
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDatail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDatail.id
    pokemon.name = pokeDatail.name

    const types = pokeDatail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDatail.sprites.other.dream_world.front_default

    //adicionar peso e altura do pokemon
    
    pokemon.weight = pokeDatail.weight
    pokemon.height = pokeDatail.height

    

 
    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
    /*função normal seria assim
    .then(function (response) {
        return response.json()
    })
    Porém podemos usar uma arrow function onde se 
    utiliza => e fica assim:*/
    .then((response) => response.json()) /*isso é uma função de call back onde convertemos o 
    response para jason*/
    .then((jsonBody) => jsonBody.results) /*aqui pegamos nossa lista de detalhes
    e solicitamos apenas os resultados que é a lista de pokemons*/
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))/*agora pegamos nossa lista de 
    pokemons e mapeamos uma lista de requisições dos detalhes dos pokemons
    que faz um novo fetch para o detalhe do pokemon e convertendo a resposta para um json na 
    linha 4*/
    .then((detailRequests) => Promise.all(detailRequests))/*aqui pegamos a lista de requisições
    e estamos esperando que todas as requisições terminem*/
    .then((pokemonsDetails) => pokemonsDetails)/*Quando terminarem aqui dará uma lista dos detalhes dos 
    pokemons*/
}

