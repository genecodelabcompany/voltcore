'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { StoreShell } from '@/components/shells/store-shell';
import { OrderSummary } from '@/components/order-summary';
import { Icon } from '@/components/icon';
import { useStore } from '@/context/store-context';
import { money } from '@/lib/utils';
import { productById } from '@/lib/data';

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="row gap0" style={{ justifyContent: 'center', marginBottom: 32 }}>
      {STEPS.map((s, i) => (
        <div key={s} className="row gap0" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < step ? 'var(--green)' : i === step ? 'var(--blue-600)' : 'var(--line)',
              color: i <= step ? '#fff' : 'var(--muted)', fontWeight: 700, fontSize: 14,
            }}>
              {i < step ? <Icon name="check" size={14} /> : i + 1}
            </div>
            <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 400, color: i === step ? 'var(--blue-600)' : 'var(--muted)' }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 80, height: 2, background: i < step ? 'var(--green)' : 'var(--line)', marginBottom: 20, margin: '0 8px 20px' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('Kwame');
  const [lastName, setLastName] = useState('Mensah');
  const [email, setEmail] = useState('kwame.mensah@mail.com');
  const [phone, setPhone] = useState('+233 50 123 4567');
  const [address, setAddress] = useState('House 12, Spintex Road');
  const [city, setCity] = useState('East Legon, Accra');
  const [notes, setNotes] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'momo' | 'vodafone'>('paystack');

  const [total, setTotal] = useState(0);

  // Load Paystack Inline JS and track readiness
  const [paystackReady, setPaystackReady] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const subtotal = cart.reduce((s, item) => {
    const p = productById(item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);

  const shippingFee = shippingMethod === 'express'
    ? 75
    : shippingMethod === 'pickup'
    ? 0
    : (subtotal >= 500 ? 0 : 25);

  const handlePayNow = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!paystackReady || !window.PaystackPop) {
      alert('Paystack SDK is still loading. Please try again in a moment.');
      return;
    }

    setLoading(true);
    setLoadingText('Initializing order...');

    try {
      // 1. Map cart items for database
      const items = cart.map(item => {
        const p = productById(item.id);
        return {
          product_id: item.id,
          name: p ? p.name : 'Unknown Product',
          price: p ? p.price : 0,
          qty: item.qty,
        };
      });

      // 2. Create pending order in DB
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: `${firstName} ${lastName}`,
          customer_email: email,
          customer_phone: phone,
          address,
          city,
          amount: total,
          payment_method: paymentMethod,
          shipping_method: shippingMethod,
          notes: notes || null,
          items,
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order in database');
      }

      const { id: orderId } = await orderRes.json();
      setCreatedOrderId(orderId);

      setLoadingText('Initializing payment session...');

      // 3. Initialize Paystack Transaction
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: total,
          metadata: {
            order_id: orderId,
            custom_fields: [
              {
                display_name: 'Order ID',
                variable_name: 'order_id',
                value: orderId,
              },
            ],
          },
        }),
      });

      if (!initRes.ok) {
        throw new Error('Failed to initialize payment session with Paystack');
      }

      const { reference, access_code } = await initRes.json();

      setLoading(false);

      // 4. Open Paystack Modal
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_4330e872e8282759dc0af2c0f68224a165044645',
        email,
        amount: Math.round(total * 100),
        currency: 'GHS',
        ref: reference,
        access_code: access_code,
        // Paystack calls this when payment succeeds
        callback: function (response: any) {
          // Use an async IIFE to handle async work without making the callback itself async
          (async () => {
            setLoading(true);
            setLoadingText('Verifying payment status...');
            try {
              const verifyRes = await fetch('/api/paystack/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  reference: response.reference,
                  order_id: orderId,
                }),
              });
              if (!verifyRes.ok) throw new Error('Payment verification failed');
              const verifyData = await verifyRes.json();
              if (verifyData.verified) {
                setLoadingText('Sending confirmation email...');
                await fetch('/api/email/order-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    order_id: orderId,
                    customer_name: `${firstName} ${lastName}`,
                    customer_email: email,
                    items,
                    amount: total,
                    shipping_method: shippingMethod,
                  }),
                });
                setLoading(false);
                setStep(2);
              } else {
                setLoading(false);
                alert('Payment could not be verified by the server. Please contact support.');
              }
            } catch (err) {
              console.error(err);
              setLoading(false);
              alert('Error completing payment verification. Please contact support.');
            }
          })();
        },
        onClose: function () {
          alert('Checkout cancelled. You can try again when you are ready.');
        },
      });

      handler.openIframe();
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      alert(err.message || 'An error occurred during checkout.');
    }
  };

  return (
    <StoreShell>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px', position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 31, 61, 0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, color: '#fff', gap: 16
          }}>
            <div style={{
              width: 50, height: 50, border: '4px solid rgba(255,255,255,0.2)',
              borderTopColor: 'var(--blue-500)', borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontWeight: 700, fontSize: 16 }}>{loadingText}</div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 28 }}>Checkout</h1>
        <StepIndicator step={step} />

        {step === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
            <div className="card card-pad">
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Delivery Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>First Name</label>
                  <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Last Name</label>
                  <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%' }} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
                  <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
                  <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%' }} required />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Delivery Address</label>
                <input className="input" value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%' }} required />
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>City / Area</label>
                <input className="input" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%' }} required />
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Order Notes (Optional)</label>
                <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', minHeight: 80, padding: 10 }} placeholder="Notes about your order, e.g. special delivery instructions." />
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Delivery Option</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['standard', 'Standard Delivery (2–3 days)', subtotal >= 500 ? 'Free' : 'GHS 25.00'],
                    ['express', 'Express Delivery (Same day, Accra)', 'GHS 75.00'],
                    ['pickup', 'Pickup at Circle, Accra', 'Free'],
                  ].map(([val, label, price]) => (
                    <label key={val} className="row gap12" style={{
                      padding: '14px 16px', border: `1px solid ${shippingMethod === val ? 'var(--blue-600)' : 'var(--line)'}`,
                      borderRadius: 'var(--r)', cursor: 'pointer', fontSize: 14,
                      background: shippingMethod === val ? 'var(--blue-50)' : undefined,
                    }}>
                      <input type="radio" name="delivery" checked={shippingMethod === val} onChange={() => setShippingMethod(val as any)} />
                      <div className="grow" style={{ fontWeight: shippingMethod === val ? 600 : 400 }}>{label}</div>
                      <span style={{ fontWeight: 700 }}>{price}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 24, width: '100%' }}
                onClick={() => {
                  if (!firstName || !lastName || !email || !phone || !address || !city) {
                    alert('Please fill out all required shipping fields.');
                    return;
                  }
                  setStep(1);
                }}>
                Continue to Payment <Icon name="arrowR" size={16} />
              </button>
            </div>
            <OrderSummary shippingFee={shippingFee} onTotalChange={setTotal} />
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
            <div className="card card-pad">
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[
                  ['paystack', 'Card / Online / MoMo', 'Visa, Mastercard, Mobile Money via Paystack'],
                ].map(([val, label, sub]) => (
                  <label key={val} className="row gap14" style={{
                    padding: '14px 16px', border: `1px solid ${paymentMethod === val ? 'var(--blue-600)' : 'var(--line)'}`,
                    borderRadius: 'var(--r)', cursor: 'pointer', background: paymentMethod === val ? 'var(--blue-50)' : undefined,
                  }}>
                    <input type="radio" name="pay" value={val} checked={paymentMethod === val} onChange={() => setPaymentMethod(val as any)} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                      <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderRadius: 'var(--r)', padding: '14px 16px', fontSize: 13.5, color: 'var(--blue-700)', marginBottom: 20 }}>
                <Icon name="shield" size={14} style={{ marginRight: 8 }} />
                Your payment is processed securely by Paystack. VoltCore does not store card details.
              </div>
              <div className="row gap10">
                <button className="btn btn-ghost" onClick={() => setStep(0)} style={{ border: '1px solid var(--line)' }}>Back</button>
                <button className="btn btn-primary grow" onClick={handlePayNow}>
                  <Icon name="card" size={16} style={{ marginRight: 8 }} /> Pay {money(total)} Now
                </button>
              </div>
            </div>
            <OrderSummary shippingFee={shippingFee} onTotalChange={setTotal} />
          </div>
        )}

        {step === 2 && (
          <div className="card card-pad" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--green-bg)', color: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Icon name="check" size={36} color="var(--green)" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Order Confirmed!</h2>
            <p className="sub" style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
              Thank you for your order, <strong>{firstName}</strong>. We have received your payment and sent a confirmation email to <strong>{email}</strong>.
            </p>
            <p style={{ fontWeight: 700, color: 'var(--blue-600)', marginBottom: 28, fontSize: 16 }}>Order ID: #{createdOrderId}</p>
            <div className="row gap10" style={{ justifyContent: 'center' }}>
              <a href="/account/orders" className="btn btn-primary" onClick={() => clearCart()}>View My Orders</a>
              <a href="/shop" className="btn btn-ghost" style={{ border: '1px solid var(--line)' }} onClick={() => clearCart()}>Continue Shopping</a>
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
