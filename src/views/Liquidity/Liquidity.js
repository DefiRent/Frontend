import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png';
import useLpStats from '../../hooks/useLpStats';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import useRentStats from '../../hooks/useRentStats';
import TokenInput from '../../components/TokenInput';
import useRentControl from '../../hooks/useRentControl';
import { useWallet } from 'use-wallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApproveTaxOffice from '../../hooks/useApproveTaxOffice';
import { ApprovalState } from '../../hooks/useApprove';
import useProvideRentFtmLP from '../../hooks/useProvideRentFtmLP';
import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const ProvideLiquidity = () => {
  const [rentAmount, setRentAmount] = useState(0);
  const [ftmAmount, setFtmAmount] = useState(0);
  const [lpTokensAmount, setLpTokensAmount] = useState(0);
  const { balance } = useWallet();
  const rentStats = useRentStats();
  const rentControl = useRentControl();
  const [approveTaxOfficeStatus, approveTaxOffice] = useApproveTaxOffice();
  const rentBalance = useTokenBalance(rentControl.RENT);
  const ftmBalance = (balance / 1e18).toFixed(4);
  const { onProvideRentFtmLP } = useProvideRentFtmLP();
  const rentFtmLpStats = useLpStats('RENT-FTM-LP');

  const rentLPStats = useMemo(() => (rentFtmLpStats ? rentFtmLpStats : null), [rentFtmLpStats]);
  const rentPriceInFTM = useMemo(() => (rentStats ? Number(rentStats.tokenInFtm).toFixed(2) : null), [rentStats]);
  const ftmPriceInRENT = useMemo(() => (rentStats ? Number(1 / rentStats.tokenInFtm).toFixed(2) : null), [rentStats]);
  // const classes = useStyles();

  const handleRentChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setRentAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setRentAmount(e.currentTarget.value);
    const quoteFromSpooky = await rentControl.quoteFromSpooky(e.currentTarget.value, 'RENT');
    setFtmAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / rentLPStats.ftmAmount);
  };

  const handleFtmChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setFtmAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setFtmAmount(e.currentTarget.value);
    const quoteFromSpooky = await rentControl.quoteFromSpooky(e.currentTarget.value, 'FTM');
    setRentAmount(quoteFromSpooky);

    setLpTokensAmount(quoteFromSpooky / rentLPStats.tokenAmount);
  };
  const handleRentSelectMax = async () => {
    const quoteFromSpooky = await rentControl.quoteFromSpooky(getDisplayBalance(rentBalance), 'RENT');
    setRentAmount(getDisplayBalance(rentBalance));
    setFtmAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / rentLPStats.ftmAmount);
  };
  const handleFtmSelectMax = async () => {
    const quoteFromSpooky = await rentControl.quoteFromSpooky(ftmBalance, 'FTM');
    setFtmAmount(ftmBalance);
    setRentAmount(quoteFromSpooky);
    setLpTokensAmount(ftmBalance / rentLPStats.ftmAmount);
  };
  return (
    <Page>
      <BackgroundImage />
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Provide Liquidity
      </Typography>

      <Grid container justify="center">
        <Box style={{ width: '600px' }}>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '10px' }}>
            <b>This and <a href="https://spookyswap.finance/"  rel="noopener noreferrer" target="_blank">Spookyswap</a> are the only ways to provide Liquidity on RENT-FTM pair without paying tax.</b>
          </Alert>
          <Grid item xs={12} sm={12}>
            <Paper>
              <Box mt={4}>
                <Grid item xs={12} sm={12} style={{ borderRadius: 15 }}>
                  <Box p={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleRentSelectMax}
                          onChange={handleRentChange}
                          value={rentAmount}
                          max={getDisplayBalance(rentBalance)}
                          symbol={'RENT'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleFtmSelectMax}
                          onChange={handleFtmChange}
                          value={ftmAmount}
                          max={ftmBalance}
                          symbol={'FTM'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <p>1 RENT = {rentPriceInFTM} FTM</p>
                        <p>1 FTM = {ftmPriceInRENT} RENT</p>
                        <p>LP tokens ≈ {lpTokensAmount.toFixed(2)}</p>
                      </Grid>
                      <Grid xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                        {approveTaxOfficeStatus === ApprovalState.APPROVED ? (
                          <Button
                            variant="contained"
                            onClick={() => onProvideRentFtmLP(ftmAmount.toString(), rentAmount.toString())}
                            color="primary"
                            style={{ margin: '0 10px', color: '#fff' }}
                          >
                            Supply
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => approveTaxOffice()}
                            color="secondary"
                            style={{ margin: '0 10px' }}
                          >
                            Approve
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};

export default ProvideLiquidity;
