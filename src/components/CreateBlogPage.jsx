import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [content, setContent] = useState([]);
  const [blogstatus, setBlogstatus] = useState('public');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
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
            setContent(data.content || []);
            setBlogstatus(data.blogstatus);
            setTags(data.tag.join(', '));
          } else {
            alert('Failed to fetch blog data.');
          }
        } catch (error) {
          console.error('Error fetching blog data:', error);
          alert('An error occurred while fetching the blog data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlogData();
    }
  }, [id, isEditMode, navigate]);

  if (isLoading) {
    return <div className="text-center py-20">Loading blog post...</div>;
  }

  const handleContentChange = (index, value) => {
    const newContent = [...content];
    newContent[index].value = value;
    setContent(newContent);
  };

  const handleFileChange = (index, file) => {
    const newContent = [...content];
    newContent[index].file = file;
    setContent(newContent);
  };

  const addContentBlock = (type) => {
    setContent([...content, { type, value: '' }]);
  };

  const removeContentBlock = (index) => {
    const newContent = [...content];
    newContent.splice(index, 1);
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('blogstatus', blogstatus);
      formData.append('tag', tags ? tags.split(',').map(tag => tag.trim()) : []);

      if (titleImage) {
        formData.append('titleImage', titleImage);
      }

      const contentForUpload = [];
      const images = [];

      content.forEach(block => {
        if (block.type === 'image' && block.file) {
          images.push(block.file);
          contentForUpload.push({ type: 'image', value: 'placeholder' });
        } else {
          contentForUpload.push(block);
        }
      });

      formData.append('content', JSON.stringify(contentForUpload));
      images.forEach(image => {
        formData.append('images', image);
      });

      const url = isEditMode
        ? `http://localhost:5000/api/blog/updateblog/${id}`
        : 'http://localhost:5000/api/blog/addblog';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate('/Dashboard');
      } else {
        const responseData = await response.json();
        alert(`Failed: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titleImage">
              Title Image
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="titleImage"
              type="file"
              onChange={(e) => setTitleImage(e.target.files[0])}
            />
          </div>

          {content.map((block, index) => (
            <div key={index} className="flex items-center gap-2">
              {block.type === 'text' && (
                <textarea
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Paragraph"
                  rows="6"
                  value={block.value}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
              )}
              {block.type === 'subtitle' && (
                <input
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="text"
                  placeholder="Subtitle"
                  value={block.value}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
              )}
              {block.type === 'image' && (
                <input
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="file"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
              )}
              <button type="button" onClick={() => removeContentBlock(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove
              </button>
            </div>
          ))}

          <div className="flex items-center justify-center gap-4">
            <button type="button" onClick={() => addContentBlock('text')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Add Paragraph
            </button>
            <button type="button" onClick={() => addContentBlock('subtitle')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Add Subtitle
            </button>
            <button type="button" onClick={() => addContentBlock('image')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Add Image
            </button>
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
          )}
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;

