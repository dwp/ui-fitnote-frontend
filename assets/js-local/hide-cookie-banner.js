function removeElement(e) {
  e.preventDefault()
  document.getElementById("global-cookie-message").style.display = "none";
}
document.addEventListener('DOMContentLoaded', function () {
  var hideBannerBtn = document.getElementById('hide-banner')
  if (hideBannerBtn) {
    hideBannerBtn.addEventListener('click', removeElement)
  }
  
})
