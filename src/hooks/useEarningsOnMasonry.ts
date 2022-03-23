import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useRentControl from './useRentControl';
import useRefresh from './useRefresh';

const useEarningsOnMasonry = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await rentControl.getEarningsOnMasonry());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [isUnlocked, rentControl, slowRefresh]);

  return balance;
};

export default useEarningsOnMasonry;
