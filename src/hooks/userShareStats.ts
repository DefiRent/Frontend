import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import { TokenStat } from '../rent-control/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await rentControl.gerShareStat());
      } catch(err){
        console.error(err)
      }
    }
    fetchSharePrice();
  }, [setStat, rentControl, slowRefresh]);

  return stat;
};

export default useShareStats;
