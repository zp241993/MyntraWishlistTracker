import { CONFIG } from "./config.js";
import { sendPriceAlert } from "./email.js";

// Extension Installed
chrome.runtime.onInstalled.addListener(async () => {

  console.log("Myntra Tracker Installed");

  chrome.alarms.create("wishlistScan", {
    periodInMinutes: CONFIG.CHECK_INTERVAL_MINUTES
  });

  await runWishlistScan();

});

// Popup Actions
chrome.runtime.onMessage.addListener(
  async (message) => {

    // Manual Scan
    if (message.action === "manualScan") {

      await runWishlistScan();

    }

    // Remove Out Of Stock
    if (message.action === "removeOutOfStock") {

      await removeOutOfStockProducts();

    }

  }
);

// Automatic Alarm Scan
chrome.alarms.onAlarm.addListener(
  async (alarm) => {

    if (alarm.name === "wishlistScan") {

      await runWishlistScan();

    }

  }
);

// Main Wishlist Scan
async function runWishlistScan() {

  console.log("Starting wishlist scan...");

  chrome.tabs.create(
    {
      url: CONFIG.WISHLIST_URL,

      // CHANGE TO true FOR TESTING
      active: false
    },
    async (tab) => {

      try {

        await delay(10000);

        const results =
          await chrome.scripting.executeScript({
            target: {
              tabId: tab.id
            },
            files: ["content.js"]
          });

        const products =
          results[0].result || [];

        console.log(
          "Products Found",
          products
        );

        await comparePrices(products);

        chrome.tabs.remove(tab.id);

      } catch (error) {

        console.error(error);

      }

    }
  );
}

// Compare Prices
async function comparePrices(products) {

  const stored =
    await chrome.storage.local.get([
      "prices"
    ]);

  const oldPrices =
    stored.prices || {};

  const updatedPrices = {};

  for (const product of products) {

    updatedPrices[product.id] = {
      price: product.price,
      lastUpdated: Date.now()
    };

    const oldData =
      oldPrices[product.id];

    if (oldData) {

      const oldPrice =
        oldData.price;

      // Only notify on REAL price drop
      if (
        product.price < oldPrice
      ) {

        console.log(
          `PRICE DROP: ${product.name}
          ₹${oldPrice} → ₹${product.price}`
        );

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

  await chrome.storage.local.set({
    prices: updatedPrices
  });

  console.log("Prices updated");

}

// Remove Out Of Stock Products
async function removeOutOfStockProducts() {

  console.log(
    "Removing out of stock products..."
  );

  chrome.tabs.create(
    {
      url: CONFIG.WISHLIST_URL,

      // CHANGE TO true FOR TESTING
      active: true
    },
    async (tab) => {

      try {

        await delay(10000);

        await chrome.scripting.executeScript({
          target: {
            tabId: tab.id
          },

          func: async () => {

            function delay(ms) {
              return new Promise(resolve =>
                setTimeout(resolve, ms)
              );
            }

            // Scroll full wishlist
            let totalHeight = 0;

            while (
              totalHeight <
              document.body.scrollHeight
            ) {

              window.scrollBy(0, 1000);

              totalHeight += 1000;

              await delay(1200);

            }

            // Product Cards
            const cards =
              document.querySelectorAll(
                ".itemcard-itemCard"
              );

            console.log(
              "TOTAL CARDS:",
              cards.length
            );

            let removedCount = 0;

            for (const card of cards) {

              try {

                // Out Of Stock Text
                const outOfStock =
                  card.querySelector(
                    ".itemcard-outOfStockText"
                  );

                if (!outOfStock) {
                  continue;
                }

                // Remove Icon
                const removeButton =
                  card.querySelector(
                    ".itemcard-removeIcon"
                  );

                if (!removeButton) {
                  continue;
                }

                console.log(
                  "Removing product..."
                );

                removeButton.click();

                removedCount++;

                await delay(1500);

              } catch (err) {

                console.error(err);

              }

            }

            console.log(
              `Removed ${removedCount}
              out of stock products`
            );

          }

        });

        chrome.tabs.remove(tab.id);

      } catch (err) {

        console.error(err);

      }

    }
  );

}

// Delay Helper
function delay(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}
