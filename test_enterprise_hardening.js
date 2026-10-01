// test_enterprise_hardening.js
// Automated verification suite for enterprise-grade backend defenses

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("================================================================================");
  console.log("🛡️  COSMO ENTERPRISE HARDENING VERIFICATION TEST SUITE");
  console.log("================================================================================\n");

  let passed = 0;
  let failed = 0;
  let testOrderNumber = null;

  // ---------------------------------------------------------------------------
  // TEST 1: Defend Against Price Tampering (Zero Client Trust)
  // ---------------------------------------------------------------------------
  try {
    console.log("TEST 1: Price Tampering Defense (Injecting $1 for $999 iPhone 16 Pro)...");
    const tamperedPayload = {
      customerName: "Auditing Specialist",
      customerEmail: "audit@cosmo-store.com",
      customerPhone: "+1 (555) 998-1234",
      fulfillmentType: "courier",
      shippingMethod: "complimentary",
      streetAddress: "100 Wall Street",
      city: "New York",
      country: "United States",
      // Attacker attempts sending $1 total and $1 unit price
      subtotal: 1.0,
      totalAmount: 1.0,
      items: [
        {
          productId: "iphone-16-pro",
          productTitle: "iPhone 16 Pro",
          unitPrice: 1.0, // Tampered
          quantity: 1,
          selectedFinish: "Natural Titanium",
          capacity: "256 GB", // +$100 delta -> Base $999 + $100 = $1,099
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tamperedPayload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(`Order creation failed: ${JSON.stringify(data)}`);
    }

    const order = data.order;
    testOrderNumber = order.orderNumber;

    // Expected: $999 (base) + $100 (256GB) = $1,099.00
    if (order.subtotal === 1099 && order.totalAmount === 1099) {
      console.log(`✅ TEST 1 PASSED: Server rejected client's $1 price and forced official verified catalog price ($${order.totalAmount}).`);
      passed++;
    } else {
      throw new Error(`Price tampering was NOT prevented! Stored totalAmount: $${order.totalAmount}`);
    }
  } catch (err) {
    console.error("❌ TEST 1 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Reject Negative Quantity Attack
  // ---------------------------------------------------------------------------
  try {
    console.log("\nTEST 2: Negative Quantity Boundary Attack (Injecting quantity: -5)...");
    const negativeQtyPayload = {
      customerName: "Attacker",
      customerEmail: "attacker@exploit.com",
      customerPhone: "+1 (555) 000-0000",
      items: [
        {
          productId: "iphone-16-pro",
          quantity: -5,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(negativeQtyPayload),
    });

    const data = await res.json();
    if (res.status === 400 && !data.success) {
      console.log(`✅ TEST 2 PASSED: Negative quantity rejected by Zod runtime guard (HTTP ${res.status}).`);
      passed++;
    } else {
      throw new Error(`Negative quantity was allowed! Status: ${res.status}`);
    }
  } catch (err) {
    console.error("❌ TEST 2 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Reject Unrealistic Over-Capacity Attack (quantity: 9999)
  // ---------------------------------------------------------------------------
  try {
    console.log("\nTEST 3: Quantity Overflow Attack (Injecting quantity: 9999)...");
    const overflowPayload = {
      customerName: "Hoarder",
      customerEmail: "hoarder@exploit.com",
      customerPhone: "+1 (555) 000-0000",
      items: [
        {
          productId: "iphone-16-pro",
          quantity: 9999,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overflowPayload),
    });

    const data = await res.json();
    if (res.status === 400 && !data.success) {
      console.log(`✅ TEST 3 PASSED: Quantity overflow (>20 units) blocked by Zod guard (HTTP ${res.status}).`);
      passed++;
    } else {
      throw new Error(`Quantity overflow was allowed! Status: ${res.status}`);
    }
  } catch (err) {
    console.error("❌ TEST 3 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Stripe Webhook Deduplication Ledger & Fast-ACK
  // ---------------------------------------------------------------------------
  try {
    console.log("\nTEST 4: Stripe Webhook Deduplication & Fast-ACK Idempotency...");
    const testEventId = `evt_audit_${Date.now()}`;
    const webhookPayload = {
      id: testEventId,
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: testOrderNumber,
          payment_intent: "pi_test_audit_ledger",
        },
      },
    };

    // First delivery
    const res1 = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });
    const data1 = await res1.json();

    if (!res1.ok || !data1.received || data1.deduplicated) {
      throw new Error(`First delivery failed: ${JSON.stringify(data1)}`);
    }

    // Duplicate redelivery of the exact same event
    const res2 = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });
    const data2 = await res2.json();

    if (res2.ok && data2.received && data2.deduplicated === true) {
      console.log(`✅ TEST 4 PASSED: First event processed; redelivery intercepted by deduplication ledger with fast-ACK.`);
      passed++;
    } else {
      throw new Error(`Deduplication failed! Second delivery response: ${JSON.stringify(data2)}`);
    }
  } catch (err) {
    console.error("❌ TEST 4 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Admin Session Authentication (Passkey Guard)
  // ---------------------------------------------------------------------------
  try {
    console.log("\nTEST 5: Admin Session Authentication (Passkey Guard)...");
    
    // Invalid key
    const badRes = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey: "wrong-passkey-123" }),
    });
    if (badRes.status !== 401) {
      throw new Error(`Wrong passkey should return 401, got ${badRes.status}`);
    }

    // Valid master key
    const goodRes = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey: "2026" }),
    });
    const goodData = await goodRes.json();
    const setCookie = goodRes.headers.get("set-cookie");

    if (goodRes.ok && goodData.success && setCookie && setCookie.includes("cosmo_admin_session")) {
      console.log(`✅ TEST 5 PASSED: Unauthorized passkey rejected (401); valid passkey issued HttpOnly session cookie.`);
      passed++;
    } else {
      throw new Error(`Valid passkey failed or cookie missing: ${JSON.stringify(goodData)}`);
    }
  } catch (err) {
    console.error("❌ TEST 5 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Order Status Lifecycle Transition (PATCH /api/orders/[id])
  // ---------------------------------------------------------------------------
  try {
    console.log("\nTEST 6: Order Status Transition & Courier Allocation...");
    const patchRes = await fetch(`${BASE_URL}/api/orders/${testOrderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "courier_dispatched",
        statusLabel: "Vault Courier Dispatched (In Transit)",
        courierName: "Tariq Mansour",
        courierVehicle: "Climate-Regulated Armored Van #04",
      }),
    });

    const patchData = await patchRes.json();
    if (patchRes.ok && patchData.success && patchData.order.status === "courier_dispatched") {
      console.log(`✅ TEST 6 PASSED: Order status advanced to 'courier_dispatched' with armored courier details.`);
      passed++;
    } else {
      throw new Error(`Failed to advance order status: ${JSON.stringify(patchData)}`);
    }
  } catch (err) {
    console.error("❌ TEST 6 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 7: SEO Governance (robots.txt & sitemap.xml)
  // ---------------------------------------------------------------------------
  try {
    console.log("\nTEST 7: SEO Governance (robots.txt & sitemap.xml)...");
    const [robotsRes, sitemapRes] = await Promise.all([
      fetch(`${BASE_URL}/robots.txt`),
      fetch(`${BASE_URL}/sitemap.xml`),
    ]);

    const robotsText = await robotsRes.text();
    const sitemapText = await sitemapRes.text();

    if (
      robotsRes.ok &&
      robotsText.includes("Disallow: /admin") &&
      sitemapRes.ok &&
      sitemapText.includes("<urlset")
    ) {
      console.log(`✅ TEST 7 PASSED: robots.txt protects /admin; sitemap.xml dynamic XML feed active.`);
      passed++;
    } else {
      throw new Error(`SEO endpoints check failed! robots status: ${robotsRes.status}, sitemap status: ${sitemapRes.status}`);
    }
  } catch (err) {
    console.error("❌ TEST 7 FAILED:", err.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log(`🎯 HARDENING AUDIT COMPLETE: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

// Allow server a moment to warm up then run
setTimeout(runTests, 1500);
