export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface IUsersState {
  users: IUser[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}


export interface IAuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}
