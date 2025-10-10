import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/R_blog_site_logo.png';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const authToken = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <img src={logo} alt="R Blog" className="w-10 h-10 object-contain" />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                <Link to="/About" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                                {authToken && <Link to="/Dashboard" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {authToken ? (
                                <div className="relative ml-3 group">
                                    <Link to="/create-blog" className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-all">Create Post</Link>
                                    <Link to="/profile" className="ml-4 text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Profile</Link>
                                    <button onClick={handleLogout} className="ml-4 text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign out</button>
                                </div>
                            ) : (
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link to="/login" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                                    <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-all">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors">Home</Link>
                        <Link to="/About" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors">About</Link>
                        {authToken && <Link to="/Dashboard" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors">Dashboard</Link>}
                        {authToken ? (
                            <>
                                <Link to="/create-blog" className="bg-blue-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-all">Create Post</Link>
                                <Link to="/profile" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors">Profile</Link>
                                <button onClick={handleLogout} className="w-full text-left text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors">Sign out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="bg-blue-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-all">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
