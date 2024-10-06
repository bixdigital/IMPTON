{ useState, useEffect, useCallback } from 'react';
import { Button, Dialog, CircularProgress, Snackbar, TextField } from '@mui/material';
import { WebApp } from '@twa-dev/sdk';

// Custom hook for fetching user data
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call
        const response = await fetch('https://api.example.com/user-data');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { userData, loading, error };
};

// Custom hook for managing farming timers
const useFarmingTimer = (initialTokens) => {
  const [tokens, setTokens] = useState(initialTokens);

  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prevTokens) => Math.min(prevTokens + 1, 1000)); // Assuming 1000 is the max
    }, 5000); // Farm every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return tokens;
};

export default function IMPCTONRewards() {
  const { userData, loading, error } = useUserData();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [referralCode, setReferralCode] = useState('');

  const tokens = useFarmingTimer(userData?.tokens || 0);

  const handleUpgrade = useCallback(() => {
    // Implement upgrade logic here
    setShowUpgradeDialog(false);
    setSnackbar({ open: true, message: 'Upgrade successful!' });
  }, []);

  const handleReferral = useCallback(() => {
    // Implement referral logic here
    setSnackbar({ open: true, message: `Referral code ${referralCode} applied!` });
  }, [referralCode]);

  const handleConnectWallet = useCallback(() => {
    // Implement wallet connection logic here
    setSnackbar({ open: true, message: 'Wallet connected successfully!' });
  }, []);

  useEffect(() => {
    WebApp.ready();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="impcton-rewards">
      <h1>IMPCTON Rewards</h1>
      <div className="user-info">
        <p>Welcome, {userData.name}!</p>
        <p>Tokens: {tokens}</p>
        <p>Level: {userData.level}</p>
      </div>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setShowUpgradeDialog(true)}
        disabled={tokens < 100}
      >
        Upgrade
      </Button>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleConnectWallet}
      >
        Connect Wallet
      </Button>

      <div className="referral-section">
        <TextField
          label="Referral Code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
        <Button 
          variant="outlined" 
          onClick={handleReferral}
          disabled={!referralCode}
        >
          Apply Referral
        </Button>
      </div>

      <Dialog open={showUpgradeDialog} onClose={() => setShowUpgradeDialog(false)}>
        <div className="upgrade-dialog">
          <h2>Upgrade Your Account</h2>
          <p>Are you sure you want to upgrade? This will cost 100 tokens.</p>
          <Button onClick={handleUpgrade}>Confirm Upgrade</Button>
          <Button onClick={() => setShowUpgradeDialog(false)}>Cancel</Button>
        </div>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
}
