import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Button, Input, showErrorToast, showSuccessToast } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { googleLoginUrl } from "../services/api";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/pages/Dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      showSuccessToast("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail || "Invalid email or password.";
      setError(message);
      showErrorToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 dark:bg-gray-900 min-h-screen">
      <Card
        title="Welcome to Review Sense AI"
        description="Sign in to analyze customer reviews, track sentiment trends, and uncover actionable insights."
        action={
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="font-label text-xs text-clay dark:text-clay-dark">{error}</p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing In..." : "Sign In"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-line dark:bg-line-dark" />
              <span className="font-label text-[10px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                or continue with
              </span>
              <div className="h-px flex-1 bg-line dark:bg-line-dark" />
            </div>

            <div>
              <a href={googleLoginUrl} className="w-full">
                <Button type="button" variant="outline" className="w-full">
                  Continue with Google
                </Button>
              </a>
            </div>

            <p className="text-center text-sm text-ink-soft dark:text-ink-soft-dark">
              Don't have an account?
              <Link to="/pages/Register" className="text-forest ml-1 hover:underline dark:text-forest-dark">
                Sign Up
              </Link>
            </p>
          </form>
        }
      />
    </div>
  );
}

export default Login;
