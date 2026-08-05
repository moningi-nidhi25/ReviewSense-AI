import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/api";
import { Loader } from "../components/ui";
import { showErrorToast } from "../components/ui";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get("token");
    if (!token) {
      showErrorToast("OAuth sign-in failed. Please try again.");
      navigate("/pages/Login", { replace: true });
      return;
    }

    // Stash the token so the authenticated request below picks it up.
    localStorage.setItem("access_token", token);

    getCurrentUser()
      .then((res) => {
        loginWithToken(token, res.data);
        navigate("/pages/Dashboard", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        showErrorToast("Could not complete sign-in.");
        navigate("/pages/Login", { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <Loader size="lg" />
      <p className="font-label text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
        Finishing sign-in...
      </p>
    </div>
  );
}
