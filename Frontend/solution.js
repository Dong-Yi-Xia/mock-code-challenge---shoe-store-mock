// When a user loads the page, they should be able to see a list of all the shoes in the sidebar and by default, have the first shoe rendered in the main container (see deliverable 2).

// * When a user clicks on one of the shoes in the sidebar, they should be able to see more details about the shoe, the reviews associated with it and a form in the main container. There should only be one shoe in the main container at one time.

// * When a user fills the form out and submits it, the review should get persisted in the backend and also be shown on the page, without refreshing. When you create a review for a given shoe, if you click on another shoe and you go back to your initial shoe, you should see the new review persist without refreshing.

const shoesURL = `http://localhost:3000/shoes`
const shoesList = document.querySelector("ul#shoe-list")
const shoeImage = document.querySelector("img#shoe-image")
const shoeName = document.querySelector("h4#shoe-name")
const shoeDescription = document.querySelector("p#shoe-description")
const shoePrice = document.querySelector("small#shoe-price")
const reviewsList = document.querySelector("ul#reviews-list")
const formContainer = document.querySelector("div#form-container")

fetch(shoesURL)
.then(r => r.json())
.then((shoesArray) => {
  renderFirstShoe(shoesArray)
  shoesArray.forEach((shoe) => {
    turnShoeIntoLi(shoe)
  })
})

let turnShoeIntoLi = (shoe) => {
  let shoeLi = document.createElement("li")
  shoeLi.innerText = shoe.name 
  shoesList.append(shoeLi)

  shoeLi.addEventListener("click", (event) => {
    renderShoeInfo(shoe)
    createAllReviews(shoe)
    createReviewForm(shoe)
  })
}

let renderFirstShoe = (shoesArray) => {
  let firstShoe = shoesArray[0]

  renderShoeInfo(firstShoe)
  createAllReviews(firstShoe)
  createReviewForm(firstShoe)
}

let renderShoeInfo = (shoe) => {
  shoeImage.src = shoe.image
  shoeName.innerText = shoe.name
  shoeDescription.innerText = shoe.description
  shoePrice.innerText = `$${shoe.price}.00`
}

let createAllReviews = (shoe) => {
  reviewsList.innerHTML = ""

  if (shoe.reviews.length > 0) {
    shoe.reviews.forEach((review) => {
      createNewReview(review)
    })
  }
}

let createNewReview = (review) => {
  let reviewLi = document.createElement("li")
  reviewLi.innerText = review.content 
  reviewsList.append(reviewLi)
}

let createReviewForm = (shoe) => {
  formContainer.innerHTML = ""

  let inputField = document.createElement("input")
  inputField.type = "text"
  inputField.placeholder = "review content"

  let submitButton = document.createElement("button")
  submitButton.innerText = "submit"

  formContainer.append(inputField, submitButton)

  submitButton.addEventListener("click", (event) => {
    let newReviewContent = inputField.value
 
    fetch(`${shoesURL}/${shoe.id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: newReviewContent
      })
    })
    .then(r => r.json())
    .then((newReview) => {
      shoe.reviews.push(newReview)
      createNewReview(newReview)
    })
  })
}