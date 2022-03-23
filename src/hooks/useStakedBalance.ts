import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useRentControl from './useRentControl';
import { ContractName } from '../rent-control';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await rentControl.stakedBalanceOnBank(poolName, poolId, rentControl.myAccount);
    setBalance(balance);
  }, [poolName, poolId, rentControl]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, setBalance, rentControl, fetchBalance]);

  return balance;
};

export default useStakedBalance;
