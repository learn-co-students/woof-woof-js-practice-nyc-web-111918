let ALLDOGS = []
const URL = `http://localhost:3000/pups`

document.addEventListener('DOMContentLoaded', () => {

  const dogContainer = document.querySelector("#dog-bar")
  const dogSummaryContainer = document.querySelector("#dog-summary-container")
  const goodDogFilter= document.querySelector("#good-dog-filter")

  fetch(URL)
  .then(r => r.json())
  .then(allDogsObj => {
    ALLDOGS = allDogsObj
    dogContainer.innerHTML = renderAllDogs(ALLDOGS)
  })

  document.body.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
      selectedDog = ALLDOGS.find((dog) => {return e.target.dataset.id == dog.id})
      dogSummaryContainer.innerHTML = dogShowMoreHTML(selectedDog)
    } else if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
      e.preventDefault()
      selectedDog = ALLDOGS.find((dog) => {return e.target.dataset.id == dog.id})
      selectedDog = !selectedDog.isGoodDog
      fetch(`${URL}/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Action: "application/json"
        },
        body: JSON.stringify({
          "isGoodDog": selectedDog
        })
      })
      .then(r => r.json())
      .then(updatedDogObj => {
        const oldDog = ALLDOGS.find((dog) => {return dog.id === updatedDogObj.id})
        const oldDogIndex = ALLDOGS.indexOf(oldDog)
        ALLDOGS[oldDogIndex] = updatedDogObj
        dogSummaryContainer.innerHTML = dogShowMoreHTML(updatedDogObj)
      })
    } else if (e.target.id === "good-dog-filter") {
      goodDogFilter.innerText = `Filter good dogs: ON`
      const filteredDogs = ALLDOGS.filter(function(dog) {
        (dog.isGoodDog === true)
      })
      ALLDOGS = filteredDogs
      dogContainer.innerHTML = renderAllDogs(ALLDOGS)
    }

  }) //End of Listener

}) //End of DOMLoad

renderAllDogs = () => {
  return ALLDOGS.map((dog) => dogNameHTML(dog)).join('')
}

const dogNameHTML = (dog) => {
  return `<span data-id="${dog.id}">${dog.name}</span>`
}

const dogShowMoreHTML = (selectedDog) => {
  let goodOrBadBoy = null
  if (selectedDog.isGoodDog) {
    goodOrBadBoy = "Good Dog!"
  } else {
    goodOrBadBoy = "Bad Dog!"
  }
  return ` <img src="${selectedDog.image}">
 <h2>${selectedDog.name}</h2>
 <button data-id="${selectedDog.id}">${goodOrBadBoy}</button>
  `
}
