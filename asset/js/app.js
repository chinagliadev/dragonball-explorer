async function carregarPersonagem() {
    try {
        const response = await fetch('https://dragonball-api.com/api/characters');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.items; 
                           
    } catch (error) {
        console.error("Houve um erro:", error);
        return []; 
    }
}

async function listarPersonagens() {
    const linha = document.getElementById('linha-cards');

    const dados = await carregarPersonagem(); 

    let htmlCards = '';
    
    dados.forEach(element => { 
        htmlCards += `
            <div class="col-lg-3 col-sm-12"> 
                <a href="detalhes.html?id=${element.id}" class="link-cards">
                    <figure class="col-card p-3">
                        <img src="${element.image}" class="img-card img-fluid" alt="Imagem do personagem ${element.name}">
                        <figcaption class="mt-3 text-black">
                            <h2 class="fs-4 text-center">${element.name}</h2>
                        </figcaption>
                    </figure>
                </a>
                </div>
        `;
    });

    linha.innerHTML = htmlCards;
}

listarPersonagens();


async function carregarPersonagemDetalhes() {
    const urlParametro = new URLSearchParams(window.location.search);
    const idPersonagem = urlParametro.get('id');

    const response = await fetch(`https://dragonball-api.com/api/characters/${idPersonagem}`);
    
    if (!response.ok) {
        console.error("Erro ao carregar personagem!");
        return;
    }

    const personagem = await response.json();

    const planeta = personagem.originPlanet
    document.getElementById('planeta-personagem-card').innerHTML = planeta.name
    document.getElementById('img-planeta').src = planeta.image

    console.log(planeta)

    const imgPersonagemPrincipal = document.getElementById('img-personagem');
    
    imgPersonagemPrincipal.src = personagem.image;
    document.getElementById('nome-personagem-card').innerHTML = personagem.name;
    document.getElementById('poder-luta').innerHTML = personagem.ki;
    document.getElementById('raca').innerHTML = personagem.race;
    document.getElementById('equipe').innerHTML = personagem.affiliation;
    document.getElementById('genero').innerHTML = personagem.gender;
    document.getElementById('descricao-personagem').innerHTML = personagem.description

    const transformacoes = personagem.transformations;
    let htmlCardsTransformacao = '';

    transformacoes.forEach(element => {
        htmlCardsTransformacao += `
            <div class="col-lg-3 col-sm-12"> 
                <a href="" 
                   class="link-cards card-transformacao" 
                   data-image="${element.image}" 
                   data-id="${element.id}"
                   data-name-transformacao="${element.name}"
                   data-ki-transformacao="${element.ki || 'N/A'}"
                   data-race-transformacao="${element.race || personagem.race}" 
                >
                    <figure class="col-card p-3">
                        <img src="${element.image}" class="img-card img-fluid" alt="Imagem da transformação ${element.name}">
                        <figcaption class="mt-3 text-black">
                            <h2 class="fs-4 text-center">${element.name}</h2>
                        </figcaption>
                    </figure>
                </a>
            </div>
        `;
    });
    
    const linhaTransformacoes = document.getElementById('linha-transformacoes');
    linhaTransformacoes.innerHTML = htmlCardsTransformacao;
    
    const cardsTransformacao = linhaTransformacoes.querySelectorAll('.card-transformacao');
    
    const nomePersonagemEl = document.getElementById('nome-personagem-card');
    const poderLutaEl = document.getElementById('poder-luta');
    const racaEl = document.getElementById('raca'); 

    cardsTransformacao.forEach(card => {
        card.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            const novaImagemUrl = card.getAttribute('data-image');
            const novoNome = card.getAttribute('data-name-transformacao'); 
            const novoKi = card.getAttribute('data-ki-transformacao'); 
            const novaRaca = card.getAttribute('data-race-transformacao'); 
            
            if (imgPersonagemPrincipal) {
                imgPersonagemPrincipal.src = novaImagemUrl;
            }

            if (nomePersonagemEl && novoNome) {
                nomePersonagemEl.innerHTML = novoNome;
            }
            if (poderLutaEl && novoKi) {
                poderLutaEl.innerHTML = novoKi;
            }
            if (racaEl && novaRaca) {
                racaEl.innerHTML = novaRaca;
            }
            
        });
    });

}

carregarPersonagemDetalhes();


