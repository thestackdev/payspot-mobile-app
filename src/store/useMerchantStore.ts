import {create} from 'zustand';

export interface MerchantResponse {
  user: User;
  banks_list: BanksList[];
  onboarded: Onboarded;
  masked_aadhar: string;
  time: string;
  now: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  device_uuids: string;
  response_json: any;
  adhar_api_count: number;
  pan_api_count: number;
  bank_api_count: number;
  parent_id: number;
  current_balance: number;
  blocked_balance: number;
  phone: string;
  agent_id: string;
  address: string;
  statecode: string;
  pincode: string;
  city: string;
  bank_cheque: string;
  pan_card: string;
  aadhar_card: string;
  aadhar_card_back: string;
  front_photo: string;
  aadhar_number: string;
  bank_branch: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_account_type: string;
  pan_number: string;
  gst_license_number: any;
  shop_address_proof: any;
  gst_license_certificate: any;
  business_address: string;
  business_phone: string;
  employees: string;
  shop_name: string;
  identification_document: any;
  avatar: string;
  status: string;
  email_verified_at: string;
  tpin: string;
  settings: any;
  latitude: string;
  longitude: string;
  remarks: any;
  created_at: string;
  updated_at: string;
}

export interface BanksList {
  id: number;
  bankName: string;
  iinno: string;
  activeFlag: number;
  aadharpayiinno?: string;
  created_at: string;
  updated_at: string;
}

export interface Onboarded {
  id: number;
  merchant_id: number;
  status: number;
  application_status: string;
  last_authenticated_at: string;
  response: any;
  submitted_data: string;
  cpId: string;
  default_device: string;
  default_port: string;
  created_at: string;
  updated_at: string;
}

interface MerchantStore {
  merchant: MerchantResponse | null;
  setMerchant: (merchant: MerchantResponse) => void;
}

const useMerchantStore = create<MerchantStore>(set => ({
  merchant: null,
  setMerchant: merchant => set({merchant}),
}));

export default useMerchantStore;
