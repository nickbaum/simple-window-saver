/* BADGE FUNCTIONS */
// Because chrome doesn't support per-window badges, we maintain it per-tab
// and update it on both window and tab selection changes


// used to count how many times we show the update message
var updateMsgCount = restoreFromLocalStorage("updateMsgCount", 0);


// if the extension has been updated, show the update message 5 times
if (!localStorage.version) {
  localStorage.version = "1.3";
}
if (parseFloat(localStorage.version) < 1.3) {
  updateMsgCount = 5;
  localStorage.version = "1.3";
}
if (updateMsgCount > 0) {
  updateBadgeForAllWindows();
}


// updates the browserAction badge to show the window as saved
function showSavedBadge(tabId) {
  var text;
  if (updateMsgCount > 0) {
    text = "new!";
  } else {
    text = "v";
  }
  chrome.browserAction.setBadgeText({text:text, tabId:tabId});
  chrome.browserAction.setBadgeBackgroundColor(
    {color:[0,255,0,255], tabId:tabId});
}


// updates the browserAction badge to show the window as unsaved
// because chrome doesn't support per-window badges, we do it per-tab
// and update it on both window and tab selection changes
function showUnsavedBadge(tabId) {
  var text;
  if (updateMsgCount > 0) {
    text = "new!";
  } else {
    text = "";
  }
  chrome.browserAction.setBadgeText({text:text, tabId:tabId});
  chrome.browserAction.setBadgeBackgroundColor(
    {color:[102,170,255,255], tabId:tabId});
}


// update the badge for the given tab
function updateBadgeForTab(tab) {
  if (windowIdToName[tab.windowId]) {
    showSavedBadge(tab.id);
  } else {
    showUnsavedBadge(tab.id);
  }
}


// update the badge for the given window
function updateBadgeForWindow(windowId) {
  if (windowId != -1) {
    chrome.tabs.getSelected(windowId, updateBadgeForTab);
  }
}


// update the badge for the given window
function updateBadgeForAllWindows() {
  chrome.windows.getAll(null, function(windows) {
    for (i in windows) {
      updateBadgeForWindow(windows[i].id);
    }
  });
}