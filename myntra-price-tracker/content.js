(async function () {

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function autoScroll() {

    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {

      window.scrollBy(0, 1000);

      totalHeight += 1000;

      await delay(1200);
    }

    window.scrollTo(0, 0);
  }

  // Scroll entire wishlist
  await autoScroll();

  const products = [];

  // Myntra wishlist product cards
  const cards = document.querySelectorAll(
    ".itemcard-itemCard"
  );

  console.log("FOUND CARDS:", cards.length);

  cards.forEach(card => {

    try {

      // Product Name
      const nameElement = card.querySelector(
        ".itemdetails-itemDetailsLabel"
      );

      if (!nameElement) return;

      const name = nameElement.innerText.trim();

      // Price Container
      const priceElement = card.querySelector(
        ".itemdetails-itemPricing"
      );

      if (!priceElement) return;

      const priceText = priceElement.innerText;

      // Extract ONLY current price
      const match = priceText.match(/Rs\.\s?([\d,]+)/);

      if (!match) return;

      const price = parseInt(
        match[1].replace(/,/g, "")
      );

      // Product Image
      const imgElement = card.querySelector("img");

      const image = imgElement
        ? imgElement.src
        : "";

      // Product Link
      const linkElement = card.querySelector("a");

      const url = linkElement
        ? linkElement.href
        : "";

      // Product ID
      const id = extractProductId(url);

      products.push({
        id,
        name,
        price,
        url,
        image
      });

    } catch (err) {

      console.error("CARD ERROR:", err);

    }

  });

  console.log("SCRAPED PRODUCTS:", products);

  return products;

})();

function extractProductId(url) {

  try {

    // Example:
    // https://www.myntra.com/31766433/buy

    const match = url.match(/\/([0-9]+)\/buy/);

    if (match && match[1]) {
      return match[1];
    }

    return url;

  } catch (err) {

    console.error(err);

    return null;
  }
}