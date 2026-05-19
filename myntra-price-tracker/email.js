import { CONFIG } from "./config.js";

export async function sendPriceAlert({
  productName,
  oldPrice,
  newPrice,
  productUrl,
  image
}) {
  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service_id: CONFIG.EMAILJS_SERVICE_ID,
          template_id: CONFIG.EMAILJS_TEMPLATE_ID,
          user_id: CONFIG.EMAILJS_PUBLIC_KEY,
          template_params: {
            product_name: productName,
            old_price: oldPrice,
            new_price: newPrice,
            savings: oldPrice - newPrice,
            product_url: productUrl,
            image
          }
        })
      }
    );

    const data = await response.text();

    console.log("Email sent", data);
  } catch (error) {
    console.error("Email error", error);
  }
}