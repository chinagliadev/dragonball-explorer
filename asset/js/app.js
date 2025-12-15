let timeoutEntrada = null;
let timeoutSaida = null;

function salvarPersonagensCurtidos(arr) {
    localStorage.setItem('personagensDragonBallCurtidos', JSON.stringify(arr))
}

function pegarPersonagensCurtidos() {
    const curtidosSalvos = localStorage.getItem('personagensDragonBallCurtidos')
    return curtidosSalvos ? JSON.parse(curtidosSalvos) : []
}

function alternarCurtida(idPersonagem) {
    const id = Number(idPersonagem)

    let listaCurtidos = pegarPersonagensCurtidos()

    const indice = listaCurtidos.indexOf(id)

    if (indice === -1) {
        listaCurtidos.push(id)
    } else {
        listaCurtidos.splice(indice, 1)
    }

    salvarPersonagensCurtidos(listaCurtidos)

    return listaCurtidos
}

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

    const idsCurtidos = pegarPersonagensCurtidos();

    let htmlCards = '';

    dados.forEach(element => {
        const isCurtido = idsCurtidos.includes(element.id);

        const iconeClass = isCurtido ? 'bi-heart-fill' : 'bi-heart';
        const curtidoClass = isCurtido ? ' curtido' : '';

        htmlCards += `
        <div class="col-lg-3 col-md-6 col-sm-12"> 
            <figure class="col-card p-3">
                <button class="btn-curtir${curtidoClass}" data-id=${element.id}>
                    <i class="bi ${iconeClass}"></i>
                </button>
            <a href="detalhes.html?id=${element.id}" class="link-cards">
                <div class="circle-glass"></div>

                <img src="${element.image}" crossorigin="anonymous" class="img-card-personagem img-fluid"
                style="position: relative; z-index: 2;">

                <figcaption class="mt-3 text-black">
                    <h2 class="fs-4 text-center">${element.name}</h2>
                </figcaption>
            </a>

            </figure>
        </div>`;
    });

    linha.innerHTML = htmlCards;

    aplicarVibrantEmTodosOsCards();
    adicionarPersonagemCurtido()

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

    if (personagem.transformations.length === 0) {
        document.getElementById('personagem-transformacao').innerHTML = personagem.name

        const mensagem = document.getElementById('mensagem-transformacao')

        mensagem.classList.remove('d-none')
        mensagem.classList.add('d-block')
    }

    htmlCardsTransformacao += `
    <div class="col-lg-2">
        <a href=""
           class="link-cards card-transformacao ativa"
           data-image="${personagem.image}"
           data-id="base"
           data-name-transformacao="${personagem.name}"
           data-ki-transformacao="${personagem.ki}"
           data-race-transformacao="${personagem.race}">
            <figure class="col-card">
                <img src="${personagem.image}" crossorigin="anonymous" class="img-card img-fluid">
                <figcaption class="text-center mt-2">
                    </figcaption>
                    </figure>
                    </a>
                    </div>
                    `;
                    
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
                        <img src="${element.image}" crossorigin="anonymous" class="img-card img-fluid">
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

        const idsCurtidos = pegarPersonagensCurtidos();

        if (!response.ok) {
            linha.innerHTML = '<p class="text-white text-center">Nenhum personagem encontrado.</p>';
            paginas.innerHTML = "";
            return;
        }

        const data = await response.json();
        const dados = Array.isArray(data) ? data : data.items || [];

        let html = '';

        dados.forEach(element => {
            const isCurtido = idsCurtidos.includes(element.id);
            const iconeClass = isCurtido ? 'bi-heart-fill' : 'bi-heart';
            const curtidoClass = isCurtido ? ' curtido' : '';

            html += `
                <div class="col-lg-3 col-md-6 col-sm-12"> 
                <figure class="col-card p-3">
                <button class="btn-curtir${curtidoClass}" data-id=${element.id}>
                    <i class="bi ${iconeClass}"></i>
                </button>
                <a href="detalhes.html?id=${element.id}" class="link-cards">
                            <div class="circle-glass"></div>
                            <img src="${element.image}" crossorigin="anonymous" class="img-card-personagem img-fluid" style="position: relative; z-index: 2;">
                            <figcaption class="mt-3 text-black">
                                <h2 class="fs-4 text-center">${element.name}</h2>
                            </figcaption>
                            </a>
                        </figure>
                </div>`;
        });

        linha.innerHTML = html;
        paginas.innerHTML = "";

        aplicarVibrantEmTodosOsCards();
        adicionarPersonagemCurtido();

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

        const processarVibrant = () => {
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

        if (img.complete) {
            processarVibrant();
        } else {
            img.onload = processarVibrant;
        }
    });
}

