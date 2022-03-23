import { useCallback } from 'react';
import useRentControl from './useRentControl';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromMasonry = () => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        rentControl.withdrawShareFromMasonry(amount),
        `Withdraw ${amount} RSHARE from the masonry`,
      );
    },
    [rentControl, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromMasonry;
