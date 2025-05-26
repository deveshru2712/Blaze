import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/api";

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  User: null,
  isLoading: true,
  signUp: async (credentials: SignUpType) => {
    set({ isLoading: true });
    try {
      const res = await api.post(`/auth/sign-up`, credentials);
      set({
        User: res.data.user,
        isLoading: false,
      });
      console.log(res.data.user);
      toast.success("Account created successfully 🔥");
    } catch (error: any) {
      console.log(error);
      set({ isLoading: false, User: null });
      toast.error(error.response.data.message);
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
      });

      toast.success("Successfully logged In 🔥");
    } catch (error: any) {
      console.log(error);
      set({ User: null, isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  authCheck: async () => {
    set({ isLoading: true });
    const { logOut } = get();
    try {
      const res = await api.post("/auth/verify");
      set({ User: res.data.user, isLoading: false });
      return null;
    } catch (error) {
      // logout the user if there is an error
      logOut();
      console.log(error);
      set({ User: null, isLoading: false });
      return null;
    }
  },
  logOut: async () => {
    set({ isLoading: true });
    try {
      await api.post(`/auth/logout`);
      set({ User: null, isLoading: false });
      toast.success("Successfully logged out 👋");
      return null;
    } catch (error: any) {
      console.log("An error occurred while logging out:", error);
      set({ isLoading: false });
      toast.error(error.response.data.message);
      return null;
    }
  },
}));
