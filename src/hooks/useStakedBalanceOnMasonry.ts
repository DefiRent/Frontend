import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useRentControl from './useRentControl';
import useRefresh from './useRefresh';

const useStakedBalanceOnMasonry = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await rentControl.getStakedSharesOnMasonry());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, rentControl]);
  return balance;
};

export default useStakedBalanceOnMasonry;
