import { useCallback } from 'react';
import useRentControl from './useRentControl';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (description?: string) => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem RSHARE from Masonry';
    handleTransactionReceipt(rentControl.exitFromMasonry(), alertDesc);
  }, [rentControl, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
