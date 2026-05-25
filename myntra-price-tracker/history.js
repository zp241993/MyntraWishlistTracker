let chartInstance = null;

async function loadProducts() {

  const data =
    await chrome.storage.local.get("prices");

  const prices = data.prices || {};

  const productList =
    document.getElementById(
      "productList"
    );

  productList.innerHTML = "";

  Object.entries(prices).forEach(
    ([productId, productData]) => {

      const div =
        document.createElement("div");

      div.className = "product-item";

      const latestPrice =
        productData.price;

      const productName =
        productData.name ||
        `Product ${productId}`;

      div.innerHTML = `

        <div class="product-name">
          ${productName}
        </div>

        <div class="product-price">
          ₹${latestPrice}
        </div>

      `;

      div.addEventListener(
        "click",
        () => {
          renderChart(
            productName,
            productData.history || []
          );
        }
      );

      productList.appendChild(div);

    }
  );

}

function renderChart(
  productName,
  history
) {

  const title =
    document.getElementById(
      "productTitle"
    );

  title.innerText = productName;

  const labels = history.map(item => {

    return new Date(
      item.timestamp
    ).toLocaleString();

  });

  const values = history.map(item => {

    return item.price;

  });

  const ctx =
    document.getElementById(
      "priceChart"
    );

  // Destroy old chart
  if (chartInstance) {

    chartInstance.destroy();

  }

  chartInstance = new Chart(ctx, {

    type: "line",

    data: {

      labels,

      datasets: [

        {

          label: "Price",

          data: values,

          borderWidth: 3,

          tension: 0.2

        }

      ]

    },

    options: {

      responsive: true,

      plugins: {

        legend: {
          display: true
        }

      }

    }

  });

}

loadProducts();
