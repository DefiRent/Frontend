import { useCallback } from 'react';
import useRentControl from './useRentControl';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromMasonry = () => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(rentControl.harvestCashFromMasonry(), 'Claim RENT from Masonry');
  }, [rentControl, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromMasonry;
