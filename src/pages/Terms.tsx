const Terms = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-8 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-americas-navy">Terms and Conditions</h1>

        <p className="mb-4">
          Welcome to <strong>AmericasCupFan</strong>. By accessing this website, you agree to be bound by the following terms and conditions. If you do not agree with any of these terms, please do not use our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of Content</h2>
        <p className="mb-4">
          All content on this website is provided for informational purposes only. You may not reproduce, distribute, or modify any material without written permission from the site administrator.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Intellectual Property</h2>
        <p className="mb-4">
          All trademarks, logos, and content are the property of their respective owners. Unauthorized use of any materials may violate copyright and trademark laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Limitation of Liability</h2>
        <p className="mb-4">
          We are not responsible for any damages or losses resulting from your use of this website. Content may contain errors or become outdated without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Links</h2>
        <p className="mb-4">
          This site may include links to third-party websites. We are not responsible for the content or practices of those sites.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to Terms</h2>
        <p className="mb-4">
          We may update these terms at any time. Continued use of the site after changes are posted means you accept the new terms.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Back to Home button */}
      <a 
        href="/" 
        className="fixed bottom-4 right-4 bg-americas-teal text-white px-4 py-2 rounded-full shadow-md hover:bg-americas-teal/90 transition z-50"
      >
        ← Back to Home
      </a>
    </div>
  );
};

export default Terms;
