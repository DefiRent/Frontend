import React from 'react';

//Graveyard ecosystem logos
import rentLogo from '../../assets/img/crypto_rent_cash.svg';
import rShareLogo from '../../assets/img/crypto_rent_share.svg';
import rentLogoPNG from '../../assets/img/crypto_rent_cash.f2b44ef4.png';
import rShareLogoPNG from '../../assets/img/crypto_rent_share.bf1a6c52.png';
import rBondLogo from '../../assets/img/crypto_rent_bond.svg';

import rentFtmLpLogo from '../../assets/img/rent_ftm_lp.png';
import rshareFtmLpLogo from '../../assets/img/rshare_ftm_lp.png';

import wftmLogo from '../../assets/img/ftm_logo_blue.svg';
import booLogo from '../../assets/img/spooky.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  RENT: rentLogo,
  RENTPNG: rentLogoPNG,
  RSHAREPNG: rShareLogoPNG,
  RSHARE: rShareLogo,
  RBOND: rBondLogo,
  WFTM: wftmLogo,
  BOO: booLogo,
  SHIBA: shibaLogo,
  ZOO: zooLogo,
  'RENT-FTM-LP': rentFtmLpLogo,
  'RSHARE-FTM-LP': rshareFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
