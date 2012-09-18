/*

This file is loaded by the background page.
It adds a bunch of functionality that is useful for developing the extension.

When the extension is packaged, we replace it with an empty file. You can find this file here: do_not_package/empty_debug.js

Whenever you call a function in this file from the main code, you need to make sure to include a corresponding stub in empty_debug.js to prevent javascript errors.

In general though, we try to keep links between this code and the main code as loose as possible. Currently it is only called in two spots: once from the background page, and once from the popup.

*/

// change the icon so you can distinguish a locally loaded extension
chrome.browserAction.setIcon({path:'do_not_package/debug_icon19.png'});

// separate context for debug actions
// all functions in this file should be in this context
var debug = {};

// open the debug database
debug.dbSize = 5 * 1024 * 1024; // 5MB
debug.db = openDatabase('debug', '1.0', 'debug info', debug.dbSize);

/* LOGGING */

// create a table for log events if it doesn't exist
debug.db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS event_log(ID INTEGER PRIMARY KEY ASC, event_type TEXT, window_id INTEGER, tab_id INTEGER, time_stamp DATETIME)', []);
});

// log an event
// we attach this to the various event listeners below
// TODO: re-enable logging only for saved windows
debug.logEvent = function(eventType, windowId, tabId) {
	var timeStamp = (new Date()).getTime();
	debug.db.transaction(function(tx){
		tx.executeSql('INSERT INTO event_log(event_type, window_id, tab_id, time_stamp) VALUES (?,?,?,?)', [eventType, windowId, tabId, timeStamp], debug.onEventLogged, debug.onError);
	});
}

// if we're viewing the log in another tab, we update it after logging an event.
debug.onEventLogged = function() {
	views = chrome.extension.getViews({type: "tab"});
	for (var i in views) {
		if (views[i].updateLogView) {
			views[i].updateLogView();
		}
	}
}

// log database errors to the console
debug.onError = function(tx, e) {
  console.log('Something unexpected happened: ' + e.message);
}

// add link to view logs in popup
debug.addDebugUI = function(document){
  var footer = document.getElementById('footer');
  var url = chrome.extension.getURL("do_not_package/view_log.html");
  var link = ' - <a href="javascript:chrome.tabs.create({url:\'' + url + '\'});">View logs</a>';
  // footer.innerHTML = footer.innerHTML + link;
};

/* EVENT LISTENERS for logging */
// To log an event, simply uncomment the corresponding line.

debug.onTabAttached = function(tabId, info) {
  debug.logEvent('tab_attached', info.newWindowId, tabId);
}
// chrome.tabs.onAttached.addListener(debug.onTabAttached);

debug.onTabCreated = function(tab) {
  debug.logEvent('tab_created', tab.windowId, tab.id);
}
// chrome.tabs.onCreated.addListener(debug.onTabCreated);

debug.onTabDetached = function(tabId, info) {
  debug.logEvent('tab_detached', info.oldWindowId, tabId);
}
// chrome.tabs.onDetached.addListener(debug.onTabDetached);

debug.onTabMoved = function(tabId, info) {
  debug.logEvent('tab_moved', info.windowId, tabId);
}
// chrome.tabs.onMoved.addListener(debug.onTabMoved);

debug.onTabRemoved = function(tabId) {
  debug.logEvent('tab_removed', tabIdToSavedWindowId[tabId], tabId);
}
chrome.tabs.onRemoved.addListener(debug.onTabRemoved);

debug.onTabSelectionChanged = function(tabId, info) {
  debug.logEvent('tab_selected', info.windowId, tabId);
}
chrome.tabs.onSelectionChanged.addListener(debug.onTabSelectionChanged);

debug.onTabUpdated = function(tabId, info, tab) {
  debug.logEvent('tab_updated', tab.windowId, tabId);
}
// chrome.tabs.onUpdated.addListener(debug.onTabUpdated);

debug.onWindowCreated = function(window) {
  debug.logEvent('window_created', window.id, 0);
}
// chrome.windows.onCreated.addListener(debug.onWindowCreated);

debug.onWindowFocusChanged = function(windowId) {
  debug.logEvent('window_focused', windowId, 0);
}
// chrome.windows.onFocusChanged.addListener(debug.onWindowFocusChanged);

debug.onWindowRemoved = function(windowId) {
  debug.logEvent('window_removed', windowId, 0);
}
chrome.windows.onRemoved.addListener(debug.onWindowRemoved);
