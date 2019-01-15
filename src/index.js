document.addEventListener('DOMContentLoaded', function() {

  DOGS = []

  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const goodDogButton = document.querySelector('#good-dog-filter')

  fetch ('http://localhost:3000/pups')
    .then(r => r.json())
    .then(obj => {
      obj.forEach(function (dog) {
        DOGS.push(dog)
        dogBar.innerHTML += `
        <span data-id="${dog.id}"class="dog-button">${dog.name}</span>
        `
      })
    })


  dogBar.addEventListener('click', () => {
    if (event.target.className === 'dog-button') {
      const clickedDog = DOGS.find(dog => event.target.dataset.id == dog.id)
      dogInfo.innerHTML = `
      <img src='${clickedDog.image}'>
      <h2 data-id="${clickedDog.id}">${clickedDog.name}</h2>
      `
      if (clickedDog.isGoodDog) {
        dogInfo.innerHTML += `
        <button>Good Dog!</button>
        `
      } else {
        dogInfo.innerHTML += `
        <button>Bad Dog!</button>
        `
      }
    }
  })

    dogInfo.addEventListener('click', () => {
      if (event.target.tagName === "BUTTON") {
        const clickedDog = DOGS.find(dog => event.target.parentElement.querySelector('h2').dataset.id == dog.id)
        fetch(`http://localhost:3000/pups/${clickedDog.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accepted: "application/json"
          },
          body: JSON.stringify({
            isGoodDog: !clickedDog.isGoodDog
          })
        })
        .then(r => r.json())
        .then(obj => {
          const objIndex = DOGS.findIndex(el => el.id === obj.id)
          DOGS[objIndex].isGoodDog = obj.isGoodDog
          dogInfo.innerHTML = `
          <img src='${obj.image}'>
          <h2 data-id="${obj.id}">${obj.name}</h2>
          `
          if (obj.isGoodDog) {
            dogInfo.innerHTML += `
            <button>Good Dog!</button>
            `
          } else {
            dogInfo.innerHTML += `
            <button>Bad Dog!</button>
            `
          }
        })
      }
    })


    goodDogButton.addEventListener('click', () => {
      if (goodDogButton.innerText === "Filter good dogs: OFF") {
        goodDogButton.innerText = "Filter good dogs: ON"
        const filteredDogs = DOGS.filter(dog => dog.isGoodDog ===true)
        dogBar.innerHTML = ""
        filteredDogs.forEach((dog) => {
          dogBar.innerHTML += `
          <span data-id="${dog.id}"class="dog-button">${dog.name}</span>
          `
        })
      } else {
        goodDogButton.innerText = "Filter good dogs: OFF"
        dogBar.innerHTML = ""
        DOGS.forEach((dog) => {
          dogBar.innerHTML += `
          <span data-id="${dog.id}"class="dog-button">${dog.name}</span>
          `
        })
      }
    })




}) //end of ContentLoaded
