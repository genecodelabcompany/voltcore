'use client';
import { useState, useEffect } from 'react';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

const TABS = ['General', 'Payments', 'Shipping', 'Notifications', 'Security'];
const TAB_ICON: Record<string, string> = {
  General: 'settings', Payments: 'card', Shipping: 'truck', Notifications: 'bell', Security: 'shield',
};

// Settings keys owned by each tab
const TAB_KEYS: Record<string, string[]> = {
  General: ['store_name', 'store_email', 'support_phone', 'address', 'currency', 'timezone'],
  Payments: ['paystack_public_key', 'paystack_secret_key', 'enable_momo', 'enable_vodafone', 'enable_bank_transfer'],
  Shipping: ['free_shipping_threshold', 'standard_shipping_fee', 'express_shipping_fee', 'enable_express', 'enable_pickup', 'enable_international'],
  Notifications: ['notify_order_confirm', 'notify_shipment', 'notify_delivery', 'notify_low_stock', 'notify_review', 'notify_sms'],
  Security: ['require_2fa', 'login_email_alert', 'force_https', 'session_timeout', 'max_login_attempts'],
};

const DEFAULTS: Record<string, string> = {
  store_name: 'VoltCore Electronics', store_email: 'hello@voltcore.com.gh',
  support_phone: '+233 50 123 4567', address: 'Electronics Hub, Circle, Accra, Ghana',
  currency: 'GHS', timezone: 'Africa/Accra',
  paystack_public_key: '', paystack_secret_key: '',
  enable_momo: '1', enable_vodafone: '0', enable_bank_transfer: '1',
  free_shipping_threshold: '500', standard_shipping_fee: '25', express_shipping_fee: '75',
  enable_express: '1', enable_pickup: '1', enable_international: '0',
  notify_order_confirm: '1', notify_shipment: '1', notify_delivery: '1',
  notify_low_stock: '1', notify_review: '0', notify_sms: '0',
  require_2fa: '0', login_email_alert: '1', force_https: '1',
  session_timeout: '480', max_login_attempts: '5',
};

function isToggleKey(k: string) {
  return k.startsWith('enable_') || k.startsWith('notify_') || k.startsWith('require_') ||
    k === 'login_email_alert' || k === 'force_https';
}

const FIELD_META: Record<string, { label: string; hint?: string; type?: string }> = {
  store_name:              { label: 'Store Name' },
  store_email:             { label: 'Store Email' },
  support_phone:           { label: 'Support Phone' },
  address:                 { label: 'Address' },
  currency:                { label: 'Currency' },
  timezone:                { label: 'Timezone' },
  paystack_public_key:     { label: 'Paystack Public Key', hint: 'From Paystack dashboard → Settings → API Keys' },
  paystack_secret_key:     { label: 'Paystack Secret Key', type: 'password' },
  enable_momo:             { label: 'Enable MTN MoMo', hint: 'Accept Mobile Money payments via Paystack' },
  enable_vodafone:         { label: 'Enable Vodafone Cash', hint: 'Accept Vodafone Cash via Paystack' },
  enable_bank_transfer:    { label: 'Enable Bank Transfer', hint: 'Show bank transfer instructions at checkout' },
  free_shipping_threshold: { label: 'Free Shipping Threshold (GHS)', hint: 'Orders above this amount qualify for free delivery' },
  standard_shipping_fee:   { label: 'Standard Shipping Fee (GHS)' },
  express_shipping_fee:    { label: 'Express Shipping Fee (GHS)' },
  enable_express:          { label: 'Enable Express Delivery', hint: 'Accra & surrounding districts only' },
  enable_pickup:           { label: 'Enable Pickup at Store', hint: 'Allow customers to collect from Circle, Accra' },
  enable_international:    { label: 'International Shipping', hint: 'Enable shipping outside Ghana' },
  notify_order_confirm:    { label: 'Order Confirmation', hint: 'Send email when order is placed' },
  notify_shipment:         { label: 'Shipment Tracking', hint: 'Notify customer when order ships' },
  notify_delivery:         { label: 'Delivery Confirmation', hint: 'Notify customer on delivery' },
  notify_low_stock:        { label: 'Low Stock Alerts', hint: 'Email admin when stock drops below reorder level' },
  notify_review:           { label: 'New Review Notifications', hint: 'Notify admin of new product reviews' },
  notify_sms:              { label: 'SMS Notifications', hint: 'Send SMS via Arkesel for order updates' },
  require_2fa:             { label: 'Two-Factor Authentication', hint: 'Require 2FA for admin logins' },
  login_email_alert:       { label: 'Login Email Alerts', hint: 'Email admin on new login from unknown device' },
  force_https:             { label: 'Force HTTPS', hint: 'Redirect all HTTP traffic to HTTPS' },
  session_timeout:         { label: 'Session Timeout (minutes)', hint: 'Minutes of inactivity before admin session expires' },
  max_login_attempts:      { label: 'Max Login Attempts', hint: 'Account locks after this many failed attempts' },
};

export default function AdminSettings() {
  const [tab, setTab]         = useState('General');
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        setSettings({ ...DEFAULTS, ...d.settings });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: string, val: string) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const tabKeys = TAB_KEYS[tab] ?? [];

  return (
    <div>
      <PageHead title="Settings" sub="Configure your VoltCore store"
        actions={
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? '⏳ Saving…' : saved ? <><Icon name="check" size={16} /> Saved!</> : <><Icon name="check" size={16} /> Save Changes</>}
          </button>
        } />

      {saved && (
        <div style={{ marginBottom: 16, background: '#ECFDF3', color: 'var(--c-green)', borderRadius: 10, padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon name="check" size={18} /> Settings saved successfully.
        </div>
      )}

      <div className="row gap16" style={{ alignItems: 'flex-start' }}>
        {/* Sidebar nav */}
        <div className="card" style={{ width: 200, flexShrink: 0, overflow: 'hidden' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="row gap10" style={{
              width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: tab === t ? 'var(--blue-50)' : 'transparent',
              color: tab === t ? 'var(--blue-600)' : 'var(--ink)',
              fontWeight: tab === t ? 700 : 500, fontSize: 14,
              borderLeft: tab === t ? '3px solid var(--blue-600)' : '3px solid transparent',
            }}>
              <Icon name={TAB_ICON[t]} size={16} /> {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card card-pad grow">
          {loading ? (
            <div className="sub" style={{ padding: '48px 0', textAlign: 'center' }}>Loading settings…</div>
          ) : (
            <div style={{ display: 'grid', gap: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>{tab}</div>
              {tabKeys.map(key => {
                const meta = FIELD_META[key] ?? { label: key };
                const val = settings[key] ?? '';
                if (isToggleKey(key)) {
                  const on = val === '1';
                  return (
                    <div key={key} className="row between" style={{ padding: '14px 0', borderBottom: '1px solid var(--line-2)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{meta.label}</div>
                        {meta.hint && <div className="sub" style={{ fontSize: 13, marginTop: 2 }}>{meta.hint}</div>}
                      </div>
                      <button onClick={() => set(key, on ? '0' : '1')} style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: on ? 'var(--blue-600)' : 'var(--line)', position: 'relative', transition: 'background .2s',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          position: 'absolute', top: 3, left: on ? 22 : 3,
                          width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left .2s',
                        }} />
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={key} style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{meta.label}</label>
                    <input className="input" type={meta.type ?? 'text'} value={val}
                      onChange={e => set(key, e.target.value)} style={{ maxWidth: 420, display: 'block' }} />
                    {meta.hint && <div className="sub" style={{ fontSize: 12, marginTop: 5 }}>{meta.hint}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
