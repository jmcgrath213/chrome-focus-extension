let focusCountdown;
let breakCountdown;
let focusTime;
let breakTime;
let onBreak = false;

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(()=>{
    console.log("window closed")
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.cmd === "setFocusTime") {
    focusCountdown = request.focusCountdown;
    focusTime = request.focusTime;
  }
  else if(request.cmd === "getFocusTime") {
    sendResponse({focusCountdown, focusTime, onBreak});
  }
  else if(request.cmd === "setBreakTime") {
    breakCountdown = request.breakCountdown;
    breakTime = request.breakTime;
    onBreak = request.onBreak;
  }
  else if(request.cmd === "getBreakTime") {
    sendResponse({breakCountdown, breakTime, onBreak});
  }
  else if(request.cmd === "setOnBreak") {
    onBreak = request.onBreak;
  }
  else if(request.cmd === "getOnBreak") {
    sendResponse({onBreak});
  }
})