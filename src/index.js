document.addEventListener('DOMContentLoaded', () => {

  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const dogFilter = document.querySelector('#good-dog-filter')
  let allPups = []

  function htmlBuilder(pup){
    return `
    <span data-id="${pup.id}">${pup.name}</span>
    `
  }

  function addToDogBar(pups){
    pups.forEach(function(pup){
      dogBar.innerHTML += htmlBuilder(pup)
      allPups.push(pup)
    })
  }

  function findPupByID(num){
    num = +num
    return allPups.find(function(pup){
      if(pup.id === num){
        return pup
      }
    })
  }

  function goodOrBadDog(pup){
    if(pup.isGoodDog){
      return 'Good Dog!'
    } else{
      return 'Bad Dog!'
    }
  }

  function showPup(num){
    let pup = findPupByID(num)
    dogInfo.innerHTML = `
    <img src= "${pup.image}">
    <h2>"${pup.name}"</h2>
    <button id="${num}">${goodOrBadDog(pup)}</button>
    `
  }

  function toggleGoodBad(num){
    let pup = findPupByID(num)
    pup.isGoodDog = !pup.isGoodDog
    showPup(num)
  }

  fetch('http://localhost:3000/pups')
  .then(rev => rev.json())
  .then(pups => addToDogBar(pups))

  dogBar.addEventListener('click', () => {

    if(event.target.tagName === 'SPAN'){
      showPup(event.target.dataset.id)
    }
  })

  dogInfo.addEventListener('click', () => {

    if(event.target.tagName === 'BUTTON'){
      let num = event.target.id
      toggleGoodBad(num)
      let pup = findPupByID(num)
      pup.isGoodDog


      fetch(`http://localhost:3000/pups/${event.target.id}`,{
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json"
        },
        body: JSON.stringify({
          "isGoodDog": pup.isGoodDog
        })
      })
    }
  })

  dogFilter.addEventListener('click', () => {
    if(event.target.innerHTML === 'Filter good dogs: OFF'){
      dogFilter.innerHTML = 'Filter good dogs: ON'
      dogBar.innerHTML = ''
      const  goodPups = allPups.filter(pup => pup.isGoodDog === true)
      goodPups.forEach(pup => dogBar.innerHTML += htmlBuilder(pup))
    }else {
        dogFilter.innerHTML = 'Filter good dogs: OFF'
        dogBar.innerHTML = ''
        allPups.forEach(function(pup){ dogBar.innerHTML += htmlBuilder(pup)})
    }
  })






})
