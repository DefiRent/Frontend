import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../rent-control/ERC20';
import useRentControl from './useRentControl';
import config from '../config';

const useTokenBalance = (token: ERC20) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    setBalance(await token.balanceOf(rentControl.myAccount));
  }, [token, rentControl.myAccount]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(`Failed to fetch token balance: ${err.stack}`));
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [isUnlocked, token, fetchBalance, rentControl]);

  return balance;
};

export default useTokenBalance;
