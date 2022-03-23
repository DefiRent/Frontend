import { useCallback, useEffect, useState } from 'react';
import useRentControl from './useRentControl';
import config from '../config';
import { BigNumber } from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const rentControl = useRentControl();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await rentControl.getRentPriceInLastTWAP());
  }, [rentControl]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch RENT price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, rentControl, fetchCashPrice]);

  return price;
};

export default useCashPriceInLastTWAP;
