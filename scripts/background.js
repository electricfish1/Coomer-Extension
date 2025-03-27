chrome.action.onClicked.addListener((tab) => {
  let url = tab.url;

  if (url.includes("coomer")) {
    filterCoomerPage(tab);
  } else if (url.includes("onlyfans.com")) {
    openCoomerPageFromOF(tab);
  }
});

function filterCoomerPage(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scripts/CoomerFilter.js"],
  });
}

function openCoomerPageFromOF(tab) {
  const currentUrl = new URL(tab.url);
  const path = currentUrl.pathname;

  console.log("Current path: " + path);

  const newUrl = `https://coomer.su/onlyfans/user${path}`;

  chrome.tabs.create({ url: newUrl });
}