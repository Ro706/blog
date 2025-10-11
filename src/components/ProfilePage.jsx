import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/getuser', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const json = await response.json();
                if (json.success) {
                    setName(json.user.name);
                    setEmail(json.user.email);
                    setPhonenumber(json.user.phonenumber);
                } else {
                    setError(json.error);
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (err) {
                setError('Failed to fetch user data.');
            }
        };

        const fetchUserBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/blog/fetchallblogs', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const json = await response.json();
                setBlogs(json);
            } catch (err) {
                setError('Failed to fetch user blogs.');
            }
        };

        fetchUserData();
        fetchUserBlogs();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/updateuser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, phonenumber })
            });
            const json = await response.json();
            if (json.success) {
                // Optionally, show a success message
            } else {
                setError(json.error);
            }
        } catch (err) {
            setError('Failed to update user data.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Your Profile</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    disabled
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    id="phonenumber"
                                    value={phonenumber}
                                    onChange={(e) => setPhonenumber(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Blogs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blogs.map(blog => (
                                <Link to={`/blog/${blog._id}`} key={blog._id} className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-200">
                                    <div className="relative">
                                        <img src={blog.titleImageUrl || `https://source.unsplash.com/random/800x600?sig=${blog._id}`} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${blog.blogstatus === 'public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {blog.blogstatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors truncate">{blog.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3 h-16 overflow-hidden">{blog.content[0]?.value.substring(0, 100)}...</p>
                                        <p className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
