## Dragon Ball Explorer

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/API%20REST-0077B6?style=for-the-badge&logo=JSON&logoColor=white" />
</p>

O **Dragon Ball Explorer** é um projeto desenvolvido para praticar e demonstrar habilidades no consumo de **APIs REST** e manipulação dinâmica da interface usando JavaScript. Ele oferece uma experiência interativa para explorar a vasta lista de personagens do universo Dragon Ball.

### Funcionalidades

* **Listagem de Personagens:** Exibe uma lista de personagens de Dragon Ball, obtidos através de uma API externa.
* **Detalhes Completos:** Permite ao usuário clicar em qualquer personagem para visualizar informações detalhadas e estatísticas.
* **Sistema de Curtidas (Simulado):** Inclui uma funcionalidade interativa de "curtir" (like) para engajar o usuário com a lista de personagens.
* **Design Temático e Responsivo:** A interface utiliza **Bootstrap** para garantir uma excelente experiência em dispositivos móveis e desktop.

### Destaque Técnico

Este projeto foca em demonstrar o uso eficiente do JavaScript e a integração de bibliotecas visuais:

* **Consumo de API:** Realiza requisições `fetch` para buscar dados da API em tempo real.
* **Manipulação do DOM:** Atualiza o conteúdo da página dinamicamente.
* **Estilização Dinâmica:** Utilização da biblioteca **Vibrant.js** para extrair as cores predominantes das imagens dos personagens e aplicá-las dinamicamente à interface.

## 🎨 Estilização Dinâmica com Vibrant.js

Para elevar a experiência visual do projeto, utilizei a biblioteca **Vibrant.js**, que desempenhou um papel crucial na aplicação de cores e no design dinâmico da interface.

### Por que Vibrant.js?

Vibrant.js é uma pequena biblioteca JavaScript que permite extrair as **cores proeminentes, vibrantes e suaves** de uma imagem. Essa técnica foi aplicada no projeto para:

* **Coerência Visual:** Garantir que o design da interface (como fundos de cartões ou detalhes de cabeçalhos) estivesse em perfeita sintonia com o conteúdo da imagem exibida.
* **Imersão Temática:** Criar uma experiência mais imersiva e visualmente rica, onde cada personagem ou item na lista gera um esquema de cores único e personalizado na tela.

### Aplicação no Projeto

Ao carregar a imagem de um personagem, o Vibrant.js analisa os pixels e gera uma paleta de cores. Em seguida, essas cores são usadas para:

* **Alterar a cor de fundo:** Aplicando a cor escura e contrastante para dar profundidade.
* **Destacar elementos:** Utilizando a cor vibrante (como a cor do cabelo de um Super Saiyajin ou a armadura) em botões e títulos.

Essa abordagem resultou em uma interface fluida, onde o *look and feel* se adapta dinamicamente ao conteúdo que está sendo visualizado.
