# Task Progress - Fix Checkout, Buy Now, and Multiple Image Upload

## Issues Found

### 1. Checkout Not Working - Mismatched API Fields
**File: `src/app/checkout/page.tsx`** (lines 58-73)
The checkout page sends fields like `shipping_address`, `customer_name`, `customer_email`, `customer_phone`, `delivery_method`, `payment_method` to the POST `/api/orders` endpoint.
**But** the API route (`src/app/api/orders/route.ts` lines 24-28) expects: `customer_name`, `customer_email`, `customer_phone`, `address`, `city`, `amount`, `payment_ref`, `payment_method`, `shipping_method`, `notes`, `items`.
**Mismatch:** Checkout sends `shipping_address` (combined string) but API expects separate `address` + `city`. Checkout doesn't send `amount` (required field!). Checkout sends `delivery_method` but API expects `shipping_method`.

### 2. "Buy Now" Button on Product Detail Page Does Nothing
**File: `src/app/product/[id]/page.tsx`** (line 158)
The "Buy Now" button has no onClick handler - it's just a static button with no functionality.

### 3. "Order Now" Button on Product Card - Missing `name` in Order Items
**File: `src/components/product-card.tsx`** (lines 26-34)
The `handleOrderNow` function adds to cart and redirects to checkout. This works via the cart flow, but the checkout page doesn't send `name` field for order items. The `createOrder` function in `src/lib/repos/orders.ts` expects `name` for each item.

### 4. Multiple Image Upload Not Supported
**Files: `src/app/admin/products/new/page.tsx` and `src/app/admin/products/[id]/page.tsx`**
- Only single image upload is supported (one file input)
- The schema only has a single `image_url` column
- No `images` (array) or `image_urls` field exists in the database or types

### 5. Checkout Redirect After Order - Wrong Route
**File: `src/app/checkout/page.tsx`** (line 77)
After placing an order, it redirects to `/account/orders` but there's no guarantee the user is signed in or that route exists properly.

### 6. Order Items Missing `name` Field
**File: `src/app/checkout/page.tsx`** (line 62)
The checkout sends items with `product_id`, `qty`, `price` but NOT `name`. The `createOrder` function requires `name` for each item.

## Fix Plan
- [x] Analyze all issues
- [ ] Fix checkout page - align field names with API expectations, add `amount` and `name` fields
- [ ] Fix "Buy Now" button on product detail page - add onClick handler
- [ ] Fix "Order Now" button on product card - ensure proper flow
- [ ] Add multiple image upload support (schema, types, API, admin UI)
- [ ] Test and verify all fixes
