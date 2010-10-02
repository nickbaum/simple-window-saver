chrome.browserAction.setIcon({path:"do_not_package/debug_icon19.png"});

// Open database
debug = new Object();
debug.dbSize = 5 * 1024 * 1024; // 5MB
debug.db = openDatabase('debug', '1.0', 'debug info', debug.dbSize);

// Create table
debug.db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS event_log(ID INTEGER PRIMARY KEY ASC, event_type TEXT, window_id INTEGER, tab_id INTEGER, time_stamp DATETIME)', []);
});

// Log an event
debug.logEvent = function(eventType, windowId, tabId) {
  if (windowIdToName[windowId]) {
		debug.db.transaction(function(tx){
			var timeStamp = new Date();
			tx.executeSql('INSERT INTO event_log(event_type, window_id, tab_id, time_stamp) VALUES (?,?,?,?)', [eventType, windowId, tabId, timeStamp], null, debug.onError);
		});
  }
}

// Log errors to the console
debug.onError = function(tx, e) {
  console.log('Something unexpected happened: ' + e.message);
}

// Log all tab and window events
debug.onTabAttached = function(tabId, info) {
	debug.logEvent("tab_attached", info.newWindowId, tabId);
}
// chrome.tabs.onAttached.addListener(debug.onTabAttached);

debug.onTabCreated = function(tab) {
	debug.logEvent("tab_created", tab.windowId, tab.id);
}
// chrome.tabs.onCreated.addListener(debug.onTabCreated);

debug.onTabDetached = function(tabId, info) {
	debug.logEvent("tab_detached", info.oldWindowId, tabId);
}
// chrome.tabs.onDetached.addListener(debug.onTabDetached);

debug.onTabMoved = function(tabId, info) {
	debug.logEvent("tab_moved", info.windowId, tabId);
}
// chrome.tabs.onMoved.addListener(debug.onTabMoved);

debug.onTabRemoved = function(tabId) {
	debug.logEvent("tab_removed", tabIdToSavedWindowId[tabId], tabId);
}
chrome.tabs.onRemoved.addListener(debug.onTabRemoved);

debug.onTabSelectionChanged = function(tabId, info) {
	debug.logEvent("tab_selected", info.windowId, tabId);
}
chrome.tabs.onSelectionChanged.addListener(debug.onTabSelectionChanged);

debug.onTabUpdated = function(tabId, info, tab) {
	debug.logEvent("tab_updated", tab.windowId, tabId);
}
// chrome.tabs.onUpdated.addListener(debug.onTabUpdated);

debug.onWindowCreated = function(window) {
	debug.logEvent("window_created", window.id, 0);
}
// chrome.windows.onCreated.addListener(debug.onWindowCreated);

debug.onWindowFocusChanged = function(windowId) {
	debug.logEvent("window_focused", windowId, 0);
}
// chrome.windows.onFocusChanged.addListener(debug.onWindowFocusChanged);

debug.onWindowRemoved = function(windowId) {
	debug.logEvent("window_removed", windowId, 0);
}
chrome.windows.onRemoved.addListener(debug.onWindowRemoved);
