export class Account {
  id = -1;
  first_name: string = '';
  last_name: string = '';
  full_name: string = '';
  phone: number;
  email: string = '';
  url: string = '';
  image_url: string = '';
  image_id: number = null;
  pwa: string = '';
  screen_name: string = '';
  account_owner: boolean = false;
  receive_announcements: number;
  bio: string = '';
  has_full_permissions: boolean = true;
  permissions: any = [];
  user_type: string = '';
  phone_validated: boolean = false;
  tfa_enabled: boolean = false;
  last_login_at: string = '';
  password: string = '';
}
