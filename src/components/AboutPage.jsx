import React from 'react';

const TechCard = ({ title, children }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <div className="text-gray-600 space-y-2">{children}</div>
  </div>
);

function AboutPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900">About This Platform</h1>
          <p className="mt-4 text-xl text-gray-600">An inside look at the architecture and technology behind our modern blog.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Core Technology Stack</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <TechCard title="Frontend">
                <p><strong>React:</strong> A declarative, component-based library for building dynamic user interfaces.</p>
                <p><strong>Vite:</strong> A next-generation frontend tooling that provides a faster and leaner development experience.</p>
                <p><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapidly building custom, modern designs.</p>
              </TechCard>
              <TechCard title="Backend">
                <p><strong>Node.js:</strong> A JavaScript runtime for building fast and scalable server-side applications.</p>
                <p><strong>Express.js:</strong> A minimal and flexible Node.js web application framework for creating robust APIs.</p>
              </TechCard>
              <TechCard title="Database">
                <p><strong>MongoDB:</strong> A source-available, cross-platform, document-oriented database program. Its schema-less nature provides flexibility for evolving application needs.</p>
              </TechCard>
              <TechCard title="Containerization">
                <p><strong>Docker:</strong> Used to containerize the frontend and backend services, ensuring consistency across development, testing, and production environments.</p>
              </TechCard>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Key Features & Implementation</h2>
            <div className="space-y-8">
              <TechCard title="User Authentication">
                <p>Secure user authentication is handled using <strong>JSON Web Tokens (JWT)</strong>. When a user logs in, the server generates a token that is stored on the client. This token is sent with subsequent requests to authorize access to protected routes and actions.</p>
              </TechCard>
              <TechCard title="Image & Media Handling">
                <p>Image uploads are managed through a robust cloud-based solution. The backend uses <strong>Multer</strong> to handle `multipart/form-data` from the client.</p>
                <p>Instead of storing images on the local server, they are streamed directly to <strong>Google Cloud Storage (GCS)</strong>. This approach is highly scalable, secure, and reduces the load on our application server, ensuring faster media processing and delivery.</p>
              </TechCard>
              <TechCard title="Container Orchestration">
                <p>The entire application is orchestrated using <strong>Docker Compose</strong> (`compose.yaml`). This tool simplifies the management of our multi-container setup, allowing us to define and run the frontend, backend, and any other required services with a single command. It streamlines the development workflow and makes deployment more predictable.</p>
              </TechCard>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Development Process</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <p className="text-lg text-gray-700">
                This platform was built and refined with the assistance of a powerful AI tool. The process involved iterative development, from scaffolding the initial MERN stack application to implementing a complete visual and functional redesign. The AI assistant played a key role in:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600">
                <li>Analyzing the existing codebase to understand its structure and conventions.</li>
                <li>Writing and refactoring code for both the frontend (React) and backend (Node.js).</li>
                <li>Implementing the modern, professional user interface you see today, including the responsive design and hover effects.</li>
                <li>Debugging complex issues, such as the `MissingSchemaError` in Mongoose, by analyzing server logs and correcting schema references.</li>
                <li>Generating documentation, including this very page, to provide clear insights into the project's inner workings.</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default AboutPage;