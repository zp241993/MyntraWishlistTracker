const scanButton = document.getElementById(
  "scanButton"
);

const removeOutOfStockButton =
  document.getElementById(
    "removeOutOfStockButton"
  );

const openWishlistButton =
  document.getElementById(
    "openWishlistButton"
  );

const status = document.getElementById(
  "status"
);

const historyButton =
  document.getElementById(
    "historyButton"
  );

historyButton.addEventListener(
  "click",
  () => {
    chrome.tabs.create({
      url: "history.html"
    });

  }
);

// Scan wishlist
scanButton.addEventListener("click", () => {

  status.innerText = "Scanning wishlist...";

  chrome.runtime.sendMessage({
    action: "manualScan"
  });

  setTimeout(() => {
    status.innerText = "Scan completed";
  }, 3000);

});

// Remove out of stock
removeOutOfStockButton.addEventListener(
  "click",
  () => {

    status.innerText =
      "Removing out of stock products...";

    chrome.runtime.sendMessage({
      action: "removeOutOfStock"
    });

    setTimeout(() => {
      status.innerText =
        "Out of stock products removed";
    }, 5000);

  }
);

// Open wishlist
openWishlistButton.addEventListener("click", () => {

  chrome.tabs.create({
    url: "https://www.myntra.com/wishlist"
  });

});
