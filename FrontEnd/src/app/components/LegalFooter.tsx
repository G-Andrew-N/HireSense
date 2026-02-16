import { Link } from "react-router";

export function LegalFooter() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2026 HireSense. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link
              to="/terms-of-service"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:legal@hiresense.ai"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
