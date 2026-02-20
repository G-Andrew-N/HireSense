import { Link, useNavigate } from "react-router";
import { Target, ArrowLeft } from "lucide-react";

export function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HireSense
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 md:p-12">
          {/* Title */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: February 16, 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                By accessing and using HireSense ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We reserve the right to update and change these Terms of Service by posting updates and changes to the HireSense website. You are advised to check the Terms of Service from time to time for any updates or changes that may impact you.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                HireSense provides an AI-powered job application automation platform that:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Analyzes resume content and matches it against job descriptions</li>
                <li>Provides interview probability scores for job postings</li>
                <li>Offers AI-generated insights for resume improvements</li>
                <li>Monitors job posting websites as configured by the user</li>
                <li>Provides dashboard analytics and application tracking</li>
              </ul>
            </section>

            {/* Job search coverage notice */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Job Search Coverage
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                HireSense can only search and monitor job postings available via the public sources
                we integrate with. The Service cannot search private, enterprise-only, or otherwise
                restricted listings that are not accessible through these supported sources. By creating
                an account and uploading a resume, you acknowledge that job discovery is limited to the
                coverage of the active job sources and that not all available positions on the internet
                or within specific organizations will be discoverable through HireSense.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5">
                Supported Job Sources
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                HireSense integrates with 12 major remote job boards across multiple specializations:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4 mb-4">
                <li><strong>Remote Generalists:</strong> Remotive, We Work Remotely, Remote.ok, JustRemote</li>
                <li><strong>Technology Focused:</strong> GitHub Jobs, Stack Overflow Jobs, DEV Community Jobs</li>
                <li><strong>Design Specialization:</strong> Dribbble Remote</li>
                <li><strong>General Job Boards:</strong> Indeed, LinkedIn, Glassdoor, ZipRecruiter</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5">
                Profession Detection & Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                HireSense uses artificial intelligence to analyze your resume and automatically detect
                your profession and industry. This enables the system to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4 mb-4">
                <li>Target job sources most relevant to your career field</li>
                <li>Identify opportunities that match your skills and experience level</li>
                <li>Provide profession-specific job search strategies</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic mb-4">
                Profession detection results are cached for 24 hours per resume to optimize system performance.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5">
                Match Score Methodology
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Jobs are analyzed against your resume and assigned a match probability score from 0-100:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4 mb-4">
                <li><strong>Score ≥ 25:</strong> Displayed as job matches with clear opportunity indicators</li>
                <li><strong>Score &lt; 25:</strong> May be shown for reference but are less likely to align with your qualifications</li>
              </ul>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We will also remind you of these limitations when you create an account and when you
                upload a resume.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                3. User Accounts and Responsibilities
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You must:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Not impersonate any person or entity</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
                <li>Not violate any laws in your jurisdiction</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                4. Data Usage and AI Processing
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                By using HireSense, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Your resume and profile data will be processed by AI algorithms to provide job matching and analysis services</li>
                <li>Job descriptions from monitored websites will be analyzed to calculate match scores</li>
                <li>Usage data and analytics will be collected to improve service quality</li>
                <li>All data processing complies with our Privacy Policy</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                5. Intellectual Property Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by HireSense and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You retain all rights to your resume content and personal data. By uploading content to HireSense, you grant us a license to use, modify, and process that content solely for the purpose of providing the Service.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                6. Prohibited Uses
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You may not use the Service:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>To spam, harass, or harm other users or third parties</li>
                <li>To scrape or collect data from job boards in violation of their terms of service</li>
                <li>To submit fraudulent or misleading information</li>
                <li>To interfere with or disrupt the Service or servers</li>
                <li>To attempt to gain unauthorized access to any portion of the Service</li>
                <li>To use automated systems or software to extract data from the Service</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                7. Service Availability and Accuracy
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                HireSense does not guarantee that:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>Job matches and probability scores are 100% accurate</li>
                <li>AI-generated insights will guarantee interview success</li>
                <li>All job postings from monitored sites will be captured</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                The Service is provided "as is" and "as available" without any warranties of any kind.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                In no event shall HireSense, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                9. Termination
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact our support team.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                10. Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">HireSense Support</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Email: legal@hiresense.ai</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Website: www.hiresense.ai</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link
            to="/privacy-policy"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
}