import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/api";

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  User: null,
  isLoading: true,
  accessToken: null,
  signUp: async (credentials: SignUpType) => {
    set({ isLoading: true });
    try {
      console.log(credentials);
      const res = await api.post(`/auth/sign-up`);
      console.log(res.data.user);
      set({
        User: res.data.user,
        isLoading: false,
        accessToken: res.data.accessToken,
      });
      toast("Account created successfully 🔥");
    } catch (error) {
      console.log(error);
      set({ isLoading: false, User: null, accessToken: null });
      toast("Unable to create an account 🥲");
    }
  },
  logIn: async (credentials: SignInType) => {
    set({ isLoading: true });
    try {
      const res = await api.post(`/auth/sign-in`, credentials);
      console.log(res.data.user);

      set({
        isLoading: false,
        User: res.data.user,
        accessToken: res.data.accessToken,
      });
      toast("Successfully logged In 🔥");
    } catch (error) {
      console.log(error);
      set({ User: null, accessToken: null, isLoading: false });
      toast("Unable login 🥲");
    }
  },
  refreshToken: async () => {
    // set({ isLoading: true });
    // try {
    //   const res = await api.post("/auth/refresh");
    //   const newAccessToken = res.data.accessToken;
    //   set({ accessToken: newAccessToken, isLoading: false });
    // } catch (error) {
    //   console.log(error);
    //   // logout the user as the token has expired
    //   get().logOut();
    //   set({ User: null, isLoading: false });
    // }
  },
  handleAuthError: async () => {},
  authCheck: async () => {
    set({ isLoading: true });
    const { refreshToken, logOut } = get();
    try {
      const res = await api("/auth/verify");

      if (!res.data.success && res.data.action == "refresh") {
        // call refresh token
        refreshToken();
      } else if (!res.data.success && res.data.action == "reauthenticate") {
        // logout the user
        logOut();
      }
      set({ User: res.data.user, isLoading: false });
    } catch (error) {
      set({ User: null, isLoading: false });
      console.log(error);
    }
  },
  logOut: async () => {
    set({ isLoading: true });
    try {
      await api.post(`/auth/logout`);
      set({ User: null, accessToken: null, isLoading: false });
    } catch (error) {
      console.log("An error occurred while logging out:", error);
      set({ isLoading: false });
    }
  },
}));
