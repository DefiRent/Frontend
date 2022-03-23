import { useCallback } from 'react';
import useRentControl from '../useRentControl';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';


const useSwapRBondToRShare = () => {
  const rentControl = useRentControl();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapRShare = useCallback(
  	(rbondAmount: string) => {
	  	const rbondAmountBn = parseUnits(rbondAmount, 18);
	  	handleTransactionReceipt(
	  		rentControl.swapRBondToRShare(rbondAmountBn),
	  		`Swap ${rbondAmount} RBond to RShare`
	  	);
  	},
  	[rentControl, handleTransactionReceipt]
  );
  return { onSwapRShare: handleSwapRShare };
};

export default useSwapRBondToRShare;