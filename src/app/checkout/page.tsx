'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreShell } from '@/components/shells/store-shell';
import { OrderSummary } from '@/components/order-summary';
import { Icon } from '@/components/icon';
import { useStore } from '@/context/store-context';
import { money } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import type { Product } from '@/lib/types';

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'info' | 'shipping' | 'payment' | 'confirm'>('info');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.primaryPhoneNumber?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Accra');
  const [region, setRegion] = useState('Greater Accra');
  const [delivery, setDelivery] = useState('standard');

  const [paymentMethod, setPaymentMethod] = useState('card');

  // Handle Paystack callback (verify payment after redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verify = params.get('verify');
    const orderId = params.get('order_id');
    const trxref = params.get('trxref'); // Paystack appends this

    if (verify === '1' && (orderId || trxref)) {
      const ref = trxref || orderId;
      // Verify payment with Paystack
      fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: ref, order_id: orderId }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.verified) {
            // Clear cart from session storage
            const savedCart = sessionStorage.getItem('pending_cart');
            if (savedCart) {
              try {
                const items = JSON.parse(savedCart);
                // Only clear if the cart matches what was ordered
                clearCart();
              } catch { /* ignore */ }
            } else {
              clearCart();
            }
            sessionStorage.removeItem('pending_order_id');
            sessionStorage.removeItem('pending_cart');
            // Clean URL and redirect
            window.history.replaceState({}, '', '/checkout');
            router.push(`/shop?order=${orderId || ref}`);
          } else {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        })
        .catch(() => {
          setError('Could not verify payment. Please contact support with your order ID.');
          setLoading(false);
        });
      return; // Don't proceed with normal loading
    }

    if (cart.length === 0) { setLoading(false); return; }
    fetch('/api/products?limit=500')
      .then(r => r.json())
      .then(data => {
        const all: Product[] = data.products ?? [];
        setProducts(all.filter(p => cart.some(c => c.id === p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cart, clearCart, router]);


  const cartItems = cart.map(c => {
    const p = products.find(pr => pr.id === c.id);
    return { ...c, product: p };
  }).filter(c => c.product);

  const subtotal = cartItems.reduce((s, c) => s + (c.product?.price ?? 0) * c.qty, 0);
  const shipping = delivery === 'express' ? 75 : subtotal >= 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError('');
    try {
      // Step 1: Create the order first
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(c => ({ product_id: c.id, qty: c.qty, price: c.product!.price, name: c.product!.name })),
          amount: total,
          shipping_method: delivery,
          payment_method: paymentMethod,
          address,
          city,
          region,
          customer_name: `${firstName} ${lastName}`,
          customer_email: email,
          customer_phone: phone,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Order failed');

      // Step 2: If Paystack, initialize payment and redirect
      if (paymentMethod === 'paystack') {
        const payRes = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            amount: total,
            metadata: { order_id: orderData.id, customer_name: `${firstName} ${lastName}` },
            callback_url: `${window.location.origin}/checkout?verify=1&order_id=${orderData.id}`,
          }),
        });
        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.error || 'Payment initialization failed');

        // Store order id so we can clear cart after successful payment
        sessionStorage.setItem('pending_order_id', orderData.id);
        sessionStorage.setItem('pending_cart', JSON.stringify(cart));

        // Redirect to Paystack
        window.location.href = payData.authorization_url;
        return;
      }

      // For non-Paystack methods, just confirm the order
      clearCart();
      router.push(`/shop?order=${orderData.id}`);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };


  if (loading) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}><div className="sub">Loading checkout…</div></div>
    </StoreShell>
  );

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  const steps = [
    { key: 'info', label: 'Contact Info' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
  ];

  return (
    <StoreShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 28 }}>Checkout</h1>

        {/* Steps indicator */}
        <div className="checkout-steps row gap0" style={{ marginBottom: 32, borderBottom: '1px solid var(--line)', paddingBottom: 16 }}>
          {steps.map((s, i) => {
            const active = step === s.key;
            const done = steps.findIndex(x => x.key === step) > i;
            return (
              <div key={s.key} className="row gap8" style={{ alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: active ? 'var(--blue-600)' : done ? 'var(--green)' : 'var(--surface-2)',
                  color: active || done ? '#fff' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                }}>{done ? '✓' : i + 1}</div>
                <span style={{ fontWeight: active ? 700 : 500, fontSize: 13, color: active ? 'var(--ink)' : 'var(--muted)' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <div className="card card-pad">
            {error && (
              <div style={{ marginBottom: 16, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '12px 16px', fontSize: 14 }}>
                {error}
              </div>
            )}

            {step === 'info' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Contact Information</h3>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email *</label>
                  <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
                </div>
                <div className="row gap12">
                  <div style={{ flex: 1, marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>First Name *</label>
                    <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
                  </div>
                  <div style={{ flex: 1, marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Last Name *</label>
                    <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone Number *</label>
                  <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
                </div>
                <button className="btn btn-primary" onClick={() => setStep('shipping')}>Continue to Shipping</button>
              </div>
            )}

            {step === 'shipping' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Shipping Address</h3>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Street Address *</label>
                  <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Building, street, landmark" style={{ width: '100%', maxWidth: '100%' }} />
                </div>
                <div className="row gap12">
                  <div style={{ flex: 1, marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>City *</label>
                    <input className="input" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
                  </div>
                  <div style={{ flex: 1, marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Region *</label>
                    <select className="input" value={region} onChange={e => setRegion(e.target.value)} style={{ width: '100%', maxWidth: '100%' }}>
                      <option>Greater Accra</option>
                      <option>Ashanti</option>
                      <option>Eastern</option>
                      <option>Western</option>
                      <option>Central</option>
                      <option>Volta</option>
                      <option>Northern</option>
                      <option>Upper East</option>
                      <option>Upper West</option>
                      <option>Bono</option>
                      <option>Ahafo</option>
                      <option>Bono East</option>
                      <option>Oti</option>
                      <option>North East</option>
                      <option>Savannah</option>
                      <option>Western North</option>
                    </select>
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, marginTop: 8 }}>Delivery Method</h3>
                {[
                  { key: 'standard', label: 'Standard Delivery', desc: subtotal >= 500 ? 'Free' : 'GHS 25', time: '2–3 business days' },
                  { key: 'express', label: 'Express Delivery', desc: 'GHS 75', time: 'Same day (Accra)' },
                ].map(d => (
                  <div key={d.key} className="row gap12" style={{
                    padding: '14px 16px', borderRadius: 'var(--r)', border: `2px solid ${delivery === d.key ? 'var(--blue-600)' : 'var(--line)'}`,
                    marginBottom: 10, cursor: 'pointer',
                  }} onClick={() => setDelivery(d.key)}>
                    <input type="radio" checked={delivery === d.key} readOnly />
                    <div className="grow">
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{d.label}</div>
                      <div className="sub" style={{ fontSize: 12 }}>{d.time}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--blue-600)' }}>{d.desc}</div>
                  </div>
                ))}
                <div className="row gap12" style={{ marginTop: 16 }}>
                  <button className="btn btn-ghost" onClick={() => setStep('info')}>Back</button>
                  <button className="btn btn-primary" onClick={() => setStep('payment')}>Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Payment Method</h3>
                {[
                  { key: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, Verve' },
                  { key: 'momo', label: 'Mobile Money', desc: 'MTN MoMo, Vodafone Cash, AirtelTigo' },
                  { key: 'paystack', label: 'Paystack', desc: 'Secure online payments' },
                ].map(p => (
                  <div key={p.key} className="row gap12" style={{
                    padding: '14px 16px', borderRadius: 'var(--r)', border: `2px solid ${paymentMethod === p.key ? 'var(--blue-600)' : 'var(--line)'}`,
                    marginBottom: 10, cursor: 'pointer',
                  }} onClick={() => setPaymentMethod(p.key)}>
                    <input type="radio" checked={paymentMethod === p.key} readOnly />
                    <div className="grow">
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</div>
                      <div className="sub" style={{ fontSize: 12 }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
                <div className="row gap12" style={{ marginTop: 16 }}>
                  <button className="btn btn-ghost" onClick={() => setStep('shipping')}>Back</button>
                  <button className="btn btn-primary" onClick={() => setStep('confirm')}>Review Order</button>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Order Summary</h3>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Contact</div>
                  <div className="sub" style={{ fontSize: 13 }}>{email} · {phone}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Ship to</div>
                  <div className="sub" style={{ fontSize: 13 }}>{firstName} {lastName}<br />{address}, {city}, {region}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Delivery</div>
                  <div className="sub" style={{ fontSize: 13, textTransform: 'capitalize' }}>{delivery}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Payment</div>
                  <div className="sub" style={{ fontSize: 13, textTransform: 'capitalize' }}>{paymentMethod}</div>
                </div>
                <div className="row gap12">
                  <button className="btn btn-ghost" onClick={() => setStep('payment')}>Back</button>
                  <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={processing}>
                    {processing ? '⏳ Processing…' : `Place Order — ${money(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <OrderSummary shippingFee={shipping} />
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
