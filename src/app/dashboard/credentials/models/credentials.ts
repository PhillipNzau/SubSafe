export interface CreateCredentialsModel {
  site_name?: string;
  username?: string;
  password?: string;
  login_url?: string;
  notes?: string;
  category?: string;
}

export interface CredentialsResponseModel {
  category: string;
  created_at: string;
  id: string;
  login_url: string;
  notes: string;
  password: string;
  site_name: string;
  updated_at: string;
  username: string;
}
