import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import CashImage from '../../assets/img/crypto_rent_cash.svg';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useRentStats from '../../hooks/useRentStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import userShareStats from '../../hooks/userShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { rent as rentTesting, rShare as rShareTesting } from '../../rent-control/deployments/deployments.testing.json';
import { rent as rentProd, rShare as rShareProd } from '../../rent-control/deployments/deployments.mainnet.json';

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useRentControl from '../../hooks/useRentControl';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const rentFtmLpStats = useLpStats('RENT-FTM-LP');
  const rShareFtmLpStats = useLpStats('RSHARE-FTM-LP');
  const rentStats = useRentStats();
  const rShareStats = userShareStats();
  const rBondStats = useBondStats();
  const rentControl = useRentControl();

  let rent;
  let rShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    rent = rentTesting;
    rShare = rShareTesting;
  } else {
    rent = rentProd;
    rShare = rShareProd;
  }

  const buyRentAddress = 'https://spookyswap.finance/swap?outputCurrency=' + rent.address;
  const buyRShareAddress = 'https://spookyswap.finance/swap?outputCurrency=' + rShare.address;

  const rentLPStats = useMemo(() => (rentFtmLpStats ? rentFtmLpStats : null), [rentFtmLpStats]);
  const rshareLPStats = useMemo(() => (rShareFtmLpStats ? rShareFtmLpStats : null), [rShareFtmLpStats]);
  const rentPriceInDollars = useMemo(
    () => (rentStats ? Number(rentStats.priceInDollars).toFixed(2) : null),
    [rentStats],
  );
  const rentPriceInFTM = useMemo(() => (rentStats ? Number(rentStats.tokenInFtm).toFixed(4) : null), [rentStats]);
  const rentCirculatingSupply = useMemo(() => (rentStats ? String(rentStats.circulatingSupply) : null), [rentStats]);
  const rentTotalSupply = useMemo(() => (rentStats ? String(rentStats.totalSupply) : null), [rentStats]);

  const rSharePriceInDollars = useMemo(
    () => (rShareStats ? Number(rShareStats.priceInDollars).toFixed(2) : null),
    [rShareStats],
  );
  const rSharePriceInFTM = useMemo(
    () => (rShareStats ? Number(rShareStats.tokenInFtm).toFixed(4) : null),
    [rShareStats],
  );
  const rShareCirculatingSupply = useMemo(
    () => (rShareStats ? String(rShareStats.circulatingSupply) : null),
    [rShareStats],
  );
  const rShareTotalSupply = useMemo(() => (rShareStats ? String(rShareStats.totalSupply) : null), [rShareStats]);

  const rBondPriceInDollars = useMemo(
    () => (rBondStats ? Number(rBondStats.priceInDollars).toFixed(2) : null),
    [rBondStats],
  );
  const rBondPriceInFTM = useMemo(() => (rBondStats ? Number(rBondStats.tokenInFtm).toFixed(4) : null), [rBondStats]);
  const rBondCirculatingSupply = useMemo(
    () => (rBondStats ? String(rBondStats.circulatingSupply) : null),
    [rBondStats],
  );
  const rBondTotalSupply = useMemo(() => (rBondStats ? String(rBondStats.totalSupply) : null), [rBondStats]);

  const rentLpZap = useZap({ depositTokenName: 'RENT-FTM-LP' });
  const rshareLpZap = useZap({ depositTokenName: 'RSHARE-FTM-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
  `;

  const [onPresentRentZap, onDissmissRentZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        rentLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissRentZap();
      }}
      tokenName={'RENT-FTM-LP'}
    />,
  );

  const [onPresentRshareZap, onDissmissRshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        rshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissRshareZap();
      }}
      tokenName={'RSHARE-FTM-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid container item xs={12} sm={4} justify="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
          <Image color="none" style={{ width: '300px', paddingTop: '0px' }} src={CashImage} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4}>
              <h2>Welcome to the Rent Control Protocol</h2>
              <p>The first algorithmic stablecoin on Fantom Opera, pegged to the price of 1 FTM via seigniorage.</p>
              <p>
                Stake your RENT-FTM LP in the Cemetery to earn RSHARE rewards.
                Then stake your earned RSHARE in the Masonry to earn more RENT!
              </p>
            </Box>
          </Paper>



        </Grid>

        <Grid container spacing={3}>
    <Grid item  xs={12} sm={12} justify="center"  style={{ margin: '12px', display: 'flex' }}>
            <Alert variant="filled" severity="warning">
              <b>
      Please visit our <StyledLink target="_blank" href="https://docs.rend.defi">documentation</StyledLink> before purchasing RENT or RSHARE!</b>
            </Alert>
        </Grid>
        </Grid>

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button color="primary" href="/masonry" variant="contained" style={{ marginRight: '10px' }}>
                Stake Now
              </Button>
              <Button href="/cemetery" variant="contained" style={{ marginRight: '10px' }}>
                Farm Now
              </Button>
              <Button
                color="primary"
                target="_blank"
                href={buyRentAddress}
                variant="contained"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy RENT
              </Button>
              <Button variant="contained" target="_blank" href={buyRShareAddress} className={classes.button}>
                Buy RSHARE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* RENT */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>RENT</h2>
              <Button
                onClick={() => {
                  rentControl.watchAssetInMetamask('RENT');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="RENT" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{rentPriceInFTM ? rentPriceInFTM : '-.----'} FTM</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${rentPriceInDollars ? rentPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(rentCirculatingSupply * rentPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {rentCirculatingSupply} <br />
                Total Supply: {rentTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* RSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>RSHARE</h2>
              <Button
                onClick={() => {
                  rentControl.watchAssetInMetamask('RSHARE');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="RSHARE" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{rSharePriceInFTM ? rSharePriceInFTM : '-.----'} FTM</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${rSharePriceInDollars ? rSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(rShareCirculatingSupply * rSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {rShareCirculatingSupply} <br />
                Total Supply: {rShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* RBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>RBOND</h2>
              <Button
                onClick={() => {
                  rentControl.watchAssetInMetamask('RBOND');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="RBOND" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{rBondPriceInFTM ? rBondPriceInFTM : '-.----'} FTM</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${rBondPriceInDollars ? rBondPriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(rBondCirculatingSupply * rBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {rBondCirculatingSupply} <br />
                Total Supply: {rBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>RENT-FTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="RENT-FTM-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" disabled={true} onClick={onPresentRentZap} variant="contained">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {rentLPStats?.tokenAmount ? rentLPStats?.tokenAmount : '-.--'} RENT /{' '}
                  {rentLPStats?.ftmAmount ? rentLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${rentLPStats?.priceOfOne ? rentLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${rentLPStats?.totalLiquidity ? rentLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {rentLPStats?.totalSupply ? rentLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>RSHARE-FTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="RSHARE-FTM-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" onClick={onPresentRshareZap} variant="contained">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {rshareLPStats?.tokenAmount ? rshareLPStats?.tokenAmount : '-.--'} RSHARE /{' '}
                  {rshareLPStats?.ftmAmount ? rshareLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${rshareLPStats?.priceOfOne ? rshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${rshareLPStats?.totalLiquidity ? rshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {rshareLPStats?.totalSupply ? rshareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
