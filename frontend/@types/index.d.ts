type FormType = "sign-in" | "sign-up";

type AuthFormValues = {
  email: string;
  password: string;
} & (type extends "sign-up" ? { username: string } : { username?: never });

interface CardProps {
  icon: string;
  title: string;
  category: string;
  description: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface SignUpType {
  username: string;
  email: string;
  password: string;
}

interface SignInType {
  email: string;
  password: string;
}

interface AuthStoreState {
  User: User | null;
  isLoading: boolean;
  accessToken: string | null;
}

interface AuthStoreActions {
  signUp: (credentials: SignUpType) => Promise<void>;
  logIn: (credentials: SignInType) => Promise<void>;
  logOut: () => void;
  authCheck: () => void;
}
