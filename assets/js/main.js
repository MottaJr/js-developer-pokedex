document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById('pokemonList')
    const loadMoreButton = document.getElementById('loadMoreButton')
    const modal = document.getElementById("pokemon-modal")
    
    const maxRecords = 151
    const limit = 5
    let offset = 0
    
    function convertPokemonToLi(pokemon) {
        return `
            <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
    
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    <img src="${pokemon.photo}"
                         alt="${pokemon.name}">
                </div>
            </li>
        `
    }

    

    function showPokemonModal(pokemon) {
        // Seleciona elementos no modal
        const modal = document.getElementById("pokemon-modal");
        const image = document.querySelector('.modal-detail img');
        const nameElement = document.getElementById("pokemon-name");
        const photoElement = document.getElementById("pokemon-photo");
        const typeElement = document.getElementById("pokemon-type");
        const weightElement = document.getElementById("pokemon-weight");
        const heightElement = document.getElementById("pokemon-height");
    
        // Converte altura e peso para metros e quilogramas
        const heightInMeters = (pokemon.height * 0.3048).toFixed(2);
        const weightInKg = (pokemon.weight * 0.453592).toFixed(2);


    
        // Muda o backgroundColor do Modal
        const elemento = document.querySelector('.modal');
    
        // Obtém todas as classes do elemento em forma de array
        let classes = Array.from(elemento.classList);
        
        // Verifica se há pelo menos 2 classes
        if (classes.length >= 2) {
            // Substitui a segunda classe
            classes[1] = pokemon.type;
            // Atualiza as classes do elemento
            elemento.className = classes.join(' ');
        } else {
            // Adiciona a nova classe
            elemento.classList.add(pokemon.type);
        }

        photoElement.src = '';  // Limpar a imagem
    
        // Atualiza o conteúdo do modal com os detalhes do Pokémon
        nameElement.textContent = pokemon.name;
        photoElement.src = pokemon.photo;
        typeElement.textContent = `Tipo: ${pokemon.type}`;
        weightElement.textContent = `Peso: ${weightInKg} Kg`;
        heightElement.textContent = `Altura: ${heightInMeters} metros`;

            
        // Remover a classe 'show' para reiniciar a animação
        modal.classList.remove('show');
        
            
        // Exibe o modal adicionando a classe .show
        modal.classList.add("show");

        // Forçar o navegador a aplicar as mudanças imediatamente
        void modal.offsetWidth; // Isso força o navegador a "recalcular" o layout

        // Agora, adicione a classe 'animate' para iniciar a animação
        modal.classList.add("animate");

        
    }

    function resetModal() {
        // Resetar texto dos elementos de informações
        document.getElementById('pokemon-name').textContent = '';
        document.getElementById('pokemon-type').textContent = '';
        document.getElementById('pokemon-weight').textContent = '';
        document.getElementById('pokemon-height').textContent = '';
    
        // Resetar link da imagem
        const photoElement = document.getElementById('pokemon-photo');
        photoElement.src = '';  // Limpar a imagem

           
        // A classe 'show' é removida para reiniciar a animação.
        const modal = document.getElementById("pokemon-modal");
        modal.classList.remove('show');


        
        // Se necessário, forçar a remoção das animações
        void modal.offsetWidth;  // Isso força o navegador a "recalcular" o layout
    }

    // Fechar o modal ao clicar no botão de fechar
        document.querySelector(".close-button").addEventListener("click", () => {
        const modal = document.getElementById("pokemon-modal");
        modal.classList.remove("show", "animate");
        resetModal();
    });
    

    function addPokemonClickEvent() {
        const pokemonElements = pokemonList.querySelectorAll('li.pokemon');

        pokemonElements.forEach((element) => {
            element.addEventListener("click", () => {
                const pokemonId = element.getAttribute("data-id");

                pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}` })
                    .then((pokemonDetail) => {
                        showPokemonModal(pokemonDetail);
                    });
            });
        });
    }
    
    function loadPokemonItens(offset, limit) {
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('')
            pokemonList.innerHTML += newHtml

            addPokemonClickEvent();
        })
    }
    
    loadPokemonItens(offset, limit)
    
    loadMoreButton.addEventListener('click', () => {
        offset += limit
        const qtdRecordsWithNexPage = offset + limit
    
        if (qtdRecordsWithNexPage >= maxRecords) {
            const newLimit = maxRecords - offset
            loadPokemonItens(offset, newLimit)
    
            loadMoreButton.parentElement.removeChild(loadMoreButton)
        } else {
            loadPokemonItens(offset, limit)
        }
    })
})