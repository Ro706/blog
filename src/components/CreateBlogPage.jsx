import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [blogstatus, setBlogstatus] = useState('public');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('blogstatus', blogstatus);
    formData.append('tag', tags ? tags.split(',').map(tag => tag.trim()) : []);
    if (image) {
      formData.append('image', image);
    }

    console.log('Form Data:', ...formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/blog/addblog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      console.log('Response Status:', response.status);
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (response.ok) {
        navigate('/');
      } else {
        alert(`Failed to create blog post: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('An error occurred while creating the blog post.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center">Create Blog Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="description"
              placeholder="Description"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="tags"
              type="text"
              placeholder="e.g., tech, javascript, react"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Blog Status
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="public"
                name="blogstatus"
                value="public"
                checked={blogstatus === 'public'}
                onChange={(e) => setBlogstatus(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="public" className="mr-4">Public</label>
              <input
                type="radio"
                id="private"
                name="blogstatus"
                value="private"
                checked={blogstatus === 'private'}
                onChange={(e) => setBlogstatus(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="private">Private</label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              type="submit"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
