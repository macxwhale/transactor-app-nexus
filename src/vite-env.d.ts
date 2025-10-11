
/// <reference types="vite/client" />

interface Application {
  id: string;
  name: string;
  callback_url: string;
  consumer_key: string;
  consumer_secret: string;
  business_short_code: string;
  passkey: string;
  bearer_token: string;
  party_a: string;
  party_b: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  app_id: string;
  app_secret: string;
  transaction_type: 'CustomerBuyGoodsOnline' | 'CustomerPayBillOnline';
}
