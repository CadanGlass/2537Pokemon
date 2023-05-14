const setup = async () => {
  let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");

  const pokemons = response.data.results;

  const pokemonDiv = document.querySelector("#pokemon");

  pokemonDiv.innerHTML = "";

  let pokemonList = '<div class="pokemon-grid">';

  for (let pokemon of pokemons) {
    let pokemonDetailsResponse = await axios.get(pokemon.url);
    let pokemonDetails = pokemonDetailsResponse.data;

    pokemonList += `<div class="pokemonCard"> 
    <h3>${pokemonDetails.name}</h3> 
    <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}" />
    <button type ="button" class= "btn btn-primary" data-bs-toggle = "modal" data-bs-target = "#pokeModal">More</button>
    </div>`;
  }

  pokemonList += "</div>";
  pokemonDiv.innerHTML = pokemonList;
};

setup();
