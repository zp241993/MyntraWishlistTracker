import { CONFIG } from "./config.js";
import { sendPriceAlert } from "./email.js";
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Myntra Tracker Installed");

  chrome.alarms.create("wishlistScan", {
    periodInMinutes: CONFIG.CHECK_INTERVAL_MINUTES
  });

  await runWishlistScan();
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "manualScan") {
    await runWishlistScan();
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "wishlistScan") {
    await runWishlistScan();
  }
});

async function runWishlistScan() {
  console.log("Starting wishlist scan...");

  chrome.tabs.create(
    {
      url: CONFIG.WISHLIST_URL,
      active: false
    },
    async (tab) => {
      try {
        await delay(10000);

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });

        const products = results[0].result || [];

        console.log("Products Found", products);

        await comparePrices(products);

        chrome.tabs.remove(tab.id);
      } catch (error) {
        console.error(error);
      }
    }
  );
}

async function comparePrices(products) {
  const stored = await chrome.storage.local.get(["prices"]);

  const oldPrices = stored.prices || {};

  const updatedPrices = {};

  for (const product of products) {
    updatedPrices[product.id] = {
      price: product.price,
      lastUpdated: Date.now()
    };

    const oldData = oldPrices[product.id];

    if (oldData) {
      const oldPrice = oldData.price;

      if (oldPrice !== product.price) {
        console.log(
          `${product.name}: ₹${oldPrice} → ₹${product.price}`
        );

        if (product.price !== oldPrice) {
          await sendPriceAlert({
            productName: product.name,
            oldPrice,
            newPrice: product.price,
            productUrl: product.url,
            image: product.image
          });
        }
      }
    }
  }

  await chrome.storage.local.set({
    prices: updatedPrices
  });

  console.log("Prices updated");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}