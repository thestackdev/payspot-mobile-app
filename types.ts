export interface User {
  AEPS_MATM_Settlement_IMPS_enabled: number;
  AEPS_MATM_Settlement_NEFT_enabled: number;
  aadhar_card: string;
  aadhar_card_back: string;
  aadhar_number: string;
  address: string;
  adhar_api_count: number;
  agent_id: string;
  avatar: string;
  bank_account_number: string;
  bank_account_type: string;
  bank_api_count: number;
  bank_branch: string;
  bank_cheque: string;
  bank_ifsc: string;
  blocked_balance: number;
  business_address: string;
  business_phone: string;
  city: string;
  created_at: string;
  current_balance: number;
  device_uuids: string;
  disable: number;
  dmt_registered: number;
  email: string;
  email_verified_at: string;
  employees: string;
  front_photo: string;
  gst_license_certificate: any;
  gst_license_number: any;
  id: number;
  identification_document: any;
  kyc_domestic_money_transfer_enabled: number;
  latitude: string;
  link_pay_enabled: number;
  longitude: string;
  name: string;
  pan_api_count: number;
  pan_card: string;
  pan_number: string;
  parent_id: number;
  phone: string;
  pincode: string;
  ppi_wallet_transfer_enabled: number;
  qr_code_enabled: number;
  remarks: any;
  response_json: any;
  settings: any;
  shop_address_proof: any;
  shop_name: string;
  statecode: string;
  status: string;
  tpin: string;
  updated_at: string;
}

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

  Login: undefined;
  OTP: {session: string; otp: string; user: User; token: string};

  AEPSScreen: undefined;

  Webpage: {url: string; title: string};
};
