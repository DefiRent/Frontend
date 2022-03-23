import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useRentControl from './useRentControl';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const rentControl = useRentControl();

  useEffect(() => {
    if (rentControl) {
      const { Treasury } = rentControl.contracts;
      rentControl.RENT.balanceOf(Treasury.address).then(setAmount);
    }
  }, [rentControl]);
  return amount;
};

export default useTreasuryAmount;
