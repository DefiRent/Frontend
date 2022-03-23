import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import { LPStat } from '../rent-control/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchLpPrice() {
      try{
        setStat(await rentControl.getLPStat(lpTicker));
      }
      catch(err){
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, rentControl, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
