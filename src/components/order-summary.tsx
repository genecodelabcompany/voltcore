'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';
import { money } from '@/lib/utils';
import { productById } from '@/lib/data';
import { useStore } from '@/context/store-context';

interface OrderSummaryProps {
  checkoutHref?: string;
  onCheckout?: () => void;
  shippingFee?: number;
  discountAmount?: number;
  onTotalChange?: (total: number) => void;
}

export function OrderSummary({ checkoutHref, onCheckout, shippingFee, discountAmount, onTotalChange }: OrderSummaryProps = {}) {
  const { cart } = useStore();
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);

  const subtotal = cart.reduce((s, item) => {
    const p = productById(item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  
  const shipping = shippingFee !== undefined ? shippingFee : (subtotal >= 500 ? 0 : 25);
  const discount = discountAmount !== undefined ? discountAmount : (applied ? subtotal * 0.1 : 0);
  const total = subtotal + shipping - discount;

  useEffect(() => {
    if (onTotalChange) onTotalChange(total);
  }, [total, onTotalChange]);

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    else if (checkoutHref) router.push(checkoutHref);
  };

  return (
    <div className="card card-pad" style={{ position: 'sticky', top: 96 }}>
      <h3 className="h3" style={{ marginBottom: 18 }}>Order Summary</h3>
      {discountAmount === undefined && (
        <div className="row gap8" style={{ marginBottom: 18 }}>
          <input className="input" placeholder="Coupon code" value={coupon}
            onChange={e => setCoupon(e.target.value)} style={{ height: 40 }} />
          <button className="btn btn-ghost" style={{ height: 40 }}
            onClick={() => setApplied(coupon.trim().length > 0)}>Apply</button>
        </div>
      )}
      {(applied || (discountAmount !== undefined && discountAmount > 0)) && (
        <div className="row between" style={{ marginBottom: 10 }}>
          <span className="pill pill-green"><Icon name="check" size={12} />Coupon applied</span>
          <span className="up">−{money(discount)}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14 }}>
        <div className="row between"><span className="sub">Subtotal</span><span style={{ fontWeight: 600 }}>{money(subtotal)}</span></div>
        <div className="row between"><span className="sub">Shipping</span><span style={{ fontWeight: 600 }}>{shipping === 0 ? 'Free' : money(shipping)}</span></div>
        {discount > 0 && <div className="row between"><span className="sub">Discount</span><span className="up">−{money(discount)}</span></div>}
        <div className="divider" style={{ margin: '6px 0' }} />
        <div className="row between">
          <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: 20 }}>{money(total)}</span>
        </div>
      </div>
      {(checkoutHref || onCheckout) && (
        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 18 }} onClick={handleCheckout}>
          Proceed to Checkout <Icon name="arrowR" size={18} />
        </button>
      )}
      <div className="row gap8" style={{ justifyContent: 'center', marginTop: 14, color: 'var(--muted)' }}>
        <Icon name="shield" size={15} /><span style={{ fontSize: 12 }}>Secure checkout via Paystack</span>
      </div>
    </div>
  );
}
