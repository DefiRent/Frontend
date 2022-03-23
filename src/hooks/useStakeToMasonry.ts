import { useCallback } from 'react';
import useRentControl from './useRentControl';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMasonry = () => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(rentControl.stakeShareToMasonry(amount), `Stake ${amount} RSHARE to the masonry`);
    },
    [rentControl, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
