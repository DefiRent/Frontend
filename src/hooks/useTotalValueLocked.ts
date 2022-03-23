import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const { slowRefresh } = useRefresh();
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await rentControl.getTotalValueLocked());
      }
      catch(err){
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, rentControl, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;
