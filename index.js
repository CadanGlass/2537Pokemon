const PAGE_SIZE = 10;
let currentPage = 1;
let pokemons = [];
let currentSet = 1;

const updatePaginationDiv = (currentPage, numPages) => {
  const paginationDiv = document.querySelector("#pagination");
  paginationDiv.innerHTML = "";

  if (currentSet > 1) {
    let prevBtn = document.createElement("button");
    prevBtn.classList.add("btn", "btn-primary", "page", "ml-1");
    prevBtn.textContent = "Prev";
    prevBtn.addEventListener("click", () => {
      currentSet -= 5;
      updatePaginationDiv(currentPage, numPages);
    });
    paginationDiv.appendChild(prevBtn);
  }

  const startPage = currentSet;
  const endPage = Math.min(numPages, currentSet + 4);

  for (let i = startPage; i <= endPage; i++) {
    let btn = document.createElement("button");
    btn.classList.add("btn", "btn-primary", "page", "ml-1");
    if (i === currentPage) {
      btn.classList.add("current-page");
    }
    btn.value = i;
    btn.textContent = i;
    btn.addEventListener("click", () => paginate(i, PAGE_SIZE, pokemons));
    paginationDiv.appendChild(btn);
  }

  if (currentSet + 4 < numPages) {
    let nextBtn = document.createElement("button");
    nextBtn.classList.add("btn", "btn-primary", "page", "ml-1");
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      currentSet += 5;
      updatePaginationDiv(currentPage, numPages);
    });
    paginationDiv.appendChild(nextBtn);
  }

  document.querySelector(
    "#total-pokemon"
  ).textContent = `Total Pokémon: ${pokemons.length}`;
  document.querySelector(
    "#displayed-pokemon"
  ).textContent = `Displaying Pokémon: ${
    (currentPage - 1) * PAGE_SIZE + 1
  }-${Math.min(currentPage * PAGE_SIZE, pokemons.length)}`;
};

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  const start = (currentPage - 1) * PAGE_SIZE;
  const selectedPokemons = pokemons.slice(start, start + PAGE_SIZE);
  const end = start + selectedPokemons.length; // Calculate the end index of displayed pokemons

  const pokemonDiv = document.querySelector("#pokemon");
  pokemonDiv.innerHTML = "";

  let pokemonList = '<div class="pokemon-grid">';

  for (let pokemon of selectedPokemons) {
    let pokemonDetailsResponse = await axios.get(pokemon.url);
    let pokemonDetails = pokemonDetailsResponse.data;

    pokemonList += `<div class="pokemonCard" pokeName="${pokemonDetails.name}"> 
    <h3>${pokemonDetails.name}</h3> 
    <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}" />
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">More</button>
    </div>`;
  }

  pokemonList += "</div>";
  pokemonDiv.innerHTML = pokemonList;

  document.querySelector("#displayed-pokemon").textContent = `Displaying ${
    start + 1
  } - ${end} of ${pokemons.length} Pokémon`; // Update displayed Pokemon count

  document.querySelectorAll(".pokemonCard").forEach((card) => {
    card.addEventListener("click", function (e) {
      loadModal(this.getAttribute("pokeName"));
    });
  });
};


const loadModal = async (pokemonName) => {
  const res = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  const types = res.data.types
    .map((type) => `<li>${type.type.name}</li>`)
    .join("");

  const abilities = res.data.abilities
    .map((ability) => `<li>${ability.ability.name}</li>`)
    .join("");

  const stats = res.data.stats
    .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
    .join("");

  document.querySelector(".modal-body").innerHTML = `
    <div style="width:200px">
      <img src="${res.data.sprites.other["official-artwork"].front_default}" alt="${res.data.name}"/>
      <div>
        <h3>Abilities</h3>
        <ul>${abilities}</ul>
      </div>
      <div>
        <h3>Stats</h3>
        <ul>${stats}</ul>
      </div>
      <div>
        <h3>Types</h3>
        <ul>${types}</ul>
      </div>
    </div>
  `;
  document.querySelector(".modal-title").innerHTML = `
    <h2>${res.data.name.toUpperCase()}</h2>
    <h5>${res.data.id}</h5>
  `;
};


const setup = async () => {
  let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
  pokemons = response.data.results;

  const numPages = Math.ceil(pokemons.length / PAGE_SIZE);
  updatePaginationDiv(currentPage, numPages);
  paginate(currentPage, PAGE_SIZE, pokemons);
};

setup();
