import { useCallback } from 'react';
import useRentControl from './useRentControl';
import { Bank } from '../rent-control';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(rentControl.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, rentControl, handleTransactionReceipt]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;
