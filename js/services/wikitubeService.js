'use strict'

const YT_KEY = 'AIzaSyDb3lf9hVX5yL28Kio9TiaaoiAkD_PnobM'

const SEARCH_KEY = 'searchDB'
const WIKI_KEY = 'wikiDB'
const HISTORY_KEY = 'historyDB'

let gSearchCache = loadFromStorage(SEARCH_KEY) || {}
let gWikiCache = loadFromStorage(WIKI_KEY) || {}
let gHistoryCache = loadFromStorage(HISTORY_KEY) || []

function getKeywords() {
  return gHistoryCache
}

function getSearchResults(keyword) {
  if (!gHistoryCache.includes(keyword)) {
    gHistoryCache.push(keyword)
    saveToStorage(HISTORY_KEY, gHistoryCache)
  }

  if (gSearchCache[keyword]) {
    console.log('Getting from cache')
    return Promise.resolve(gSearchCache[keyword])
  }
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet
                &videoEmbeddable=true&type=video&key=${YT_KEY}&q=${keyword}`
  return fetch(url)
    .then(res => res.json())
    .then(res =>
      res.items.map(item => ({
        keyword: keyword,
        id: item.id.videoId,
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.default.url,
      }))
    )
    .then(res => {
      gSearchCache[keyword] = res
      saveToStorage(SEARCH_KEY, gSearchCache)
      return res
    })
}

function getWikiData(keyword) {
  if (gWikiCache[keyword]) {
    console.log('Getting from cache')
    return Promise.resolve(gWikiCache[keyword])
  }

  const url = `https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&
  srsearch=${keyword}&format=json`

  return fetch(url)
    .then(res => res.json())
    .then(res => [
      res.query.search[0].snippet,
      res.query.search[1].snippet,
      res.query.search[2].snippet,
    ])
    .then(res => {
      gWikiCache[keyword] = res
      saveToStorage(WIKI_KEY, gWikiCache)
      return res
    })
}

function clearHistory() {
  gHistoryCache = []
  saveToStorage(HISTORY_KEY, gHistoryCache)
}
