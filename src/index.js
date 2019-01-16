document.addEventListener("DOMContentLoaded", function(e){
  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const goodDogButton = document.querySelector('#good-dog-filter')

  fetch('http://localhost:3000/pups')
    .then(function(res){
      return res.json()
    })
    .then(function(pups){
      pups.forEach(function(pup){
        dogBar.innerHTML += `
        <span class="dog-name" data-id=${pup.id} >${pup.name}</span>
        `
      })
    })

  dogBar.addEventListener("click", function(e){
    const pupID = e.target.dataset.id
    if (e.target.className === "dog-name") {
      fetch(`http://localhost:3000/pups/${pupID}`)
        .then(function(res){
          return res.json()
        })
        .then(function(pup){
          let buttonText;
          if (pup.isGoodDog === true) {
            buttonText = "Good Dog!"
          } else {
            buttonText = "Bad Dog!"
          }


          dogInfo.innerHTML = `
            <img src=${pup.image}>
            <h2>${pup.name}</h2>
            <button data-class="dog-button" data-id=${pup.id}>${buttonText}</button>
          `
        })
      }
    })

    dogInfo.addEventListener("click", function(e){
      let toggleBoolean
      if (e.target.dataset.class === "dog-button") {
        if (e.target.innerHTML === "Good Dog!") {
          e.target.innerHTML = "Bad Dog!"
          toggleBoolean = false
        } else {
          e.target.innerHTML = "Good Dog!"
          toggleBoolean = true
        }

        fetch(`http://localhost:3000/pups/${e.target.dataset.id}`, {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify ({
            "isGoodDog": toggleBoolean
          })

        })
        .then (res =>{
          fetch('http://localhost:3000/pups')
          .then(function(res){
            return res.json()
          })
          .then(function(pups){
            if (goodDogButton.innerHTML === "Filter good dogs: ON") {
              dogBar.innerHTML = ""
              pups.forEach(function(pup){
                if (pup.isGoodDog === true) {
                  dogBar.innerHTML += `
                  <span class="dog-name" data-id=${pup.id} >${pup.name}</span>
                  `
                }
              })
            }
          })
        })
      }
    })

    goodDogButton.addEventListener("click", function(e){
      if (e.target.innerHTML === "Filter good dogs: OFF") {
        e.target.innerHTML = "Filter good dogs: ON"
        fetch('http://localhost:3000/pups')
          .then(function(res){
            return res.json()
          })
          .then(function(pups){
            dogBar.innerHTML = ""
            pups.forEach(function(pup){
              if (pup.isGoodDog === true) {
                dogBar.innerHTML += `
                <span class="dog-name" data-id=${pup.id} >${pup.name}</span>
                `
              }
            })
          })
      } else {
        e.target.innerHTML = "Filter good dogs: OFF"

        fetch('http://localhost:3000/pups')
          .then(function(res){
            return res.json()
          })
          .then(function(pups){
            dogBar.innerHTML = ""
            pups.forEach(function(pup){
              dogBar.innerHTML += `
              <span class="dog-name" data-id=${pup.id} >${pup.name}</span>
              `
            })
          })
      }
    })





})
