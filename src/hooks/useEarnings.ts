import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useRentControl from './useRentControl';
import { ContractName } from '../rent-control';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await rentControl.earnedFromBank(poolName, earnTokenName, poolId, rentControl.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, rentControl]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, rentControl, fetchBalance]);

  return balance;
};

export default useEarnings;
