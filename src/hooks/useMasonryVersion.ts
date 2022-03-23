import { useCallback, useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import useStakedBalanceOnMasonry from './useStakedBalanceOnMasonry';

const useMasonryVersion = () => {
  const [masonryVersion, setMasonryVersion] = useState('latest');
  const rentControl = useRentControl();
  const stakedBalance = useStakedBalanceOnMasonry();

  const updateState = useCallback(async () => {
    setMasonryVersion(await rentControl.fetchMasonryVersionOfUser());
  }, [rentControl?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (rentControl?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [rentControl?.isUnlocked, stakedBalance]);

  return masonryVersion;
};

export default useMasonryVersion;
