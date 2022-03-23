import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import { TokenStat } from '../rent-control/types';
import useRefresh from './useRefresh';

const useRentStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchRentPrice(){
      try {
        setStat(await rentControl.getRentStat());
      }
      catch(err){
        console.error(err)
      }
    }
    fetchRentPrice();
  }, [setStat, rentControl, fastRefresh]);

  return stat;
};

export default useRentStats;
