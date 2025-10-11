import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Eye, MessageSquare } from 'lucide-react';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const viewIncremented = useRef(false);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        // Fetch blog post
        const blogResponse = await fetch(`http://localhost:5000/api/blog/blog/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!blogResponse.ok) throw new Error('Blog post not found');
        const blogData = await blogResponse.json();
        setBlog(blogData);

        // Fetch comments
        const commentsResponse = await fetch(`http://localhost:5000/api/blog/${id}/comments`);
        if (!commentsResponse.ok) throw new Error('Could not fetch comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
        setBlog(null); // Set blog to null to indicate not found
      }
    };

    fetchBlogAndComments();

    if (!viewIncremented.current) {
      const incrementViewCount = async () => {
        try {
          await fetch(`http://localhost:5000/api/blog/blog/${id}/view`, {
            method: 'POST',
          });
        } catch (error) {
          console.error("Failed to increment view count:", error);
        }
      };
      incrementViewCount();
      viewIncremented.current = true;
    }
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
    if (!newComment.trim()) return;

    const response = await fetch(`http://localhost:5000/api/blog/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ text: newComment }),
    });
    const data = await response.json();
    // Assuming the backend doesn't populate the user, we might need to manually add it or refetch
    setComments([data, ...comments]); 
    setNewComment('');
  };

  if (blog === null) {
    return <div className="text-center py-20">Loading blog post...</div>;
  }
  
  if (!blog) {
    return <div className="text-center py-20 font-bold text-2xl">Blog post not found.</div>;
  }


  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {blog.titleImageUrl && (
            <img src={blog.titleImageUrl} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-8 shadow-lg" />
          )}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{blog.title}</h1>
            <div className="flex items-center justify-center text-gray-500">
              <div>
                <span className="font-semibold text-lg text-gray-800">By {blog.user?.name || 'Unknown Author'}</span>
                <p className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="prose lg:prose-xl max-w-none mb-12 text-gray-700 leading-relaxed prose-p:text-lg prose-p:leading-8 prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:font-style: italic">
            {blog.content && blog.content.map((block, index) => {
              switch (block.type) {
                case 'text':
                  return <p key={index}>{block.value}</p>;
                case 'subtitle':
                  return <h2 key={index}>{block.value}</h2>;
                default:
                  return null;
              }
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-t border-b border-gray-200 py-6">
            <div className="flex items-center gap-6">
              <button onClick={handleLike} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart />
                <span>{blog.likes.length} Likes</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye />
                <span>{blog.views} Views</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tag && blog.tag.map((t, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 rounded-full px-4 py-2 text-sm font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <MessageSquare /> Comments ({comments.length})
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-12">
              <textarea
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Join the discussion..."
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg mt-4 transition-transform transform hover:scale-105">
                Post Comment
              </button>
            </form>
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-semibold text-gray-800">{comment.user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPage;
