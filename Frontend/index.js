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
            shoeIMG.src = currentObj.image
            shoeTitle.innerText = currentObj.name
            shoeDescription.innerText = currentObj.description
            shoePrice.innerText = "$" + currentObj.price

            //reviews list 
            let reviewsArr = currentObj.reviews
            reviewsArr.forEach(review => {
                logReview(review)
            })

            function logReview(review){
                let reviewLI = document.createElement("li")
                reviewLI.innerText = review.content
                // reviewLI.setAttribute("style", "list-style-type:none;" )
                reviewsUL.append(reviewLI)
            }
        
            //formBox on top of Review, using a fetch patch
            let formBox = document.createElement('form')
            
            formContainer.append(formBox) 

            currentObj.reviews.push(userInput)
            fetch(url+ `/${currentObj.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    review: currentObj.reviews
                })
            })




        })
    })





}   





//_________________________________________________

function changeColor(ele){
    ele.addEventListener("mouseenter", (evt)=> {
        evt.target.style.color = "blue"
    })
    ele.addEventListener("mouseleave", (evt)=> {
        evt.target.style.color = "black"
    })
}