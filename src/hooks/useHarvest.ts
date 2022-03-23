import { useCallback } from 'react';
import useRentControl from './useRentControl';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Bank } from '../rent-control';

const useHarvest = (bank: Bank) => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(
      rentControl.harvest(bank.contract, bank.poolId),
      `Claim ${bank.earnTokenName} from ${bank.contract}`,
    );
  }, [bank, rentControl, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvest;
