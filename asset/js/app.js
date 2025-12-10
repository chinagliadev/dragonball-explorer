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

    document.getElementById('img-personagem').src = personagem.image;
    document.getElementById('nome-personagem-card').innerHTML = personagem.name;
    document.getElementById('poder-luta').innerHTML = personagem.ki;
    document.getElementById('raca').innerHTML = personagem.race;

    const transformacao = personagem.transformations
    console.log(transformacao)
    let htmlCard = ''
    
    transformacao.forEach(element =>{
         htmlCard += `  <div class="col-lg-3 col-sm-12"> 
                    <figure class="col-card p-3">
                        <img src="${element.image}" class="img-card img-fluid" alt="Imagem do personagem ${element.name}">
                        <figcaption class="mt-3 text-black">
                            <h2 class="fs-4 text-center">${element.name}</h2>
                        </figcaption>
                    </figure>
                </div>`

        document.getElementById('linha-transformacoes').innerHTML = htmlCard
    })
}


carregarPersonagemDetalhes()
