import { useCallback } from 'react';
import useRentControl from './useRentControl';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from '../utils/constants'

const useProvideRentFtmLP = () => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideRentFtmLP = useCallback(
    (ftmAmount: string, rentAmount: string) => {
      const rentAmountBn = parseUnits(rentAmount);
      handleTransactionReceipt(
        rentControl.provideRentFtmLP(ftmAmount, rentAmountBn),
        `Provide Rent-FTM LP ${rentAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [rentControl, handleTransactionReceipt],
  );
  return { onProvideRentFtmLP: handleProvideRentFtmLP };
};

export default useProvideRentFtmLP;
