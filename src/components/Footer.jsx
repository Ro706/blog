import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-center">
          <p className="text-base text-gray-400 md:order-1">
            &copy; {new Date().getFullYear()} R Blog, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
