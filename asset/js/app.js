let paginaAtual = 1;
const limite = 8;


async function carregarPersonagens(pagina = 1) {
    try {
        const response = await fetch(`https://dragonball-api.com/api/characters?page=${pagina}&limit=${limite}`);
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Houve um erro:", error);
        return { items: [], meta: {}, links: {} };
    }
}


async function listarPersonagens(pagina = 1) {
    const linha = document.getElementById('linha-cards');
    const paginasContainer = document.querySelector('.paginas');

    const data = await carregarPersonagens(pagina);
    const dados = data.items;

    let htmlCards = '';

    dados.forEach(element => {
        htmlCards += `
    <div class="col-lg-3 col-sm-12"> 
        <a href="detalhes.html?id=${element.id}" class="link-cards">
            <figure class="col-card p-3">
                
                <div class="circle-glass"></div>

                <img src="${element.image}" class="img-card-personagem img-fluid"
                     style="position: relative; z-index: 2;">

                <figcaption class="mt-3 text-black">
                    <h2 class="fs-4 text-center">${element.name}</h2>
                </figcaption>

            </figure>
        </a>
    </div>`;
    });

    linha.innerHTML = htmlCards;

    aplicarVibrantEmTodosOsCards();

    const meta = data.meta;
    const links = data.links;

    let htmlPaginas = `
        <li><button ${!links.first ? 'disabled' : ''} onclick="listarPersonagens(1)">Primeira</button></li>
        <li><button ${!links.previous ? 'disabled' : ''} onclick="listarPersonagens(${meta.currentPage - 1})">Anterior</button></li>
        <li>Página ${meta.currentPage} de ${meta.totalPages}</li>
        <li><button ${!links.next ? 'disabled' : ''} onclick="listarPersonagens(${meta.currentPage + 1})">Próxima</button></li>
        <li><button ${!links.last ? 'disabled' : ''} onclick="listarPersonagens(${meta.totalPages})">Última</button></li>
    `;

    paginasContainer.innerHTML = `<ul>${htmlPaginas}</ul>`;
}

async function carregarPersonagemDetalhes() {
    const urlParametro = new URLSearchParams(window.location.search);
    const idPersonagem = urlParametro.get('id');

    if (!idPersonagem) return;

    const response = await fetch(`https://dragonball-api.com/api/characters/${idPersonagem}`);
    if (!response.ok) return console.error("Erro ao carregar personagem!");

    const personagem = await response.json();

    document.getElementById('planeta-personagem-card').innerHTML = personagem.originPlanet.name;
    document.getElementById('img-planeta').src = personagem.originPlanet.image;
    document.getElementById('img-personagem').src = personagem.image;

    document.getElementById('nome-personagem-card').innerHTML = personagem.name;
    document.getElementById('poder-luta').innerHTML = personagem.ki;
    document.getElementById('raca').innerHTML = personagem.race;
    document.getElementById('equipe').innerHTML = personagem.affiliation;
    document.getElementById('genero').innerHTML = personagem.gender;
    document.getElementById('descricao-personagem').innerHTML = personagem.description;
    document.getElementById('nome-descricao').innerHTML = personagem.name;

    const linhaTransformacoes = document.getElementById('linha-transformacoes');
    let htmlCardsTransformacao = '';

    personagem.transformations.forEach(element => {
        htmlCardsTransformacao += `
            <div class="col-lg-2"> 
                <a href="" 
                   class="link-cards card-transformacao" 
                   data-image="${element.image}" 
                   data-id="${element.id}"
                   data-name-transformacao="${element.name}"
                   data-ki-transformacao="${element.ki || 'N/A'}"
                   data-race-transformacao="${element.race || personagem.race}">
                    <figure class="col-card">
                        <img src="${element.image}" class="img-card img-fluid">
                    </figure>
                </a>
            </div>`;
    });

    linhaTransformacoes.innerHTML = htmlCardsTransformacao;

    const imgPrincipal = document.getElementById('img-personagem');
    const nomeEl = document.getElementById('nome-personagem-card');
    const poderEl = document.getElementById('poder-luta');
    const racaEl = document.getElementById('raca');

    document.querySelectorAll('.card-transformacao').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            imgPrincipal.src = card.dataset.image;
            nomeEl.innerHTML = card.dataset.nameTransformacao;
            poderEl.innerHTML = card.dataset.kiTransformacao;
            racaEl.innerHTML = card.dataset.raceTransformacao;
        });
    });
}

async function pesquisarPersonagem(termo) {
    if (!termo.trim()) return listarPersonagens(1);

    try {
        const response = await fetch(`https://dragonball-api.com/api/characters?name=${termo}`);

        const linha = document.getElementById('linha-cards');
        const paginas = document.querySelector('.paginas');

        if (!response.ok) {
            linha.innerHTML = '<p class="text-white text-center">Nenhum personagem encontrado.</p>';
            paginas.innerHTML = "";
            return;
        }

        const data = await response.json();
        const dados = data.items || data;

        let html = '';

        dados.forEach(element => {
            html += `
                <div class="col-lg-3 col-sm-12"> 
                    <a href="detalhes.html?id=${element.id}" class="link-cards">
                        <figure class="col-card p-3">
                            <div class="circle-glass"></div>
                            <img src="${element.image}" class="img-card-personagem img-fluid" style="position: relative; z-index: 2;">
                            <figcaption class="mt-3 text-black">
                                <h2 class="fs-4 text-center">${element.name}</h2>
                            </figcaption>
                        </figure>
                    </a>
                </div>`;
        });

        linha.innerHTML = html;
        paginas.innerHTML = "";

        aplicarVibrantEmTodosOsCards();

    } catch (error) {
        console.error("Erro na pesquisa:", error);
    }
}

function configurarPesquisa() {
    const input = document.getElementById('txtPersonagem');
    if (!input) return;

    input.addEventListener('input', e => pesquisarPersonagem(e.target.value));
}

function aplicarVibrantEmTodosOsCards() {
    const cards = document.querySelectorAll('.col-card');

    cards.forEach(card => {
        const img = card.querySelector('img');
        const circle = card.querySelector('.circle-glass');

        if (!img || !circle) return;

        img.onload = () => {
            Vibrant.from(img.src).getPalette((err, palette) => {
                if (err || !palette) return console.warn("Vibrant falhou:", err);

                const corVibrante = palette.Vibrant || palette.LightVibrant || palette.Muted;

                if (corVibrante) {
                    circle.style.background = `${corVibrante.getHex()}80`; 
                    circle.style.border = `1px solid ${corVibrante.getHex()}50`;

                    card.style.backgroundColor = "#ffffff";
                    card.style.color = corVibrante.getTitleTextColor();
                }
            });
        };
    });
}



listarPersonagens();
carregarPersonagemDetalhes();
configurarPesquisa();