async function filtarPersonagens(termo) {
    try {

        if (termo === 'Todos' || termo === '') {
            document.querySelector('.paginas').innerHTML = '';
            return listarPersonagens(1);
        }

        const response = await fetch(`https://dragonball-api.com/api/characters?race=${termo}`)

        const dados = await response.json()

        const linha = document.getElementById('linha-cards');

        const idsCurtidos = pegarPersonagensCurtidos();

        let html = '';

        dados.forEach(element => {
            const isCurtido = idsCurtidos.includes(element.id);
            const iconeClass = isCurtido ? 'bi-heart-fill' : 'bi-heart';
            const curtidoClass = isCurtido ? ' curtido' : '';

            html += `
                <div class="col-lg-3 col-md-6 col-sm-12"> 
                <figure class="col-card p-3">
                <button class="btn-curtir${curtidoClass}" data-id=${element.id}>
                    <i class="bi ${iconeClass}"></i>
                </button>
                <a href="detalhes.html?id=${element.id}" class="link-cards">
                            <div class="circle-glass"></div>
                            <img src="${element.image}" crossorigin="anonymous" class="img-card-personagem img-fluid" style="position: relative; z-index: 2;">
                            <figcaption class="mt-3 text-black">
                                <h2 class="fs-4 text-center">${element.name}</h2>
                            </figcaption>
                            </a>
                        </figure>
                </div>`;
        });

        linha.innerHTML = html;
        aplicarVibrantEmTodosOsCards()
        adicionarPersonagemCurtido()

    } catch (error) {
        console.error("Erro na pesquisa:", error);
    }
}

function configurarFiltro() {
    const filtro = document.getElementById('filtro-personagens');

    if (!filtro) return;

    filtro.addEventListener('change', function () {
        const racaSelecionada = filtro.value;
        filtarPersonagens(racaSelecionada);
    });
}

function adicionarPersonagemCurtido() {
    const btnCurtidos = document.querySelectorAll('.btn-curtir');

    btnCurtidos.forEach(btnCurtir => {
        btnCurtir.addEventListener('click', (e) => {
            e.preventDefault();
            const mensagemCurtida = document.getElementById('modal-curtida');

            const id = e.currentTarget.getAttribute('data-id');
            const listaAtualizada = alternarCurtida(id);
            const icone = e.currentTarget.querySelector('i');
            const estaCurtidoAgora = listaAtualizada.includes(Number(id));

            if (estaCurtidoAgora) {

                clearTimeout(timeoutEntrada);
                clearTimeout(timeoutSaida);

                icone.classList.remove('bi-heart');
                icone.classList.add('bi-heart-fill');
                e.currentTarget.classList.add('curtido');

                mensagemCurtida.classList.remove('d-none', 'animar-saida');
                mensagemCurtida.classList.add('animar-entrada');

                timeoutEntrada = setTimeout(() => {
                    mensagemCurtida.classList.remove('animar-entrada');
                    mensagemCurtida.classList.add('animar-saida');

                    timeoutSaida = setTimeout(() => {
                        mensagemCurtida.classList.add('d-none');
                        mensagemCurtida.classList.remove('animar-saida');
                    }, 600);

                }, 1500);

            } else {
                icone.classList.remove('bi-heart-fill');
                icone.classList.add('bi-heart');
                e.currentTarget.classList.remove('curtido');

                if (e.currentTarget.closest('#linha-cards-curtidos')) {
                    const card = e.currentTarget.closest('.col-lg-3');
                    card.classList.add('card-saindo');

                    setTimeout(() => {
                        card.remove();
                    }, 400);
                }
            }
        });
    });
}


async function listarPersonagensCurtidos() {
    const idsCurtidos = pegarPersonagensCurtidos();

    const linhaFavoritos = document.getElementById('linha-cards-curtidos');

    if (!linhaFavoritos) return console.error("Elemento com ID 'linha-cards-curtidos' não encontrado.");

    if (idsCurtidos.length === 0) {
        linhaFavoritos.innerHTML = '<p class="text-white text-center">Você não curtiu nenhum personagem ainda.</p>';
        return;
    }

    linhaFavoritos.innerHTML = '<p class="text-center text-white">Carregando seus favoritos...</p>';

    const promessasBusca = idsCurtidos.map(id =>
        fetch(`https://dragonball-api.com/api/characters/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error(`Erro ao carregar o personagem ID ${id}:`, error);
                return null;
            })
    );

    const personagensFavoritos = await Promise.all(promessasBusca);

    const dados = personagensFavoritos.filter(personagem => personagem !== null);

    let htmlCards = '';

    dados.forEach(element => {
        htmlCards += `
    <div class="col-lg-3 col-md-6 col-sm-12"> 
        <figure class="col-card-curtidos p-3"> <button class="btn-curtir curtido" data-id=${element.id}><i class="bi bi-heart-fill"></i></button>
        <a href="detalhes.html?id=${element.id}" class="link-cards">
            <div class="circle-glass"></div>

            <img src="${element.image}" crossorigin="anonymous" class="img-card-personagem img-fluid"
                         style="position: relative; z-index: 2;">

            <figcaption class="mt-3 text-black">
                <h2 class="fs-4 text-center">${element.name}</h2>
            </figcaption>
        </a>

        </figure>
    </div>`;
    });

    linhaFavoritos.innerHTML = htmlCards;

    adicionarPersonagemCurtido();
}


if (document.getElementById('linha-cards')) {
    listarPersonagens();
}

carregarPersonagemDetalhes();
listarPersonagensCurtidos()
configurarPesquisa();
configurarFiltro()