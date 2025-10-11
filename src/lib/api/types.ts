
export interface ApiConfig {
  baseUrl?: string;
}

export interface Application {
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
  originator_conversation_id?: string;
  initiator_name?: string;
  initiator_password?: string;
  security_credential?: string;
  command_id?: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment';
  queue_timeout_url?: string;
  result_url?: string;
  transaction_type: 'CustomerBuyGoodsOnline' | 'CustomerPayBillOnline';
  environment: 'Production' | 'Development';
}

export interface Transaction {
  id: string;
  mpesa_receipt_number: string;
  phone_number: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  transaction_date: string;
  application_id: string;
  application_name?: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields from the database
  account_reference: string;
  transaction_desc: string;
  result_code?: number;
  result_desc?: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  completed_at?: string;
  narration?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
}
