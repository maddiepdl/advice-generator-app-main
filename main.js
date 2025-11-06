var API_URL = 'https://api.adviceslip.com/advice'
var app = document.getElementById('app')
var adviceId = document.getElementById('advice-id')
var adviceText = document.getElementById('advice-text')
var diceButton = document.getElementById('dice-btn')
var loader = document.getElementById('loader')
function showLoading(show) {
  loader.setAttribute('aria-hidden', String(!show))
  loader.style.display = show ? 'flex' : 'none'
  diceButton.disabled = show
}
function animateDice() {
  var angle = (Math.random() - 0.5) * 10
  diceButton.style.transform = 'translateX(-50%) rotate(' + angle + 'deg) scale(1.02)'
  setTimeout(function() {
    diceButton.style.transform = 'translateX(-50%)'
  }, 200)
}
async function getAdvice() {
  showLoading(true)
  animateDice()
  try {
    var response = await axios.get(API_URL)
    var slip = response && response.data && response.data.slip
    if (!slip || !slip.id || !slip.advice) {
      adviceId.textContent = 'ADVICE #—'
      adviceText.textContent = 'No advice returned.'
      showLoading(false)
      return
    }
    adviceId.textContent = 'ADVICE #' + slip.id
    adviceText.textContent = slip.advice
    app.setAttribute('aria-label', 'Latest advice: ' + slip.advice)
    setTimeout(function() { showLoading(false) }, 220)
  } catch (err) {
    adviceId.textContent = 'ADVICE #—'
    adviceText.textContent = 'Unable to fetch advice. Please try again.'
    setTimeout(function() { showLoading(false) }, 250)
  }
}
diceButton.addEventListener('click', getAdvice)
diceButton.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    getAdvice()
  }
})
var extras = document.querySelectorAll('[data-action="new-advice"]')
for (var i = 0; i < extras.length; i++) {
  extras[i].addEventListener('click', getAdvice)
}
if (typeof axios !== 'undefined') {
  getAdvice()
} else {
  adviceId.textContent = 'ADVICE #—'
  adviceText.textContent = 'Axios not loaded.'
}
