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
        <div>
            <div className="min-h-full">
                <nav className="bg-black border-b border-gray-700 shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">

                                <div className="shrink-0">
                                    <img src={logo} alt="R Blog" className="w-10 h-10 object-contain" />
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <Link to="/" aria-current="page" className="rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white">Home</Link>
                                        <Link to="/About" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">About</Link>
                                        {authToken && <Link to="/Dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Dashboard</Link>}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    {authToken ? (
                                        <div className="relative ml-3 group">
                                            <button onClick={handleLogout} className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Sign out</button>
                                            <Link to="/create-blog" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Create Post</Link>
                                        </div>
                                    ) : (
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Login</Link>
                                            <Link to="/signup" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Sign Up</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {/* Mobile menu button */}
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                                    aria-controls="mobile-menu"
                                    aria-expanded={isOpen}
                                >
                                    <span className="absolute -inset-0.5"></span>
                                    <span className="sr-only">Open main menu</span>
                                    {!isOpen ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                                            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                                            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isOpen && (
                        <div className="md:hidden" id="mobile-menu">
                            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                <Link to="/" className="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white">Home</Link>
                                <Link to="/About" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">About</Link>
                                {authToken && <Link to="/Dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Dashboard</Link>}
                                {authToken ? (
                                    <>
                                        <Link to="/create-blog" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Create Post</Link>
                                        <button onClick={handleLogout} className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Sign out</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Login</Link>
                                        <Link to="/signup" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Sign Up</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
