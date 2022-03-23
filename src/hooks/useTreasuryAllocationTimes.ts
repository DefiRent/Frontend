import { useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import { AllocationTime } from '../rent-control/types';
import useRefresh from './useRefresh';


const useTreasuryAllocationTimes = () => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const rentControl = useRentControl();
  useEffect(() => {
    if (rentControl) {
      rentControl.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [rentControl, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
