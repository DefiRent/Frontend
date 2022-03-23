import React, { /* useCallback, useEffect,*/ useMemo, useState } from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/pit.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box,/* Paper, Typography,*/ Button, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useRentControl from '../../hooks/useRentControl';
import { getDisplayBalance/*, getBalance*/ } from '../../utils/formatBalance';
import { BigNumber/*, ethers*/ } from 'ethers';
import useSwapRBondToRShare from '../../hooks/RShareSwapper/useSwapRBondToRShare';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useRShareSwapperStats from '../../hooks/RShareSwapper/useRShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Sbs: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const rentControl = useRentControl();
  const [rbondAmount, setRbondAmount] = useState('');
  const [rshareAmount, setRshareAmount] = useState('');

  const [approveStatus, approve] = useApprove(rentControl.RBOND, rentControl.contracts.RShareSwapper.address);
  const { onSwapRShare } = useSwapRBondToRShare();
  const rshareSwapperStat = useRShareSwapperStats(account);

  const rshareBalance = useMemo(() => (rshareSwapperStat ? Number(rshareSwapperStat.rshareBalance) : 0), [rshareSwapperStat]);
  const bondBalance = useMemo(() => (rshareSwapperStat ? Number(rshareSwapperStat.rbondBalance) : 0), [rshareSwapperStat]);

  const handleRBondChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setRbondAmount('');
      setRshareAmount('');
      return
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setRbondAmount(e.currentTarget.value);
    const updateRShareAmount = await rentControl.estimateAmountOfRShare(e.currentTarget.value);
    setRshareAmount(updateRShareAmount);  
  };

  const handleRBondSelectMax = async () => {
    setRbondAmount(String(bondBalance));
    const updateRShareAmount = await rentControl.estimateAmountOfRShare(String(bondBalance));
    setRshareAmount(updateRShareAmount); 
  };

  const handleRShareSelectMax = async () => {
    setRshareAmount(String(rshareBalance));
    const rateRSharePerRent = (await rentControl.getRShareSwapperStat(account)).rateRSharePerRent;
    const updateRBondAmount = ((BigNumber.from(10).pow(30)).div(BigNumber.from(rateRSharePerRent))).mul(Number(rshareBalance) * 1e6);
    setRbondAmount(getDisplayBalance(updateRBondAmount, 18, 6));
  };

  const handleRShareChange = async (e: any) => {
    const inputData = e.currentTarget.value;
    if (inputData === '') {
      setRshareAmount('');
      setRbondAmount('');
      return
    }
    if (!isNumeric(inputData)) return;
    setRshareAmount(inputData);
    const rateRSharePerRent = (await rentControl.getRShareSwapperStat(account)).rateRSharePerRent;
    const updateRBondAmount = ((BigNumber.from(10).pow(30)).div(BigNumber.from(rateRSharePerRent))).mul(Number(inputData) * 1e6);
    setRbondAmount(getDisplayBalance(updateRBondAmount, 18, 6));
  }

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="RBond -> RShare Swap" subtitle="Swap RBond to RShare" />
            </Route>
            <Box mt={5}>
              <Grid container justify="center" spacing={6}>
                <StyledBoardroom>
                  <StyledCardsWrapper>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>RBonds</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={rentControl.RBOND.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleRBondSelectMax}
                                onChange={handleRBondChange}
                                value={rbondAmount}
                                max={bondBalance}
                                symbol="RBond"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${bondBalance} RBOND Available in Wallet`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                    <Spacer size="lg"/>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>RShare</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={rentControl.RSHARE.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleRShareSelectMax}
                                onChange={handleRShareChange}
                                value={rshareAmount}
                                max={rshareBalance}
                                symbol="RShare"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${rshareBalance} RSHARE Available in Swapper`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
              
                    </StyledCardWrapper>
                  </StyledCardsWrapper>
                </StyledBoardroom>
              </Grid>
            </Box>

            <Box mt={5}>
              <Grid container justify="center">
                <Grid item xs={8}>
                  <Card>
                    <CardContent>
                      <StyledApproveWrapper>
                      {approveStatus !== ApprovalState.APPROVED ? (
                        <Button
                          disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                          color="primary"
                          variant="contained"
                          onClick={approve}
                          size="medium"
                        >
                          Approve RBOND
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => onSwapRShare(rbondAmount.toString())}
                          size="medium"
                        >
                          Swap
                        </Button>
                      )}
                      </StyledApproveWrapper>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledApproveWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDesc = styled.span``;

export default Sbs;
