'use client';

import { useState } from 'react';

export default function RefillModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const presets = [1, 5, 10, 25];
  const [selected, setSelected] = useState(5);
  const [custom, setCustom] = useState('');

  const amount = custom ? Number(custom) : selected;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="refill-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add credits</h2>
        <p className="sub">1 USDC = 1 credit. No fees beyond network gas.</p>

        <div className="amount-grid">
          {presets.map((a) => (
            <button
              key={a}
              className={`amount-tile ${!custom && selected === a ? 'selected' : ''}`}
              onClick={() => {
                setSelected(a);
                setCustom('');
              }}
            >
              ${a}
            </button>
          ))}
        </div>

        <input
          className="input"
          placeholder="Custom amount (USD)"
          type="number"
          min="1"
          step="0.01"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            marginBottom: 16,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>You pay</span>
          <span className="mono" style={{ color: 'var(--cyan)', fontSize: 20 }}>
            ${Number.isFinite(amount) && amount > 0 ? amount.toFixed(2) : '0.00'}
          </span>
        </div>

        {/*
          PAYMENT PLACEHOLDER.
          The real xpair button goes here once we test /test-pay.
          For now this button just closes with a message so the modal isn't dead.
        */}
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => {
            alert('Payment wiring arrives after the xpair test. This modal is UI-only for now.');
            onSuccess();
          }}
        >
          Pay ${Number.isFinite(amount) && amount > 0 ? amount.toFixed(2) : '0.00'} USDC
        </button>

        <button
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', marginTop: 10 }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
