export interface CreateSubscriptionsModel {
  service_name: string;
  plan_name: string;
  start_date: string;
  renewal_date: string;
  price: string;
  currency: string;
  status: string;
  notes: string;
}

export interface SubscriptionsResponseModel {
  id: string;
  user_id: string;
  service_name: string;
  plan_name: string;
  price: string;
  currency: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  renewal_date: string;
}
