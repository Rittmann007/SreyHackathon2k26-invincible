import { useContext, useState, useEffect } from "react";
import { Authcontext } from "../Auth.stateContext.jsx";
import { getuser, login, logout, register } from "../api/auth.api";
import { toast } from "react-toastify";

// custom hook for user and loading state handling
export default function useAuth() {
  const context = useContext(Authcontext);
  const { user, setuser, loading, setloading } = context;
  const [error, seterror] = useState(null);

  async function handleregister(payload) {
    setloading(true);
    seterror(null);
    try {
      const response = await register(payload);
      setuser({
        token: response.token,
        user: response.user,
        profile: response.profile,
      });
      toast.success("User created successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      seterror(errorMessage);
      throw error;
    } finally {
      setloading(false);
    }
  }

  async function handlelogin({ email, password }) {
    setloading(true);
    seterror(null);
    try {
      const response = await login({ email, password });
      setuser({
        token: response.token,
        user: response.user,
        profile: response.profile,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "login failed";
      seterror(errorMessage);
      throw error;
    } finally {
      setloading(false);
    }
  }

  async function handlelogout() {
    setloading(true);
    seterror(null);
    try {
      const response = await logout();
      setuser(null);
    } catch (error) {
      toast.error("Logout failed..");
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    async function getandsetuser() {
      try {
        const response = await getuser();
        setuser({
          token: response.token,
          user: response.user,
          profile: response.profile,
        });
      } catch (error) {
        const status = error?.response?.status;

        if (status === 401) {
          // Expected when user is logged out or token expired
          setuser(null);
        } else {
          // Real errors (server down, network, 500, etc.)
          toast.error("Cannot fetch user..");
        }
      } finally {
        setloading(false);
      }
    }
    getandsetuser();
  }, []);

  return {
    user,
    loading,
    handleregister,
    handlelogin,
    handlelogout,
    error,
    seterror,
  };
}
