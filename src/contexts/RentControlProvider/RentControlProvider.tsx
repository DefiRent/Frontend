import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import RentControl from '../../rent-control';
import config from '../../config';

export interface RentControlContext {
  rentControl?: RentControl;
}

export const Context = createContext<RentControlContext>({ rentControl: null });

export const RentControlProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [rentControl, setRentControl] = useState<RentControl>();

  useEffect(() => {
    if (!rentControl) {
      const rent = new RentControl(config);
      if (account) {
        // wallet was unlocked at initialization
        rent.unlockWallet(ethereum, account);
      }
      setRentControl(rent);
    } else if (account) {
      rentControl.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, rentControl]);

  return <Context.Provider value={{ rentControl }}>{children}</Context.Provider>;
};
