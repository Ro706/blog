import React, { useState, useEffect } from 'react';

function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('http://localhost:5000/api/blog/fetchallblogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
          <div key={blog._id} className="border rounded-lg p-4 shadow-lg">
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover mb-4" />} 
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-700">{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
