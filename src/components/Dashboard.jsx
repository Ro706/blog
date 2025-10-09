import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

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

      // Calculate totals
      setTotalPosts(json.length);
      const likes = json.reduce((acc, blog) => acc + blog.likes.length, 0);
      setTotalLikes(likes);
      const views = json.reduce((acc, blog) => acc + blog.views, 0);
      setTotalViews(views);
    };

    fetchBlogs();
  }, []);

  const chartData = blogs.map(blog => ({
    name: blog.title.substring(0, 15) + '...',
    views: blog.views,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Posts</h2>
          <p className="text-4xl">{totalPosts}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Likes</h2>
          <p className="text-4xl">{totalLikes}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Views</h2>
          <p className="text-4xl">{totalViews}</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Views per Blog</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
