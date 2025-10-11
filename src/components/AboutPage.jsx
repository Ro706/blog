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
            <h2 className="text-3xl font-bold text-center mb-8">Project Overview</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <p className="text-lg text-gray-700">
                This project is a full-featured blogging platform that allows users to create, edit, and share their thoughts with the world. It is built with a modern technology stack and features a clean, professional user interface.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TechCard title="User Authentication">
                <p>Secure user authentication is handled using <strong>JSON Web Tokens (JWT)</strong>. When a user logs in, the server generates a token that is stored on the client. This token is sent with subsequent requests to authorize access to protected routes and actions.</p>
              </TechCard>
              <TechCard title="Blog Management">
                <p>Users can create, edit, and delete their own blog posts. They can also set the status of their blogs to public or private. The platform supports a rich content editor that allows users to add subtitles and multiple images to their posts.</p>
              </TechCard>
              <TechCard title="Image & Media Handling">
                <p>Image uploads are managed through a robust cloud-based solution. The backend uses <strong>Multer</strong> to handle `multipart/form-data` from the client.</p>
                <p>Instead of storing images on the local server, they are streamed directly to <strong>Google Cloud Storage (GCS)</strong>. This approach is highly scalable, secure, and reduces the load on our application server, ensuring faster media processing and delivery.</p>
              </TechCard>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Technology Stack</h2>
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
            <h2 className="text-3xl font-bold text-center mb-8">Privacy and Security</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <p className="text-lg text-gray-700">
                We take your privacy and security seriously. Here are some of the measures we have in place:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Password Hashing:</strong> User passwords are not stored in plain text. We use the <strong>bcrypt.js</strong> library to hash and salt passwords before storing them in the database.</li>
                <li><strong>JWT Authentication:</strong> We use JSON Web Tokens (JWT) for authentication. This means that we do not store session information on the server, which makes our application more scalable and secure.</li>
                <li><strong>Secure Image Uploads:</strong> Images are uploaded directly to Google Cloud Storage (GCS) and are not stored on our application server. This reduces the attack surface of our application and ensures that your images are stored securely.</li>
                <li><strong>Private Blogs:</strong> You have the option to make your blogs private, so that only you can view them.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;