import { useEffect, useState } from 'react';
import useRentControl from '../useRentControl';
import { RShareSwapperStat } from '../../rent-control/types';
import useRefresh from '../useRefresh';

const useRShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<RShareSwapperStat>();
  const { fastRefresh/*, slowRefresh*/ } = useRefresh();
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchRShareSwapperStat() {
      try{
        if(rentControl.myAccount) {
          setStat(await rentControl.getRShareSwapperStat(account));
        }
      }
      catch(err){
        console.error(err);
      }
    }
    fetchRShareSwapperStat();
  }, [setStat, rentControl, fastRefresh, account]);

  return stat;
};

export default useRShareSwapperStats;