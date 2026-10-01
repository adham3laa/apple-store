import Stripe from "stripe";

// Initialize Stripe instance
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_cosmo_boutique_2026";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
});

export const isStripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")
);
