const scanButton = document.getElementById("scanButton");
const openWishlistButton = document.getElementById(
  "openWishlistButton"
);
const status = document.getElementById("status");

scanButton.addEventListener("click", async () => {
  status.innerText = "Scanning wishlist...";

  chrome.runtime.sendMessage({
    action: "manualScan"
  });

  setTimeout(() => {
    status.innerText = "Scan completed";
  }, 3000);
});

openWishlistButton.addEventListener("click", () => {
  chrome.tabs.create({
    url: "https://www.myntra.com/wishlist"
  });
});