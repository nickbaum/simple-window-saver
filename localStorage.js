// helper function to restore from localStorage
function restoreFromLocalStorage(key, defaultValue) {
  if (localStorage[key]) {
    return JSON.parse(localStorage[key]);
  } else {
    localStorage[key] = JSON.stringify(defaultValue);
    return defaultValue;
  }
}