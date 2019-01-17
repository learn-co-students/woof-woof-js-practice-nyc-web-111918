let puppyArray = []
document.addEventListener('DOMContentLoaded', ()=>{

  const dogBar = document.querySelector("#dog-bar")
  const dogSummary = document.querySelector("#dog-summary-container")
  const dogInfoDiv = document.querySelector("#dog-info")
  const filterDiv = document.querySelector("#filter-div")


  fetch('http://localhost:3000/pups', {
    method: "GET"
  })
    .then((res)=>{
      return res.json()
  }).then((pups)=>{
    puppyArray = pups

      dogBar.innerHTML = mapPupsForSpan(pups);
      // console.log("testing", mapPupsForInfo(pups));
      // dogSummary.innerHTML += mapPupsForInfo(pups)
  })

  //***************************************
// When you click on the span, it'll display the info for the dog in the dogInfoDiv

  dogBar.addEventListener("click",(e)=>{
    // console.log(e.target.dataset.id);
    // debugger
    const oneLonePup = puppyArray.find((pup)=>{
      return pup.id == e.target.dataset.id
    })
    if (e.target.dataset.id == oneLonePup.id){
      return dogInfoDiv.innerHTML = pupInfo(oneLonePup)
    }
    //when clicked, changes the innerhtml of the dogInfoDiv

  })//end of dog bar span event listener


  //***************************************
  function mapPupsForSpan(pupsArray){
    return pupsArray.map((pup)=>{
      return spanPup(pup)
    }).join("")
  }

  function spanPup (pup){
    return `<span data-id=${pup.id}>${pup.name}</span>`
  }

  function mapPupsForInfo(pupsArray){
    return pupsArray.map((pup)=>{
      return pupInfo(pup)
    }).join("")
  }


  function pupInfo(pup){
    if (pup.isGoodDog === true){
      return `<img height="300" src= ${pup.image}>
      <h2>${pup.name}</h2>
      <br>
      <button data-button-id=${pup.id}>Good Dog!</button>`
    }else{
      return `<img height="300" src= ${pup.image}>
      <h2>${pup.name}</h2>
      <br>
      <button data-button-id=${pup.id}>Bad Dog!</button>`
    }
  }

  //want to create a function that will TOGGLE good dog when
  // the user clicks the good dog/bad dog button
  // - an event listener on the dog info
  // this will be a patch request to make the value of isGoodDog=true/false
  dogInfoDiv.addEventListener("click", (e)=>{
    const myGoodPup = puppyArray.find((pup)=>{
      return pup.id == e.target.dataset.buttonId
    })
    if (myGoodPup.isGoodDog === true){
      fetch(`http://localhost:3000/pups/${myGoodPup.id}`,{
        method: "PATCH",
        headers: {
          "Content-Type": 'application/json',
          Accept: 'application/json'
        },
        body:JSON.stringify({
          isGoodDog: false
        })//end of stringify
      })//end of fetch
      .then((res) => {
        return res.json()
      })// end of first then
      .then((updatedDog) => {
        console.log(updatedDog);
        return dogInfoDiv.innerHTML = pupInfo(updatedDog)
      })//end of 2nd then
    }//end of if
    else if (myGoodPup.isGoodDog === false){
      fetch(`http://localhost:3000/pups/${myGoodPup.id}`,{
        method: "PATCH",
        headers: {
          "Content-Type": 'application/json',
          Accept: 'application/json'
        },
        body:JSON.stringify({
          isGoodDog: true
        })//end of stringify
      })//end of fetch
      .then((res) => {
        return res.json()
      })// end of first then
      .then((updatedDog) => {
        return dogInfoDiv.innerHTML = pupInfo(updatedDog)
      })//end of 2nd then
    }//end of else if
  })//end of toggle attribute event listener
  //************* should try refactoring this using the ternary conditional operator in the body of the fetch


// FILTER GOOD DOGS
// when this button is clicked, we want to change the dog bar to display only the dogs whose isGoodDog attribute is true

//first, want to filter good dogs
  filterDiv.addEventListener("click", (e)=>{
    const filterGoodDogs = document.querySelector("#good-dog-filter")
    if(e.target === filterGoodDogs){
      if (filterGoodDogs.innerText.includes("OFF")){
        filterGoodDogs.innerText = "Filter good dogs: ON"

        const filteredDoggos = puppyArray.filter((pup)=>{
          return pup.isGoodDog === true
        })

        return dogBar.innerHTML = mapPupsForSpan(filteredDoggos);

      }else if(filterGoodDogs.innerText.includes("ON")){
        filterGoodDogs.innerText = "Filter good dogs: OFF"
        // and display all dogs as usual
        return dogBar.innerHTML = mapPupsForSpan(puppyArray)
      }
    }



  })


})//end of DOMContentLoaded event listener
