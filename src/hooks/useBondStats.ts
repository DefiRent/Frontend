import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import { TokenStat } from '../rent-control/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await rentControl.gerBondStat());
      }
      catch(err){
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, rentControl, slowRefresh]);

  return stat;
};

export default useBondStats;
