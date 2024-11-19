export type RootStackParamList = {
  Home: undefined;
  Authenticate: undefined;
  Transactions: undefined;
  CashWithdrawal: {
    amount: number;
    aadhar: string;
    mobile: string;
    bank: number | null;
    selectedDevice: string;
  };
  BalanceEnquiry: {
    data: any;
  };
  MiniStatement: {
    data: any;
  };
  SelectBank: undefined;
  KYCAuth: undefined;
  CheckPhoneNumberForDMT: undefined;
  DomesticMoneyTransfer: {
    mobile: string;
  };
};
