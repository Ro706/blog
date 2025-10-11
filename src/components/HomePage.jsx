import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, Heart, Eye } from 'lucide-react';
import Footer from './Footer'; // Import the Footer component

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blog/public-blogs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setBlogs(json);
        setFilteredBlogs(json);
      } catch (error) {
        console.error("Could not fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.description && blog.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.tag && blog.tag.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const categories = ['All', ...new Set(blogs.flatMap(blog => blog.tag))];

  return (
    <div className="bg-soft-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center my-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50 transform scale-150 blur-3xl"></div>
          <h1 className="text-5xl font-extrabold text-gray-800">Modern Tech Feed</h1>
          <p className="text-lg text-muted-gray mt-2">Your daily dose of AI, development, and design insights.</p>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-gray" />
            <input
              type="text"
              placeholder="Search articles by title, description, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              list="tags-list"
            />
            <datalist id="tags-list">
              {categories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Blog Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <Link to={`/blog/${blog._id}`} key={blog._id} className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-transparent hover:border-blue-500">
              <div className="relative">
                <img src={blog.titleImageUrl || `https://source.unsplash.com/random/800x600?sig=${blog._id}`} alt={blog.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800 text-lg">{blog.author.name}</p>
                    <p className="text-sm text-muted-gray">{new Date(blog.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors leading-tight">{blog.title}</h2>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden text-base">{blog.description && blog.description.substring(0, 120)}...</p>
                <div className="flex items-center justify-between text-sm text-muted-gray mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Heart size={16} /> {blog.likes.length}</span>
                    <span className="flex items-center gap-1"><Eye size={16} /> {blog.views}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tag && blog.tag.map((t, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
