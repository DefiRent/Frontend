import { useCallback } from 'react';
import useRentControl from './useRentControl';
import { Bank } from '../rent-control';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useZap = (bank: Bank) => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string) => {
      handleTransactionReceipt(
        rentControl.zapIn(zappingToken, tokenName, amount),
        `Zap ${amount} in ${bank.depositTokenName}.`,
      );
    },
    [bank, rentControl, handleTransactionReceipt],
  );
  return { onZap: handleZap };
};

export default useZap;
