import { useEffect, useState } from 'react';
import useRentControl from './../useRentControl';
import { AllocationTime } from '../../rent-control/types';

const useUnstakeTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const rentControl = useRentControl();

  useEffect(() => {
    if (rentControl) {
      rentControl.getUserUnstakeTime().then(setTime);
    }
  }, [rentControl]);
  return time;
};

export default useUnstakeTimerMasonry;
