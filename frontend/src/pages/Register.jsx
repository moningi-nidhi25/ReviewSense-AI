import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Button, Input, showErrorToast, showSuccessToast } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { googleLoginUrl, githubLoginUrl } from "../services/api";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email.trim(), password);
      showSuccessToast("Account created — welcome!");
      navigate("/pages/Dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail || "Could not create your account.";
      setError(message);
      showErrorToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 dark:bg-gray-900 min-h-screen">
      <Card
        title="Create Your Account"
        description="Join Review Sense AI to start turning guest feedback into insight."
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <p className="font-label text-xs text-clay dark:text-clay-dark">{error}</p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-line dark:bg-line-dark" />
              <span className="font-label text-[10px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                or continue with
              </span>
              <div className="h-px flex-1 bg-line dark:bg-line-dark" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a href={googleLoginUrl} className="w-full">
                <Button type="button" variant="outline" className="w-full">
                  Google
                </Button>
              </a>
              <a href={githubLoginUrl} className="w-full">
                <Button type="button" variant="outline" className="w-full">
                  GitHub
                </Button>
              </a>
            </div>

            <p className="text-center text-sm text-ink-soft dark:text-ink-soft-dark">
              Already have an account?
              <Link to="/pages/Login" className="text-forest ml-1 hover:underline dark:text-forest-dark">
                Sign In
              </Link>
            </p>
          </form>
        }
      />
    </div>
  );
}

export default Register;
