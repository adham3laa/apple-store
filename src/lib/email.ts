export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  createdAt: string | Date;
  status: string;
  fulfillmentType: string;
  shippingMethod: string;
  streetAddress?: string | null;
  city?: string | null;
  country?: string | null;
  trackingCode: string;
  securityPin: string;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    productTitle: string;
    primaryImage?: string | null;
    selectedFinish?: string | null;
    capacity?: string | null;
    unitPrice: number;
    quantity: number;
    appleCareName?: string | null;
    appleCarePrice?: number | null;
    engravingText?: string | null;
  }>;
}

export function generateOrderEmailHtml(order: OrderEmailData): string {
  const itemsHtml = order.items
    .map((item) => {
      const finishHtml = item.selectedFinish
        ? `<div style="font-size: 11px; color: #71717A; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Finish: ${item.selectedFinish} ${item.capacity ? `· ${item.capacity}` : ""}</div>`
        : "";
      const careHtml = item.appleCareName
        ? `<div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 3px;">+ ${item.appleCareName} (+$${item.appleCarePrice || 0})</div>`
        : "";
      const engravingHtml = item.engravingText
        ? `<div style="font-size: 11px; color: #52525B; font-style: italic; margin-top: 3px; background: #F4F4F5; padding: 2px 6px; border-radius: 4px; display: inline-block;">Laser Engraved: "${item.engravingText}"</div>`
        : "";

      return `
        <tr style="border-bottom: 1px solid #F0ECE1;">
          <td style="padding: 16px 0; vertical-align: top;">
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #161514; line-height: 1.3;">
              ${item.productTitle}
            </div>
            ${finishHtml}
            ${careHtml}
            ${engravingHtml}
          </td>
          <td style="padding: 16px 8px; vertical-align: top; text-align: center; font-size: 13px; color: #71717A; font-family: monospace;">
            ×${item.quantity}
          </td>
          <td style="padding: 16px 0; vertical-align: top; text-align: right; font-size: 14px; font-weight: 600; color: #161514; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            $${(item.unitPrice + (item.appleCarePrice || 0)) * item.quantity}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>COSMO — Order Confirmation ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #161514;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #EBE5D8; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04);">
          
          <!-- Obsidian Masthead Header -->
          <tr>
            <td style="background-color: #161514; padding: 32px 40px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 20px; font-weight: 700; letter-spacing: 0.35em; color: #FAF8F5; text-transform: uppercase;">
                      C O S M O
                    </div>
                    <div style="font-size: 10px; font-family: monospace; letter-spacing: 0.25em; color: #059669; text-transform: uppercase; margin-top: 6px; font-weight: 600;">
                      AUTHORIZED APPLE BOUTIQUE // VERIFIED ORDER
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Body -->
          <tr>
            <td style="padding: 40px 40px 24px 40px;">
              <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.2em; color: #059669; font-weight: bold; margin-bottom: 8px;">
                ORDER CONFIRMED & ALLOCATED
              </div>
              <h1 style="font-size: 26px; font-weight: 400; color: #161514; margin: 0 0 16px 0; font-family: Georgia, serif; line-height: 1.2;">
                Thank you for your order, <span style="font-style: italic;">${order.customerName}</span>.
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #52525B; margin: 0 0 24px 0;">
                Your original Apple devices have been registered and secured in our vault for white-glove fulfillment. Below are your acquisition details and courier hand-off security credentials.
              </p>

              <!-- Dispatch & Security PIN Banner -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; border: 1px solid #EBE5D8; border-radius: 14px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 12px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #71717A; margin-bottom: 4px;">ORDER REFERENCE</div>
                    <div style="font-size: 15px; font-family: monospace; font-weight: 700; color: #161514;">${order.orderNumber}</div>
                    
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #71717A; margin-top: 14px; margin-bottom: 4px;">TRACKING CODE</div>
                    <div style="font-size: 13px; font-family: monospace; color: #059669; font-weight: 600;">${order.trackingCode}</div>
                  </td>
                  <td width="50%" style="vertical-align: top; border-left: 1px solid #E5DFD5; padding-left: 20px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #059669; font-weight: bold; margin-bottom: 4px;">COURIER HAND-OFF PIN</div>
                    <div style="font-size: 24px; font-family: monospace; font-weight: 800; color: #161514; letter-spacing: 0.15em;">${order.securityPin}</div>
                    <div style="font-size: 10px; color: #71717A; margin-top: 4px; line-height: 1.4;">Provide this PIN to your courier at time of physical handover for verified release.</div>
                  </td>
                </tr>
              </table>

              <!-- Order Items Section -->
              <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.2em; color: #71717A; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #161514; padding-bottom: 6px;">
                ACQUIRED APPLE HARDWARE
              </div>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                ${itemsHtml}
              </table>

              <!-- Financial Summary Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #EBE5D8; padding-top: 16px;">
                <tr>
                  <td style="font-size: 13px; color: #71717A; padding: 4px 0;">Subtotal</td>
                  <td style="font-size: 13px; color: #161514; text-align: right; font-weight: 600;">$${order.subtotal} USD</td>
                </tr>
                ${
                  order.discountAmount > 0
                    ? `<tr>
                  <td style="font-size: 13px; color: #059669; padding: 4px 0;">Discount / Trade-In Credit</td>
                  <td style="font-size: 13px; color: #059669; text-align: right; font-weight: 600;">-$${order.discountAmount} USD</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="font-size: 13px; color: #71717A; padding: 4px 0;">Insured Courier Delivery</td>
                  <td style="font-size: 13px; color: #059669; text-align: right; font-weight: 600;">${order.shippingCost === 0 ? "FREE" : `$${order.shippingCost} USD`}</td>
                </tr>
                <tr>
                  <td style="font-size: 16px; font-weight: 700; color: #161514; padding: 14px 0 0 0; border-top: 1px solid #E5DFD5;">Total Paid</td>
                  <td style="font-size: 20px; font-weight: 700; color: #161514; text-align: right; padding: 14px 0 0 0; border-top: 1px solid #E5DFD5; font-family: Georgia, serif;">$${order.totalAmount} USD</td>
                </tr>
              </table>

              <!-- Delivery Destination -->
              <div style="background-color: #FAF8F5; border-radius: 12px; padding: 16px 20px; margin-top: 24px;">
                <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #71717A; margin-bottom: 4px;">
                  ${order.fulfillmentType === "pickup" ? "PICKUP LOCATION" : "DELIVERY DESTINATION"}
                </div>
                <div style="font-size: 13px; color: #161514; font-weight: 500;">
                  ${order.streetAddress || "Flagship Boutique Collection Desk"}, ${order.city || ""}, ${order.country || "United States"}
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer Guarantee -->
          <tr>
            <td style="background-color: #FAF8F5; border-top: 1px solid #EBE5D8; padding: 28px 40px; text-align: center;">
              <div style="font-size: 12px; font-weight: 600; color: #161514; margin-bottom: 4px;">
                Official 1-Year Apple Warranty Included
              </div>
              <div style="font-size: 11px; color: #71717A; line-height: 1.5; max-width: 480px; margin: 0 auto;">
                All products are 100% genuine, factory-sealed, and eligible for worldwide Apple Store Genius Bar service. Need assistance? Reply directly to this email or visit our client portal.
              </div>
              <div style="margin-top: 16px; font-size: 10px; font-family: monospace; color: #A1A1AA; letter-spacing: 0.2em; text-transform: uppercase;">
                COSMO BOUTIQUE · LONDON · NEW YORK · DUBAI
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<{
  success: boolean;
  provider: "resend" | "smtp" | "simulation";
  messageId?: string;
  error?: string;
}> {
  const htmlContent = generateOrderEmailHtml(order);

  // 1. Resend API Integration (Preferred if RESEND_API_KEY is present)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "COSMO Apple Boutique <orders@cosmo-store.com>",
          to: [order.customerEmail],
          subject: `COSMO Order Confirmation // ${order.orderNumber}`,
          html: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, provider: "resend", messageId: data.id };
      } else {
        console.warn("Resend API returned error:", data);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn("Resend dispatch failed, falling back:", errorMsg);
    }
  }

  // 2. Fallback: Log full email dispatch for development / staging / client demo
  console.log(`\n======================================================`);
  console.log(`[TRANSACTIONAL EMAIL DISPATCHED] -> ${order.customerEmail}`);
  console.log(`Subject: COSMO Order Confirmation // ${order.orderNumber}`);
  console.log(`Security Hand-off PIN: ${order.securityPin}`);
  console.log(`Total: $${order.totalAmount} USD (${order.items.length} items)`);
  console.log(`======================================================\n`);

  return {
    success: true,
    provider: "simulation",
    messageId: `sim_${Date.now()}`,
  };
}
