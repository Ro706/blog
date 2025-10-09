import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(`http://localhost:5000/api/blog/blog/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setBlog(data);
    };

    const fetchComments = async () => {
      const response = await fetch(`http://localhost:5000/api/blog/${id}/comments`);
      const data = await response.json();
      setComments(data);
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    const response = await fetch(`http://localhost:5000/api/blog/${id}/like`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setBlog(data);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/blog/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ text: newComment }),
    });
    const data = await response.json();
    setComments([data, ...comments]);
    setNewComment('');
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-4" />}
      <div className="text-gray-600 mb-4">
        <span>By {blog.user.name}</span>
        <span className="mx-2">|</span>
        <span>{new Date(blog.date).toLocaleDateString()}</span>
      </div>
      <div className="prose max-w-none mb-8">{blog.description}</div>
      <div className="flex items-center mb-8">
        <button onClick={handleLike} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Like ({blog.likes.length})
        </button>
        <div className="ml-4 text-gray-600">{blog.views} views</div>
      </div>
      <div className="mb-4">
        {blog.tag && blog.tag.map((t, index) => (
          <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{t}</span>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Post Comment
          </button>
        </form>
        <div>
          {comments.map((comment) => (
            <div key={comment._id} className="border-b py-4">
              <div className="font-bold">{comment.user.name}</div>
              <div className="text-gray-600 text-sm mb-2">{new Date(comment.createdAt).toLocaleString()}</div>
              <div>{comment.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
