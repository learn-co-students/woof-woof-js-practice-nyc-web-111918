document.addEventListener("DOMContentLoaded", function(event) {
  const dogContainer = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const filterContainer = document.querySelector('#filter-div')
  const filterBtn = document.querySelector("#good-dog-filter")
  let allDogs;
  let divOfDogs;
  let goodDogs;

  renderDogs()

  function renderDogs(){
    fetch(`http://localhost:3000/pups`)
    .then(r => r.json())
    .then(json => {
      allDogs = json
      divOfDogs = allDogs.map(dog => `<span data-id='${dog.id}'>${dog.name}</span>`);
      dogContainer.innerHTML = divOfDogs.join("");
    })
  }

  function fetchGoodDogs(){
    if(filterBtn.innerHTML === "Filter good dogs: ON"){
      fetch(`http://localhost:3000/pups`)
      .then(r => r.json())
      .then(json => {
        allDogs = json
        goodDogs = allDogs.filter(dog => dog.isGoodDog === true)
        divOfDogs = goodDogs.map(dog => `<span data-id='${dog.id}'>${dog.name}</span>`);
        dogContainer.innerHTML = divOfDogs.join("");
      })
    }
  }

  dogContainer.addEventListener('click', (e)=> {
    if(e.target.tagName === "SPAN"){
      let foundDog = allDogs.find(dog => dog.id == e.target.dataset.id)
      let goodDogBtn;
      foundDog.isGoodDog === true ? goodDogBtn = "Good Dog!" : goodDogBtn = "Bad Dog!"

      dogInfo.innerHTML =
        `<img src=${foundDog.image}>
        <h2>${foundDog.name}</h2>
        <button data-id=${foundDog.id}>${goodDogBtn}</button>`
    }
  });

  dogInfo.addEventListener('click', (e) => {

    if(e.target.tagName === "BUTTON"){
      fetchGoodDogs()
      let button;
      if(e.target.innerHTML === "Good Dog!"){
        e.target.innerHTML = "Bad Dog!";
        button = false;
      } else {
        e.target.innerHTML = "Good Dog!";
        button = true;
      }

      fetch(`http://localhost:3000/pups/${e.target.dataset.id}`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Action": "application/json"
        },
        body: JSON.stringify(
          {isGoodDog: button}
        ),
      })
      .then(r => r.json())
      .then(json => console.log(json))
    }
    fetchGoodDogs()
  });

  filterContainer.addEventListener('click', (e) => {
    if(e.target.innerHTML === "Filter good dogs: OFF"){
      e.target.innerHTML = "Filter good dogs: ON"
      fetchGoodDogs()
    } else {
      e.target.innerHTML = "Filter good dogs: OFF"
      renderDogs()
    }
  });
});
