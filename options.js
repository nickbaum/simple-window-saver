var moveLastToTop = "moveLastToTop";
var $toTop = document.getElementById(moveLastToTop);

document.getElementById('save').onclick = function() {
  localStorage[moveLastToTop] = $toTop.checked;
}

document.body.onload = function() {
  $toTop.checked = restoreFromLocalStorage(moveLastToTop, false);
}
