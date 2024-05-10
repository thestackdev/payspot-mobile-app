export type RootStackParamList = {
  Home: undefined;
  Authenticate: undefined;
  Transactions: undefined;
  CashWithdrawal: {
    amount: number;
    aadhar: string;
    mobile: string;
    bank: string;
  };
  BalanceEnquiry: {
    data: any;
  };
  MiniStatement: {
    data: any;
  };
};
