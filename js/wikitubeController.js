'use strict'

const initKeyword = 'Arctic Monkeys'

function init() {
  showLoader()
  getDatasAndRender(initKeyword)
  renderHistory()
}

function onUserSearch(ev) {
  ev.preventDefault()
  const elInput = document.querySelector('.input')
  const keyword = elInput.value
  elInput.value = ''
  getDatasAndRender(keyword)
}

function getDatasAndRender(keyword) {
  Promise.all([getSearchResults(keyword), getWikiData(keyword)])
    .then(res => {
      renderResults(res[0])
      renderWiki(res[1])
      console.log(res)
    })
    .catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No Results Found',
        footer: `Maybe try another words`,
      })
    })
}

function renderResults(results) {
  const strHTMLs = results.map(
    result => `
          <li class="result flex align-center" onclick="renderVideo('${result.id}')">
            <img src="${result.imgUrl}" alt="" />
            <p class="title">
              ${result.title}
            </p>
          </li>`
  )

  document.querySelector('.results').innerHTML = strHTMLs.join('')
  renderVideo(results[0].id)
  document.querySelector('.spinner').classList.add('hide')
  document.querySelector('.main-content').classList.remove('hide')
  renderHistory()
}

function renderVideo(id) {
  const strHTML = `
            <iframe
              src="https://www.youtube.com/embed/${id}"
            ></iframe>
      `

  document.querySelector('.player').innerHTML = strHTML
}

function renderWiki(texts) {
  const strHTMLs = texts.map(text => `<p>${text}</p>`)
  document.querySelector('.wiki-text').innerHTML = strHTMLs.join('')
}

function renderHistory() {
  const keywords = getKeywords()
  let strHTMLs = keywords.map(
    keyword =>
      `<span onclick="getDatasAndRender('${keyword}')">${keyword}</span>`
  )

  if (strHTMLs.length === 0) strHTMLs = ['No keywords to show']

  document.querySelector('.keywords-contianer').innerHTML = strHTMLs.join('')
}

function showLoader() {
  document.querySelector('.spinner').classList.remove('hide')
  document.querySelector('.main-content').classList.add('hide')
}

function onClearHistory() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
      clearHistory()
      renderHistory()
    }
  })
}
