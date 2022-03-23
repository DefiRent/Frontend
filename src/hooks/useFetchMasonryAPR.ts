import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const rentControl = useRentControl();
  const { slowRefresh } = useRefresh(); 

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await rentControl.getMasonryAPR());
      } catch(err){
        console.error(err);
      }
    }
   fetchMasonryAPR();
  }, [setApr, rentControl, slowRefresh]);

  return apr;
};

export default useFetchMasonryAPR;
