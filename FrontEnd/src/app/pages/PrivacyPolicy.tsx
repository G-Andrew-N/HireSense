import { Link, useNavigate } from "react-router";
import { Target, ArrowLeft } from "lucide-react";

export function PrivacyPolicy() {
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
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Last updated: February 16, 2026
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              At HireSense, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered job application automation platform.
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                Personal Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We collect personal information that you voluntarily provide when registering for HireSense, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Full name and email address</li>
                <li>Account credentials (encrypted password)</li>
                <li>Resume content and work history</li>
                <li>Professional skills and qualifications</li>
                <li>Job preferences and career goals</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                Automatically Collected Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                When you access the Service, we automatically collect certain information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage statistics and interaction patterns</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log files and error reports</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                Third-Party Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We collect job posting data from publicly available job boards that you configure for monitoring. This data is used solely to match against your resume and provide relevant job recommendations.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Provide, operate, and maintain our Service</li>
                <li>Analyze your resume against job descriptions using AI algorithms</li>
                <li>Calculate interview probability scores</li>
                <li>Generate personalized insights and recommendations</li>
                <li>Monitor job boards you've selected for new postings</li>
                <li>Send you notifications about matched jobs and updates</li>
                <li>Improve and optimize our Service performance</li>
                <li>Detect and prevent fraud, abuse, and security issues</li>
                <li>Comply with legal obligations and enforce our Terms of Service</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                3. AI and Data Processing
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                HireSense uses artificial intelligence to analyze and process your data:
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 mb-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Processing Transparency</h4>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 text-sm leading-relaxed space-y-1 ml-4">
                  <li>Resume content is analyzed to extract skills, experience, and qualifications</li>
                  <li>Job descriptions are processed to identify requirements and keywords</li>
                  <li>Machine learning algorithms calculate compatibility scores</li>
                  <li>Natural language processing generates improvement suggestions</li>
                  <li>All AI processing happens on secure, encrypted servers</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your data is never used to train AI models for other users or third parties without your explicit consent.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                Service Providers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We may share data with third-party service providers who perform services on our behalf, such as:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Cloud hosting and storage providers</li>
                <li>AI and machine learning infrastructure</li>
                <li>Email delivery services</li>
                <li>Analytics and monitoring tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                Legal Requirements
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may disclose your information if required by law, court order, or governmental request, or if necessary to protect our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                Business Transfers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If HireSense is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Encrypted storage for sensitive information</li>
                <li>Regular security audits and penetration testing</li>
                <li>Multi-factor authentication options</li>
                <li>Access controls and employee training</li>
                <li>Automated threat detection and response</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Limit how we use your information</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@hiresense.ai
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. Specifically:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 ml-4">
                <li>Account data: Retained while your account is active</li>
                <li>Resume data: Retained until you delete it or close your account</li>
                <li>Usage logs: Retained for 90 days for security and analytics</li>
                <li>Deleted accounts: Permanently removed within 30 days</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                8. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 dark:border-gray-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-400">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">Essential</td>
                      <td className="px-4 py-3">Required for authentication and security</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">Functional</td>
                      <td className="px-4 py-3">Remember your preferences and settings</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">Understand how you use the Service</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Performance</td>
                      <td className="px-4 py-3">Monitor and improve Service performance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling certain cookies may limit functionality.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                HireSense is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">HireSense Privacy Team</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Email: privacy@hiresense.ai</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Data Protection Officer: dpo@hiresense.ai</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Website: www.hiresense.ai/privacy</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link
            to="/terms-of-service"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}