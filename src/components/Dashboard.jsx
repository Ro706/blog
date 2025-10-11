import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, []);

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
          <h2 className="text-2xl font-bold text-gray-700 p-6">Your Blog Posts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.blogstatus === 'public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {blog.blogstatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <button onClick={() => handleToggleStatus(blog._id, blog.blogstatus)} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                          Toggle Status
                        </button>
                        <Link to={`/edit-blog/${blog._id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                          <Edit size={16} /> Edit
                        </Link>
                        <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
