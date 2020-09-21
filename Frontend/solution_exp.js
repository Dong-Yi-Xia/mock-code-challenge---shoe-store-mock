// When a user loads the page, they should be able to see a list of all the shoes in the sidebar and by default, have the first shoe rendered in the main container (see deliverable 2).

// * When a user clicks on one of the shoes in the sidebar, they should be able to see more details about the shoe, the reviews associated with it and a form in the main container. There should only be one shoe in the main container at one time.

// * When a user fills the form out and submits it, the review should get persisted in the backend and also be shown on the page, without refreshing. When you create a review for a given shoe, if you click on another shoe and you go back to your initial shoe, you should see the new review persist without refreshing.

const shoesURL = `http://localhost:3000/shoes`
const stableShoeSidebar = document.querySelector("ul#shoe-list")
const stableShoeTitle = document.querySelector(".card-title")
const stableShoeImage = document.querySelector("#shoe-image")
const stableShoeDescription = document.querySelector("#shoe-description")
const stableShoePrice = document.querySelector("#shoe-price")
const stableShoeReviews = document.querySelector("#reviews-list")
const stableFormContainer = document.querySelector("div#form-container")

fetch(shoesURL)
.then(response => response.json())
// when we're working with a single argument, we don't need to use the parantheses 
.then((shoesArray) => {
  renderFirstShoe(shoesArray)

  shoesArray.forEach((shoe) => {
    // this is where we get access to the current shoe instance
    // do SOMETHING to each shoe
    turnShoeIntoLi(shoe)
  })
})

let renderFirstShoe = (shoesArray) => {
  let firstShoe = shoesArray[0]

  mainShoe(firstShoe)
}

// we're passing in `shoe` as an argument so that we can have access to the specific shoe instance
let turnShoeIntoLi = (shoe) => {
  const shoeLi = document.createElement("li")
  shoeLi.innerText = shoe.name
  stableShoeSidebar.append(shoeLi)

  // adding an event listener on an unstable element
  shoeLi.addEventListener("click", (event) => {
    mainShoe(shoe)
  })
}

// same reason why we're passing in `shoe` as an argument
let mainShoe = (shoe) => {
  // updating elements on the DOM
  stableShoeTitle.innerText = shoe.name 
  stableShoeImage.src = shoe.image
  stableShoeDescription.innerText = shoe.description
  stableShoePrice.innerText = `$${shoe.price}.00`

  // stableShoeReviews.innerText = ""

  // you can also use a while loop to iterate over all the HTML elements and remove any remaining children elements
  // this is the preferred method!

  while (stableShoeReviews.firstChild) {
    stableShoeReviews.firstChild.remove()
  }

  turnReviewIntoLi(shoe)
  formAdd(shoe)
}

let turnReviewIntoLi = (shoe) => {
  if (shoe.reviews.length > 0) {
    // iterating through each review for a shoe, and creating new HTML elements
    shoe.reviews.forEach((review) => {
      const reviewLi = document.createElement("li")
      reviewLi.innerText = review.content
      stableShoeReviews.append(reviewLi)
    })
  }
}

let formAdd = (shoeSelected) => {
  while (stableFormContainer.firstChild) {
    stableFormContainer.firstChild.remove()
  }

  let formHTML = document.createElement("form")
      formHTML.id = "new-review"

  let formDiv = document.createElement("div")
      formDiv.className = "form-group"

  let formTextArea = document.createElement("textarea")
      formTextArea.className = "form-control"
      formTextArea.id = "review-content"
      formTextArea.rows = "3"

  let formInput = document.createElement("input")
      formInput.className = "btn-primary"
      formInput.type = "submit"

  formDiv.append(formTextArea, formInput)
  formHTML.append(formDiv)
  stableFormContainer.append(formHTML)

  // adding an event listener on an unstable element
  formHTML.addEventListener("submit", (event) => {
    // stop the page from refreshing
    event.preventDefault()

    // saving the user's input as a variable
    let reviewContent = formTextArea.value

    // POST `http://localhost:3000/shoes/${shoe_id}/reviews`
    
    fetch(`${shoesURL}/${shoeSelected.id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: reviewContent
      })
    })
    .then(response => response.json())
    .then((reviewObject) => {
      // 3 things to update: the backend, the DOM, the object in memory
      // the fetch request is updating the backend

      // update the object in memory
      // the shoe instance BEFORE the form submission and AFTER the form submission needs to be consistent
      shoeSelected.reviews.push(reviewObject)

      // update the DOM
      // create a new <li> for this review
      // append the new review element to the reviews list

      const reviewLi = document.createElement("li")
      reviewLi.innerText = reviewObject.content
      stableShoeReviews.append(reviewLi)
    })
  })
}