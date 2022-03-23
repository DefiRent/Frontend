import { useEffect, useState } from 'react';
import useRentControl from './../useRentControl';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const rentControl = useRentControl();
  const { slowRefresh } = useRefresh();
  const isUnlocked = rentControl?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await rentControl.canUserUnstakeFromMasonry());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, rentControl, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheck;
