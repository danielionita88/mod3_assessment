document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4068 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`
  
  const imgEl = document.getElementById('image')
  const nameEl = document.getElementById('name')
  const likesEl = document.getElementById('likes')
  const likeBtn = document.getElementById('like_button')
  const commentEl = document.getElementById('comments')
  const commentForm = document.getElementById('comment_form')
  const formInput = document.getElementById('comment_input')

  fetch(imageURL)
  .then(resp => resp.json())
  .then(image => renderImage(image))


  function renderImage(image){
    imgEl.src = image.url
    imgEl.dataset.id = image.id
    nameEl.innerText = image.name
    likesEl.innerText = image.like_count
    
    image.comments.forEach(comment => addComment(comment))
  }
  
  function addComment(comment) {
    const liEL = document.createElement('li')
    liEL.id = comment.id
    liEL.innerHTML= `${comment.content} <button data-id=${comment.id} > X </button>` 
    liEL.setAttribute('image_id', `${comment.image_id}`)
    commentEl.appendChild(liEL)
  }

  
  likeBtn.addEventListener('click', function(e){
    likesEl.innerText = parseInt(likesEl.innerText) + 1

    const reqObj = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        image_id: e.target.parentElement.firstElementChild.dataset.id
      })
    }
    
    
    fetch(likeURL,reqObj )
  })

  commentForm.addEventListener('click', function(e){
    e.preventDefault()
    if (e.target.value === 'Submit'){

      const formData = {
        image_id: e.target.parentElement.parentElement.firstElementChild.dataset.id,
        content: formInput.value
      }

      const reqObj = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      }

      fetch(commentsURL, reqObj)
      .then(resp => resp.json())
      .then(comment => {
        const liEL = document.createElement('li')
      liEL.innerHTML = `${comment.content} <button data-id=${comment.id} > X </button>`
      commentEl.append(liEL)
      })
    }
  })

  commentEl.addEventListener('click', function(e){
    if(e.target.innerText === 'X'){
      fetch(commentsURL + `/${e.target.dataset.id}`, {method: 'DELETE'})
      .then(resp => resp.json())
      .then(data => console.log(data))
      e.target.parentElement.remove()
    }
  })
})

