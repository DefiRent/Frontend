import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useRentControl from './useRentControl';
import useRefresh from './useRefresh';

const useTotalStakedOnMasonry = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const rentControl = useRentControl();
  const { slowRefresh } = useRefresh();
  const isUnlocked = rentControl?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await rentControl.getTotalStakedInMasonry());
      } catch(err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
     fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, rentControl]);

  return totalStaked;
};

export default useTotalStakedOnMasonry;
