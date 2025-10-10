import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [blogstatus, setBlogstatus] = useState('public');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get the blog ID from the URL
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchBlogData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/blog/blog/${id}`, {
             headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTitle(data.title);
            setDescription(data.description);
            setBlogstatus(data.blogstatus);
            setTags(data.tag.join(', '));
            // Note: We don't pre-fill the image input for security reasons.
          } else {
            alert('Failed to fetch blog data.');
            navigate('/Dashboard');
          }
        } catch (error) {
          console.error('Error fetching blog data:', error);
          alert('An error occurred while fetching the blog data.');
        }
      };
      fetchBlogData();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In edit mode, we cannot easily update the image, so we send JSON.
    // For simplicity, this example will not handle image updates.
    const isJsonRequest = isEditMode;

    let body;
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    if (isJsonRequest) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({
        title,
        description,
        tag: tags ? tags.split(',').map(tag => tag.trim()) : [],
        // blogstatus is not included in the update logic in this example
      });
    } else {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('blogstatus', blogstatus);
      formData.append('tag', tags ? tags.split(',').map(tag => tag.trim()) : []);
      if (image) {
        formData.append('image', image);
      }
      body = formData;
    }

    const url = isEditMode
      ? `http://localhost:5000/api/blog/updateblog/${id}`
      : 'http://localhost:5000/api/blog/addblog';
    
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, headers, body });

      if (response.ok) {
        navigate('/Dashboard');
      } else {
        const responseData = await response.json();
        alert(`Failed: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center">{isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
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
          {!isEditMode && (
            <>
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
            </>
          )}
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              type="submit"
            >
              {isEditMode ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
