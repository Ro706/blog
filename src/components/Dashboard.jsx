import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const [recentComments, setRecentComments] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchRecentComments();
  }, []);

  const fetchRecentComments = async () => {
    const response = await fetch('http://localhost:5000/api/blog/recentcomments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const json = await response.json();
    setRecentComments(json);
  };

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/blog/deleteblog/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          // Re-fetch blogs to update the dashboard
          fetchBlogs();
        } else {
          alert('Failed to delete the blog post.');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('An error occurred while deleting the blog post.');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/blog/togglestatus/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        // Re-fetch blogs to update the dashboard
        fetchBlogs();
      } else {
        alert('Failed to toggle the blog status.');
      }
    } catch (error) {
      console.error('Error toggling blog status:', error);
      alert('An error occurred while toggling the blog status.');
    }
  };

  const chartData = blogs.map(blog => ({
    name: blog.title.substring(0, 15) + '...',
    views: blog.views,
    likes: blog.likes.length,
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-600">Total Posts</h2>
            <p className="text-5xl font-bold text-blue-500 mt-2">{totalPosts}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-600">Total Likes</h2>
            <p className="text-5xl font-bold text-red-500 mt-2">{totalLikes}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-600">Total Views</h2>
            <p className="text-5xl font-bold text-green-500 mt-2">{totalViews}</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Performance Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#8884d8" name="Views" />
              <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-700 p-6">Recent Comments</h2>
          <div className="divide-y divide-gray-200">
            {recentComments.map(comment => (
              <div key={comment._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-800">{comment.user.name}</div>
                  <div className="text-xs text-gray-500">on <Link to={`/blog/${comment.blog._id}`} className="font-medium text-blue-600 hover:underline">{comment.blog.title}</Link></div>
                </div>
                <p className="text-gray-600 mt-2">{comment.text}</p>
                <div className="mt-4 flex justify-end">
                  <button className="text-sm font-medium text-blue-600 hover:underline">Quick Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
