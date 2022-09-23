let countdownTime;
let focusTime;
let breakTime;

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(()=>{
    console.log("window closed")
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.cmd === "setTime") {
    countdownTime = request.countdownTime;
    focusTime = request.focusTime;
    breakTime = request.breakTime;
  }
  else if(request.cmd === "getTime") {
    sendResponse({countdownTime: countdownTime, focusTime: focusTime, breakTime: breakTime});
  }
})