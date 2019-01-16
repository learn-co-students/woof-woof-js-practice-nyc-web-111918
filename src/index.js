let allPups = []
let pupData

document.addEventListener('DOMContentLoaded', () => {

  const dogBar = document.querySelector("#dog-bar")
  const dogInfo = document.querySelector("#dog-info")
  const filterButton = document.querySelector("#good-dog-filter")


  function renderDogBar() {
    return fetch('http://localhost:3000/pups')
      .then( resp => resp.json())
      .then( pups => {
        allPups = pups
        dogBar.innerHTML = ""
        pups.map( pup => {
          dogBar.innerHTML += `<span align="center" id=${pup.id}>${pup.name}</span>`
        })
      })
  }
  renderDogBar();


  dogBar.addEventListener("click", e => {
    pupData = allPups.find( (pup) => {
      return pup.id == e.target.id
    })
    if (e.target.id) {
      let isGood = ''
      pupData.isGoodDog ? isGood = "Good Dog!" : isGood = "Bad Dog!"
      dogInfo.innerHTML = `
      <img src=${pupData.image}>
      <h2>${pupData.name}</h2>
      <button data-id=${pupData.id} class="button">${isGood}</button>`
    }
  })

  dogInfo.addEventListener("click", e => {
    let goodOrBad
    if (e.target.dataset.id == pupData.id) {
      if (e.target.innerText.includes("Good")) {
        e.target.innerText = "Bad Dog!";
        goodOrBad = false;
      } else if (e.target.innerText.includes("Bad")) {
        e.target.innerText = "Good Dog!";
        goodOrBad = true;
      }
      renderDogBar()
      filterButton.innerText = "Filter good dogs: OFF"

      fetch(`http://localhost:3000/pups/${pupData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          "isGoodDog": goodOrBad
        })
      })
      .then( resp => renderDogBar() )
    }
  })


  // Filter Deliverable


  filterButton.addEventListener("click", e => {
    if (e.target.innerText.includes("OFF")) {
      e.target.innerText = "Filter good dogs: ON"
      const goodPups = allPups.filter( pup => {
        return pup.isGoodDog === true
      })
      dogBar.innerHTML = ""
      goodPups.map( pup => {
        dogBar.innerHTML += `<span align="center" id=${pup.id}>${pup.name}</span>`
      })
    } else if (e.target.innerText.includes("ON")) {
      e.target.innerText = "Filter good dogs: OFF"
      dogBar.innerHTML = renderDogBar()
    }
  })

}) // END of DOMContentLoaded

  //   const button = dogBar.querySelector('.button')
  //
