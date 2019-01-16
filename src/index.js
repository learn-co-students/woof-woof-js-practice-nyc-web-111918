document.addEventListener("DOMContentLoaded", function(event) {
  const dogBar = document.querySelector("#dog-bar")
  const dogDisplay = document.querySelector("#dog-info")
  let goodnessButton = document.querySelector("#dog-summary-container")
  const dogFilter = document.querySelector("#good-dog-filter")

  const filterDiv = document.querySelector("#filter-div")
  const filterButton = document.querySelector("#good-dog-filter")
  console.log(filterButton.innerHTML.includes("OFF"));

  const fetchAllDoggies = function fetchAllDogs(){
    fetch('http://localhost:3000/pups')
    .then(r => r.json())
    .then(function(dogsJSON){ addToDogsBar(dogsJSON) })
  }()

  function addToDogsBar(dogsJSON){
    dogsJSON.forEach(function(dog){
      dogBar.innerHTML += `<span data-id= ${dog.id}>${dog.name}</span>`
    })
  }

  function renderDogInfo(dogObj){
    let dogGoodness;
    if(dogObj.isGoodDog){
      dogGoodness = "Good Dog!"
    } else {
      dogGoodness = "Bad Dog!"
    }
    dogDisplay.innerHTML =`
      <img src="${dogObj.image}">
      <h2>${dogObj.name}</h2>
      <button id="goodness-button" data-id=${dogObj.id} data-goodness= ${dogObj.isGoodDog}>${dogGoodness}</button>
    `
    goodnessButton = document.querySelector("#goodness-button")
  }

  dogBar.addEventListener("click", function(event){
    const dogId = event.target.dataset.id
    fetch(`http://localhost:3000/pups/${dogId}`)
      .then(r => r.json())
      .then(function(dogObj){ renderDogInfo(dogObj) })
  })

  goodnessButton.addEventListener("click", function(event){
    if (event.target.dataset.id){
      const dogid = event.target.dataset.id
      let dogStatus = event.target.dataset.goodness
      if (dogStatus === "false"){
        dogStatus = true
      } else {
        dogStatus = false
      }
      fetch(`http://localhost:3000/pups/${dogid}`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({isGoodDog: dogStatus})
      })
      .then(r => r.json())
      .then(function(dogObj) {renderDogInfo(dogObj)})
    }
  })

  dogFilter.addEventListener("click", function(event){
    let buttonHTML = event.target.innerHTML
    if (buttonHTML.includes("OFF")){
      event.target.innerHTML = "Filter good dogs: ON"


    } else if (buttonHTML.includes("ON")){
      event.target.innerHTML = "Filter good dogs: OFF"

    }
  })


});
