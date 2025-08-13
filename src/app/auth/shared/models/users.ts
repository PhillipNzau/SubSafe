export interface RegisterUserModel {
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export interface LoginUserModel {
  email?: string;
  password?: string;
}

export interface UserModel {
  email: string;
  id: string;
  name: string;
}
export interface LoginUserResponseModel {
  status: number;
  token: string;
  user: UserModel;
}
