import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import useRentControl from './../useRentControl';

const useClaimRewardCheck = () => {
  const  { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await rentControl.canUserClaimRewardFromMasonry());
      } catch(err){
        console.error(err);
      };
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, rentControl]);

  return canClaimReward;
};

export default useClaimRewardCheck;
