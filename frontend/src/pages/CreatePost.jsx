import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Layout from '../components/Layout';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call will be implemented
    console.log('Creating post:', formData);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/posts')} className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            <p className="text-gray-600 mt-1">Write and publish your new content</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="form-group">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Post Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600"
            >
              Create Post
            </button>
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;
