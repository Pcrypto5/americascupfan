const Cookies = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-8 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-americas-navy">Cookie Policy</h1>

        <p className="mb-4">
          This website uses cookies to ensure proper functionality and to improve the user experience.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. What Are Cookies</h2>
        <p className="mb-4">
          Cookies are small text files stored on the user’s device that help websites function properly and track user behavior anonymously.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Types of Cookies Used</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li><strong>Technical cookies</strong>: essential for basic site operations;</li>
          <li><strong>Analytical cookies</strong>: collect anonymous statistics (e.g., Google Analytics);</li>
          <li><strong>Third-party cookies</strong>: embedded content from platforms like YouTube or social media.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Consent</h2>
        <p className="mb-4">
          On first visit, users may accept or reject non-essential cookies via the banner.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Managing Cookies</h2>
        <p className="mb-4">
          Users can manage or disable cookies at any time using their browser settings.
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

export default Cookies;
