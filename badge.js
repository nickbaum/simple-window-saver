/* BADGE FUNCTIONS */
// Because chrome doesn't support per-window badges, we maintain it per-tab
// and update it on both window and tab selection changes


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