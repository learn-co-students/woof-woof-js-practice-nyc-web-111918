document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded -- Squids')

  const dogURL = `http://localhost:3000/pups`
  const dogSummaryContainer = document.querySelector('#dog-summary-container')
  const dogInfo = document.querySelector('#dog-info')
  const filterDiv = document.querySelector('#filter-div')
  const goodDogButton = document.querySelector('#good-dog-filter')
  const dogBar = document.querySelector('#dog-bar')
  let allDogs = []
  let filterOn = false


  const dogFetch = (filterOn) => {fetch(dogURL)
    .then( response => response.json())

    .then( dogData => {dogBar.innerHTML = ""
      dogData.forEach( function(dog) {
      if (!filterOn) {
        dogBar.innerHTML += `
        <span data-id="${dog.id}">${dog.name}</span>`
      } else {
        console.log("filter On")
        if (dog.isGoodDog) {
          dogBar.innerHTML += `
        <span data-id="${dog.id}">${dog.name}</span>`
        }
      }




    })}
  )
  }

    dogFetch(filterOn)

    dogBar.addEventListener('click', function(e) {
      // console.log(e.target.dataset.id)
      //event delegation
      // we only want it to do something if the event target is a span
      if (e.target.tagName === 'SPAN') {
        // console.log('SPAN!')

        fetch(`${dogURL}/${e.target.dataset.id}`)
          .then( response => response.json() )
          .then( dog => {
            // console.log(dog)
            dogInfo.innerHTML = `
            <div data-id="${dog.id}">
              <img src=${dog.image} width="333" height="500">
              <h2>${dog.name}</h2>
              <button data-id=${dog.id} type="button"> ${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"} </button>`
              }
          )
      }
    }) // end of dogBar Event Listener

    dogInfo.addEventListener('click', function(e) {
      if (e.target.tagName === "BUTTON") {

        // e.target.innerHTML === "Good Dog!" ? e.target.innerHTML = "Bad Dog!" : e.target.innerHTML = "Good Dog!"
        const isGoodDog = e.target.innerText === "Good Dog!" ? false : true

        fetch(`${dogURL}/${e.target.dataset.id}`, {
          method: 'PATCH',
          body: JSON.stringify({isGoodDog: isGoodDog}),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then( response => response.json())
          .then( dog => {
            e.target.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
            console.log(dog)
          })
      }
    })

    goodDogButton.addEventListener('click', function(e) {
      e.target.innerText = e.target.innerText === 'Filter good dogs: OFF' ? 'Filter good dogs: ON': 'Filter good dogs: OFF'
      filterOn = e.target.innerText === 'Filter good dogs: OFF' ? false : true
      dogFetch(filterOn)
    }) // goodDogButton event Listener


}) // end of DOMContentLoaded
