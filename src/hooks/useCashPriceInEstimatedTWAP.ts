import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import { TokenStat } from '../rent-control/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const rentControl = useRentControl();
  const { slowRefresh } = useRefresh(); 

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await rentControl.getRentStatInEstimatedTWAP());
      }catch(err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, rentControl, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
