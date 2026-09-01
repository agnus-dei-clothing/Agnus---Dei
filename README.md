# AGNUS-DEI CLOTHING

Custom storefront prepared for GitHub + Vercel + Stripe Checkout.

## Final retail prices
- Lamb Tee — $48
- I Love Jesus Tee — $48
- Bible Belt Tee — $48
- Redeemed Button-Up Shirt — $43
- “What Can’t God Do?” Tee — $48
- Chosen Raglan Tee — $43
- Chosen Baby Tee — $43
- Dove Zip-Up Hoodie — $62
- Vintage Agnus - Dei Long Sleeve — $48
- Vintage Agnus - Dei Shorts — $50

Sizes: S–2XL for every product.

## Important
Never commit a real Stripe secret key. Add STRIPE_SECRET_KEY in Vercel Project Settings > Environment Variables.

The checkout endpoint validates product IDs, prices, and sizes on the server so customers cannot change the price from browser code.

## Deployment
1. Upload/commit this project to your GitHub repository.
2. Import that repository into Vercel.
3. In Vercel, add STRIPE_SECRET_KEY (start with the Stripe test secret key).
4. Add SITE_URL with the Vercel deployment URL.
5. Redeploy.
6. Test checkout in Stripe Test mode before switching to live mode.

Vercel supports server-side functions and private environment variables; do not prefix STRIPE_SECRET_KEY with NEXT_PUBLIC_.
