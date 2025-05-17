import { create } from "zustand";
import axios from "axios";

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>((set) => ({
  User: null,
  isLoading: true,
  accessToken: null,
  signUp: async (credentials: SignUpType) => {
    set({ isLoading: true });
    try {
      console.log(credentials);
      const res = await axios.post(
        `http://localhost:5000/api/auth/sign-up`,
        credentials,
        { withCredentials: true }
      );
      console.log(res.data.user);
      set({
        User: res.data.user,
        isLoading: false,
        accessToken: res.data.accessToken,
      });
    } catch (error) {
      console.log(error);
      set({ isLoading: false, User: null, accessToken: null });
    }
  },
  logIn: async (credentials: SignInType) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/sign-in`,
        credentials
      );
      console.log(res.data.user);

      set({
        isLoading: false,
        User: res.data.user,
        accessToken: res.data.accessToken,
      });
    } catch (error) {
      console.log(error);
      set({ User: null, accessToken: null, isLoading: false });
    }
  },
  authCheck: () => {},
  logOut: () => {},
}));
