let testVar = "wooo testing";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ testVar })
  console.log("Set test Var: ", testVar)
})

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(()=>{
    console.log("window closed")
  })
})