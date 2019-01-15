document.addEventListener("DOMContentLoaded", function(){
const dogBar = document.querySelector('#dog-bar');
const dogDisplay = document.querySelector('#dog-info');
const goodDogFilter = document.querySelector('#good-dog-filter');
const allGoodDoggos = document.querySelector('#all-good-doggo');
let allPups = [];

  function getFetch(){
    fetch('http://localhost:3000/pups')
    .then(r => r.json())
    .then((r) => {
      allPups = r;
      renderPups(r)
    })
  }
  getFetch()
//helper methods
  function pupSpan(pup){
  return `<span align="center" data-id="${pup.id}">${pup.name}</span>`
  }

  function pupDisplay(pup){
    let goodDoggo = '';
    pup.isGoodDog ? goodDoggo = 'Good Dog!' : goodDoggo = 'Bad Dog!'
    return `<img src=${pup.image}><h2>${pup.name}</h2><button data-doggo="${pup.id}">${goodDoggo}</button>`;
  }

  function pupBadDoggo(pup){
    pup.isGoodDog = !pup.isGoodDog;
    return pupDisplay(pup)
  }

  function renderPups(array){
    // allPups = array;
    dogBar.innerHTML = '';
    array.forEach(function(pup){
      dogBar.innerHTML += pupSpan(pup)
    })
  }

  dogBar.addEventListener('click', function(e){
    if(e.target.dataset.id){
      allPups.forEach(function(pup){
        if (pup.id == e.target.dataset.id){
          dogDisplay.innerHTML = pupDisplay(pup);
        }
      })
    }
  }) // end of dogbar span event listener

  dogDisplay.addEventListener('click', function(e){
    if(e.target.dataset.doggo){
      allPups.forEach(function(pup){
        if (pup.id == e.target.dataset.doggo){
          fetch(`http://localhost:3000/pups/${e.target.dataset.doggo}`,{
            method: 'PATCH',
            headers:
            {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              name: pup.name,
              image: pup.image,
              isGoodDog: !pup.isGoodDog
            })
          })
          .then(r => r.json())
          .then((r) => {
            for (let i in allPups){
              allPups[i].id == r.id ? allPups[i] = r :'';
             }
             if (goodDogFilter.innerText === 'Filter good dogs: OFF'){
               dogDisplay.innerHTML = ''
               dogDisplay.innerHTML = pupDisplay(r)
             } else if(goodDogFilter.innerText === 'Filter good dogs: ON' && !r.isGoodDog){
               const filteredDoggo = allPups.filter(function(pup){
                 return pup.isGoodDog
               })
               dogDisplay.innerHTML = ''
               dogBar.innerHTML = ''
               renderPups(filteredDoggo)
             }
          })
        }
      })
    }
  }) // end of dog display good doggo event listener

goodDogFilter.addEventListener('click', function(e){
    fetch('http://localhost:3000/pups')
    .then(r => r.json())
    .then((r) => {
      if (goodDogFilter.innerText === 'Filter good dogs: OFF'){
        dogDisplay.innerHTML = ''
        const filteredDoggo = r.filter(function(pup){
          return pup.isGoodDog
        })
        if (filteredDoggo.length === 0){
          goodDogFilter.innerText = 'Filter good dogs: ON';
          renderPups(filteredDoggo)
        } else {
          renderPups(filteredDoggo)
        goodDogFilter.innerText = 'Filter good dogs: ON';
        }
      } else {
        dogDisplay.innerHTML = ''
        renderPups(r)
        e.target.innerText = 'Filter good dogs: OFF';
      }
  })
}) // end of goodDogFilter event listener

allGoodDoggos.addEventListener('click', function(e){
  allPups.forEach(function(pup){
    // console.table(allPups)
    pup.isGoodDog = true;
    fetch(`http://localhost:3000/pups/${pup.id}`,{
      method: 'PATCH',
      headers:
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: pup.isGoodDog
      })
    })
    .then(r => r.json())
    .then((r) => {
      for (let i in allPups){
      allPups[i].id == r.id ? allPups[i] = r :'';
    }
  })
})
renderPups(allPups)
})



})// end of dom content loaded
