import { useContext } from 'react';
import { Context } from '../contexts/RentControlProvider';

const useRentControl = () => {
  const { rentControl } = useContext(Context);
  return rentControl;
};

export default useRentControl;
