document.addEventListener("DOMContentLoaded", () => {
  const dogInfo = document.querySelector("#dog-info")
  const dogBar = document.querySelector("#dog-bar")
  const filterButton = document.querySelector("#good-dog-filter")
  let DOGS = []
  let isGoodDog = true
  let fetchMode = 'OFF'

//Initial FETCH
  const fetchDogs = (mode) => {
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(dogs => {
      DOGS = []
      dogBar.innerHTML = ''
        dogs.forEach(function(dog){
          DOGS.push(dog)
          if (mode === 'GOOD'){
            if (dog.isGoodDog === true){
              dogBar.innerHTML += `
                <span data-id=${dog.id} class="dog-span">${dog.name}</span>
              `
            }
          } else {
              dogBar.innerHTML += `
                <span data-id=${dog.id} class="dog-span">${dog.name}</span>
                `
          }
        })
    })
  }
  fetchDogs('ALL')

//LISTENERS
  dogBar.addEventListener("click", function(event){
    if (event.target.classList.contains("dog-span")){
      let dogAffinity = ""
      const foundDog = DOGS.find(function(dog){
        return dog.id == event.target.dataset.id
      })
      if (foundDog.isGoodDog === true) {
        dogAffinity = "Good Dog!"
      } else {
        dogAffinity = "Bad Dog!"
      }
      dogInfo.innerHTML = `
        <div class="card">
          <h2>${foundDog.name}</h2>
          <img src="${foundDog.image}"/><br>
          <button data-id=${foundDog.id} class="good-or-bad-btn">${dogAffinity}</button>
        </div>
      `
    }
  })  // End of display dog info listener

  dogInfo.addEventListener("click",function(event){
    if (event.target.classList.contains("good-or-bad-btn")){
      let dogAffinity = ""
      const foundDog = DOGS.find(function(dog){
        return dog.id == event.target.dataset.id
      })
      foundDog.isGoodDog = !foundDog.isGoodDog
      if (foundDog.isGoodDog === true) {
        dogAffinity = "Good Dog!"
      } else {
        dogAffinity = "Bad Dog!"
      }
      //Update DOM
      dogInfo.innerHTML = `
        <div class="card">
          <h2>${foundDog.name}</h2>
          <img src="${foundDog.image}"/><br>
          <button data-id=${foundDog.id} class="good-or-bad-btn">${dogAffinity}</button>
        </div>
      `
      //Update DB
      fetch(`http://localhost:3000/pups/${foundDog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
           Accept: "application/json"
        },
        body: JSON.stringify({
          "id": foundDog.id,
          "name": foundDog.name,
          "isGoodDog": foundDog.isGoodDog,
          "image":  foundDog.image
        })
      })
      .then(res => res.json())
      .then(dog => {
      })
      //Update local variables
      .then(fetchDogs(fetchMode))
    }
  })  // End of toggle good dog listener

  filterButton.addEventListener("click", function(event){
    if(event.target.innerText.includes("OFF")){
      event.target.innerText = "Filter good dogs: ON"
      fetchMode = 'GOOD'
      fetchDogs(fetchMode)
    } else {
      event.target.innerText = "Filter good dogs: OFF"
      fetchMode = 'ALL'
      fetchDogs(fetchMode)
    }
  })  // End of filter button listener



//HELPERS



}) // End of DOMContentLoaded
