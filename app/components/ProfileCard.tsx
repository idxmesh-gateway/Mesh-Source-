'use client';

type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  wallet_address: string | null;
  account_balance: number;
  bonus_balance: number;
};

export default function ProfileCard({
  profile,
  onClose,
  onRefill,
}: {
  profile: Profile;
  onClose: () => void;
  onRefill: () => void;
}) {
  function copyWallet() {
    if (profile.wallet_address) navigator.clipboard.writeText(profile.wallet_address);
  }
  function logout() {
    window.location.href = '/logout';
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <h3>Account</h3>

        <div className="profile-row">
          <span className="k">Email</span>
          <span className="v">{profile.email}</span>
        </div>
        <div className="profile-row">
          <span className="k">Wallet</span>
          <span className="v" onClick={copyWallet} style={{ cursor: 'pointer' }} title="Click to copy">
            {profile.wallet_address ?? 'not set'}
          </span>
        </div>
        <div className="profile-row">
          <span className="k">Balance</span>
          <span className="v balance mono">${profile.account_balance.toFixed(4)}</span>
        </div>
        {profile.bonus_balance > 0 && (
          <div className="profile-row">
            <span className="k">Bonus</span>
            <span className="v mono">${profile.bonus_balance.toFixed(4)}</span>
          </div>
        )}

        <div className="profile-actions">
          <button className="btn btn-primary" onClick={onRefill}>
            Add credits
          </button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 12, width: '100%' }}
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
