function Footer() {
  return (
    <footer className="bg-gray-100 mt-10 dark:bg-gray-800">
      <div className="text-center py-2">
        <div className="flex flex-wrap justify-center gap-5 my-3">
          <a href="https://github.com/moningi-nidhi25/ReviewSense-AI" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            GitHub
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            LinkedIn
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Contact
          </a>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2026 ReviewSense AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
