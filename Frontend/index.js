// Code your solution here
const url = 'http://localhost:3000/shoes'

const shoeUL = document.querySelector("ul#shoe-list")
const shoeIMG = document.querySelector("img.card-img-top")
const shoeTitle = document.querySelector("h4#shoe-name")
const shoeDescription = document.querySelector("p#shoe-description")
const shoePrice= document.querySelector("small#shoe-price")

const reviewsUL = document.querySelector("ul#reviews-list")
const formContainer = document.querySelector("div#form-container")



fetch(url)
.then(r => r.json())
.then(shoesObj => {
    firstShoe(shoesObj)
    shoesObj.forEach(shoeObj => {
        turnObjtoHTML(shoeObj)
    })
})

function turnObjtoHTML(shoeObj){
    //create Shoe List
    let shoeLI = document.createElement("li")
    shoeLI.id = shoeObj.id
    shoeLI.innerText = shoeObj.name
    shoeLI.style.cursor = "pointer"
    changeColor(shoeLI)
    shoeUL.append(shoeLI)

    //fetch individual shoe on Click
    shoeLI.addEventListener("click", (evt)=>{
        fetch(url+`/${shoeObj.id}`) 
        .then(r => r.json())
        .then(currentObj => {
            //single shoe
            shoeIMG.src = currentObj.image
            shoeTitle.innerText = currentObj.name
            shoeDescription.innerText = currentObj.description
            shoePrice.innerText = "$" + currentObj.price

            addingReview(currentObj)

            reviewForm(currentObj)

        })
    })

}   


//_________________________________________________

function firstShoe(shoeArr) {
    let firstShoe = shoeArr[0]

    shoeIMG.src = firstShoe.image
    shoeTitle.innerText = firstShoe.name
    shoeDescription.innerText = firstShoe.description
    shoePrice.innerText = "$" + firstShoe.price

    addingReview(firstShoe)
    reviewForm(firstShoe)
}


function changeColor(ele){
    ele.addEventListener("mouseenter", (evt)=> {
        evt.target.style.color = "blue"
    })
    ele.addEventListener("mouseleave", (evt)=> {
        evt.target.style.color = "black"
    })
}


function addingReview(shoe){
    reviewsUL.innerText = ""
    let reviewsArr = shoe.reviews
    reviewsArr.forEach(review => {
        addNewReview(review)
    })
}

function addNewReview(review){
    let reviewLI = document.createElement("li")
    reviewLI.innerText = review.content
    reviewsUL.append(reviewLI)
}

function reviewForm(shoe){
    while (formContainer.firstChild) {
        formContainer.firstChild.remove()
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
      formContainer.append(formHTML)

      
      formHTML.addEventListener("submit", (evt) => {
        evt.preventDefault()
        let reviewContent = formTextArea.value
        fetch(url+`/${shoe.id}/reviews`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              content: reviewContent
            })
        })
        .then(r => r.json())
        .then(updateReview => {
            shoe.reviews.push(updateReview)
            addNewReview(updateReview)
            formHTML.reset()
        })
      })

}