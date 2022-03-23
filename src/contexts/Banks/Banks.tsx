import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useRentControl from '../../hooks/useRentControl';
import { Bank } from '../../rent-control';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const rentControl = useRentControl();
  const isUnlocked = rentControl?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!rentControl.isUnlocked) continue;

        // only show pools staked by user
        const balance = await rentControl.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          rentControl.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: rentControl.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'RENT' ? rentControl.RENT : rentControl.RSHARE,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [rentControl, setBanks]);

  useEffect(() => {
    if (rentControl) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, rentControl, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
