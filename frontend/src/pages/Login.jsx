import Card from "../components/Card";

function Login() {
  return (
    <div className="flex items-center justify-center p-4 dark:bg-gray-900 min-h-screen">
      <Card
        title="Welcome to Review Sense AI"
        description="Sign in to analyze customer reviews, track sentiment trends, and uncover actionable insights."
        action={
          <form className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />

            <button
              type="submit"
              className="w-full bg-forest text-white py-2 rounded-lg hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?
              <span className="text-green-600 ml-1 dark:text-green-400 ">
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