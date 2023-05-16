const PAGE_SIZE = 10
let currentPage = 1;
let pokemons = []
let pokemonTypes = []
let pokemonsList = []
let pokemonSelection = []
let thispokemonsList = [];

const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty()

  const startPage = 1;
  const endPage = numPages;

  var pageMinTwo = currentPage - 2;
  var pagePlusTwo = currentPage + 2;
  //      -1
   for (let i = pageMinTwo; i <= pagePlusTwo; i++) {
    var isActive = "";
    var btnColor = "primary";
    if(i < startPage){
      i = 1;
    } else if(i > numPages){
      break;
    }

    if (i == currentPage){
      isActive = "active";
      btnColor = "warning"
    }
    $('#pagination').append(`
    <button class="btn btn-${btnColor} page ml-1 numberedButtons" value="${i}">${i}</button>
    `)

    // $('#pagination').append(`
    // <button class="btn btn-${btnColor} page ml-1 numberedButtons ${isActive}" value="${i}">${i}</button>
    // `)
    // if (i == currentPage){
    //   $('#pagination').append(`
    //   <button class="btn btn-warning page ml-1 numberedButtons ${active}" value="${i}">${i}</button>
    //   `)
    // } else {
    //   $('#pagination').append(`
    //   <button class="btn btn-primary page ml-1 numberedButtons" value="${i}">${i}</button>
    //   `)
    // }
   }

   if (currentPage >= 1 && currentPage < numPages){
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage+1}">Next</button>
    `)
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 numberedButtons" value="${endPage}">Last</button>
    `)
   }
//      81                       81
   if (currentPage > 1 && currentPage <= 100){
    console.log(currentPage);
    $('#pagination').prepend(`
    <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage-1}">Prev</button>
    `)
    $('#pagination').prepend(`
    <button class="btn btn-primary page ml-1 numberedButtons" value="${startPage}">First</button>
    `)
    // console.log("bye");
   }
   

}

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  console.log(selected_pokemons);
  $('#pokeCards').empty()
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `)
  })
  
}



const updateTags =  async () => {
  // const types = res.data.types.map((type) => type.type.name)
  let response = await axios.get('https://pokeapi.co/api/v2/type');
  pokemonTypes = response.data.results;
  
  console.log(pokemonTypes);

  pokemonTypes.forEach(  function(type){
      $('#pokeTags').append(`
      <div class="form-check">
      <input class="form-check-input typeChecks" type="checkbox" id="${type.name}">
      <label class="form-check-label" for="${type.name}">${type.name}</label>
      </div>
      `)
    }
  )
}


const amountPokemon =  async () => {
  $('#pokeAmount').append(`${pokemonSelection.length}`)
  
}

const setup = async () => {
  // test out poke api using axios here
  amountPokemon();

  $('#pokeCards').empty()
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemons = response.data.results;


  paginate(currentPage, PAGE_SIZE, pokemons)
  const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
  updatePaginationDiv(currentPage, numPages)
  updateTags()



  // pop up modal when clicking on a pokemon card
  // add event listener to each pokemon card
  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    // console.log("types: ", types);
    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
  })

  // add event listener to pagination buttons
  
  $('body').on('click', ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value)
    if ($('.typeChecks').is(':checked')){
      paginateNewCards(currentPage, PAGE_SIZE, pokemonsList)
      var numberPages = Math.ceil(pokemonsList.length / PAGE_SIZE)
      updatePaginationDiv(currentPage, numberPages)
    } else {
    paginate(currentPage, PAGE_SIZE, pokemons)

    //update pagination buttons
    updatePaginationDiv(currentPage, numPages)
    }
  })

//////////////////////////////////////
const paginateNewCards = async (currentPage, PAGE_SIZE, thePokemons) => {
  $('#pokeAmount').empty()
  $('#pokeAmount').append(`${PAGE_SIZE} out of ${pokemonSelection.length}`)
    pokemonSelection = []
    thePokemons.forEach(function(pokemon) {
           let pokemonName = pokemon.pokemon.name;
           let pokemonUrl = pokemon.pokemon.url;

            // console.log('Pokemon Name:', pokemonName);
            // console.log('Pokemon URL:', pokemonUrl);

            pokemonSelection.push({
              name: pokemonName,
              url: pokemonUrl
            });
          });
          console.log(pokemonSelection.length)
          
  selected_pokemons = pokemonSelection.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  console.log(selected_pokemons);
  $('#pokeCards').empty()

  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `)
  })
  
}
//////////////////////////////////////

  $('body').on('change', ".typeChecks", async function (d) {
    // pokemonsList = []
    if ($(this).is(':checked')) {
      var checkboxId = $(this).attr('id');
      // console.log('Checkbox ID:', checkboxId);
      let response = await axios.get(`https://pokeapi.co/api/v2/type/${checkboxId}`);
      pokemonsList = response.data.pokemon;

      paginateNewCards(currentPage, PAGE_SIZE, pokemonsList)
      var numberPages = Math.ceil(pokemonsList.length / PAGE_SIZE)
      updatePaginationDiv(currentPage, numberPages)
      // let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    } else {
      let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
      pokemons = response.data.results;
      paginate(currentPage, PAGE_SIZE, pokemons)
    }
    
  })

////////////////////////////////////

$('body').on('change', ".typeChecks", async function (d) {
  var selectedTypes = []; // Array to store selected checkbox IDs

  // Loop through all checkboxes with class "typeChecks"
  $('.typeChecks').each(function() {//----
    if ($(this).is(':checked')) {
      var checkboxId = $(this).attr('id');

      selectedTypes.push(checkboxId); // Add selected checkbox ID to the array
    
    
    }
  });//----

  if (selectedTypes.length > 0) {
    // At least one checkbox is checked
    //  thispokemonsList = [];

    // Loop through selected types and make API requests for each type
    
    for (var i = 0; i < selectedTypes.length; i++) {
      var checkboxId = selectedTypes[i];
      console.log('Checkbox ID:', checkboxId);
      
      let response = await axios.get(`https://pokeapi.co/api/v2/type/${checkboxId}`);
      let pokemonTypeData = response.data.pokemon;
      
      // Extract pokemons from the type data and add them to the pokemonsList array
      thispokemonsList.push(...pokemonTypeData);
    }

    // Perform actions with the collected pokemonsList array
    paginateNewCards(currentPage, PAGE_SIZE, thispokemonsList);
    var numberPages = Math.ceil(thispokemonsList.length / PAGE_SIZE);
    updatePaginationDiv(currentPage, numberPages);
  } else {
    // No checkboxes are checked
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    pokemons = response.data.results;
    paginate(currentPage, PAGE_SIZE, pokemons);
  }
});
}




$(document).ready(setup)