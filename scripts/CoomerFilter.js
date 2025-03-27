async function querySelectorAsync(element, selector) {
  return await new Promise((resolve) => {
    let elm = element.querySelector(selector);
    if (elm) return resolve(elm);

    const observer = new MutationObserver((_) => {
      elm = element.querySelector(selector);
      if (elm) {
        resolve(elm);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function hasVideo(postUrl) {

  // Check if the result has been cached
  let cache = await chrome.storage.local.get([postUrl])
  if (cache[postUrl] !== undefined) {
    return cache[postUrl];
  }

  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.open("GET", postUrl, true);
    request.send(null);

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        let elm = document.createElement("html");
        elm.innerHTML = request.responseText;

        // If we can find a video tag, then post has video
        let res = elm.querySelector("video") !== null;
        resolve(res);

        // Cache the result
        chrome.storage.local.set({ [postUrl]: res });
      }
    };
  });
}

async function filterVideos() {
  // For every post, check the html and if there is no video, then remove post
  let posts = [
    ...(await querySelectorAsync(document, ".card-list__items")).children,
  ];
  for (let post of posts) {
    let postUrl = (await querySelectorAsync(post, "a")).href;
    hasVideo(postUrl).then((res) => {
      if (!res) post.remove();
    });
  }
}

filterVideos();