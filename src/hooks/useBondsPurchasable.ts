import { /*useCallback,*/ useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
/*import ERC20 from '../rent-control/ERC20';*/
import useRentControl from './useRentControl';
/*import config from '../config';*/

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const rentControl = useRentControl();

  useEffect(() => {
    async function fetchBondsPurchasable() {
        try {
            setBalance(await rentControl.gerBondsPurchasable());
        }
        catch(err) {
            console.error(err);
        }
      }
    fetchBondsPurchasable();
  }, [setBalance, rentControl]);

  return balance;
};

export default useBondsPurchasable;
