/* API endpoint for random advice */
var API_URL = 'https://api.adviceslip.com/advice'

/* grab DOM elements to update later */
var app = document.getElementById('app')
var adviceId = document.getElementById('advice-id')
var adviceText = document.getElementById('advice-text')
var diceButton = document.getElementById('dice-btn')
var loader = document.getElementById('loader')

/* show/hide loading UI & disable/enable dice button */
function showLoading(show) {
  loader.setAttribute('aria-hidden', String(!show))
  loader.style.display = show ? 'flex' : 'none'
  /* disable button to prevent duplicates */
  diceButton.style.pointerEvents = show ? 'none' : ''
  diceButton.setAttribute('aria-disabled', String(show))
}

/* random angle so animation feels different each time */
function animateDice() {
  var angle = (Math.random() - 0.5) * 10
  diceButton.style.transform = 'translateX(-50%) rotate(' + angle + 'deg) scale(1.02)'
  setTimeout(function() {
    diceButton.style.transform = 'translateX(-50%)'
  }, 200)
}

/* axios.get returns a promise; async/await */
async function getAdvice() {
  showLoading(true)
  animateDice()

  try {
    var response = await axios.get(API_URL)

    /* check for slip & its fields before updating UI */
    var slip = response && response.data && response.data.slip
    if (!slip || !slip.id || !slip.advice) {
      adviceId.textContent = 'ADVICE #—'
      adviceText.textContent = 'No advice returned.'
      showLoading(false)
      return
    }

    /* populate returned advice */
    adviceId.textContent = 'ADVICE #' + slip.id
    adviceText.textContent = slip.advice
    app.setAttribute('aria-label', 'Latest advice: ' + slip.advice) /* announce latest advice to screen readers */

    /* smooth the visual transition */
    setTimeout(function() { showLoading(false) }, 220)
  } catch (err) {
    /* show helpful error message & hide loader */
    adviceId.textContent = 'ADVICE #—'
    adviceText.textContent = 'Unable to fetch advice. Please try again.'
    setTimeout(function() { showLoading(false) }, 250)
  }
}

/* removed duplicate click listener; handled by data-action loop */
diceButton.addEventListener('keydown', function(e) {
  /* trigger on Enter or Space to make button keyboard-friendly */
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    getAdvice()
  }
})

/* attach same handler to any element with data-action="new-advice" Allows multiple triggers without duplicating code */
var extras = document.querySelectorAll('[data-action="new-advice"]')
for (var i = 0; i < extras.length; i++) {
  extras[i].addEventListener('click', getAdvice)
}

/* fetch advice if Axios loads successfully. If not present, show a helpful message. */
if (typeof axios !== 'undefined') {
  getAdvice()
} else {
  adviceId.textContent = 'ADVICE #—'
  adviceText.textContent = 'Axios not loaded.'
}
