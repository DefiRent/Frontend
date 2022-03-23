import { useCallback, useEffect, useState } from 'react';
import useRentControl from '../useRentControl';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

const useEstimateRShare = (rbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const { account } = useWallet();
  const rentControl = useRentControl();

  const estimateAmountOfRShare = useCallback(async () => {
    const rbondAmountBn = parseUnits(rbondAmount);
    const amount = await rentControl.estimateAmountOfRShare(rbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfRShare().catch((err) => console.error(`Failed to get estimateAmountOfRShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfRShare]);

  return estimateAmount;
};

export default useEstimateRShare;