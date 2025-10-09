import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('http://localhost:5000/api/blog/public-blogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      setBlogs(json);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Blog Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} key={blog._id} className="block border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover mb-4 rounded-md" />} 
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-700 mb-4">{blog.description.substring(0, 100)}...</p>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{blog.likes.length} Likes</span>
              <span>{blog.views} Views</span>
            </div>
            <div className="mt-4">
              {blog.tag && blog.tag.map((t, index) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
