import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800">R Blog</h2>
            <p className="text-gray-500 text-base">
              A modern platform for developers, designers, and tech enthusiasts to share knowledge and ideas.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Marketing</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Analytics</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Commerce</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Insights</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Pricing</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Documentation</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Guides</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">API Status</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="/About" className="text-base text-gray-500 hover:text-gray-900">About</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Jobs</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Press</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Claim</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {/* Social media icons */}
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} R Blog, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
