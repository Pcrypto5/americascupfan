const Privacy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-8 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-americas-navy">Privacy Policy</h1>

        <p className="mb-4">
          In accordance with Article 13 of EU Regulation 2016/679 (GDPR), this policy describes how personal data is processed through this website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Data Controller</h2>
        <p className="mb-4">
          The data controller is <strong>AmericasCupFan</strong>, which can be contacted at: info@americascupfan.com
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Purpose of Data Processing</h2>
        <p className="mb-4">
          We collect personal data (name, surname, email, interests) for:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>Sending newsletters and updates;</li>
          <li>Providing personalized content and promotions;</li>
          <li>Improving user experience on the website.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Legal Basis</h2>
        <p className="mb-4">
          The legal basis for processing is the user's consent (Article 6(1)(a) GDPR).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Retention</h2>
        <p className="mb-4">
          Data will be stored until consent is withdrawn or for no longer than 24 months.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Rights of Data Subjects</h2>
        <p className="mb-4">
          Users may exercise their rights under Articles 15-22 of the GDPR, including:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          <li>Access, rectification, deletion;</li>
          <li>Restriction and objection to processing;</li>
          <li>Lodging a complaint with the supervisory authority.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Processing Methods</h2>
        <p className="mb-4">
          Data processing is carried out lawfully, fairly and transparently using electronic tools.
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

export default Privacy;
