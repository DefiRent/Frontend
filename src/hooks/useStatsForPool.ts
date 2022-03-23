import { useCallback, useState, useEffect } from 'react';
import useRentControl from './useRentControl';
import { Bank } from '../rent-control';
import { PoolStats } from '../rent-control/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const rentControl = useRentControl();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await rentControl.getPoolAPRs(bank));
  }, [rentControl, bank]);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch RBOND price: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, rentControl, fetchAPRsForPool]);

  return poolAPRs;
};

export default useStatsForPool;
