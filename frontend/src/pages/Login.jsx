import Card from "../components/Card";

function Login() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card
        title="Welcome to Review Sense AI"
        description="Sign in to analyze customer reviews, track sentiment trends, and uncover actionable insights."
        action={
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?
              <span className="text-green-600 ml-1">
                Sign Up
              </span>
            </p>
          </form>
        }
      />
    </div>
  );
}

export default Login;