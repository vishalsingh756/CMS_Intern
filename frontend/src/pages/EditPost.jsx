import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Layout from '../components/Layout';
import { postService, categoryService, tagService } from '../services/api';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    fetchPost();
    fetchCategories();
    fetchTags();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postService.getPost(id);
      setFormData({
        title: response.data.data.title,
        content: response.data.data.content,
        excerpt: response.data.data.excerpt || '',
        category: response.data.data.category?._id || '',
        tags: response.data.data.tags?.map((tag) => tag._id) || [],
        status: response.data.data.status,
        seoTitle: response.data.data.seoTitle || '',
        seoDescription: response.data.data.seoDescription || '',
        seoKeywords: response.data.data.seoKeywords?.join(', ') || '',
      });
    } catch (error) {
      toast.error('Failed to fetch post');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories({ limit: 100 });
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagService.getTags({ limit: 100 });
      setTags(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tags');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postService.updatePost(id, {
        ...formData,
        tags: formData.tags.join(','),
      });
      toast.success('Post updated successfully');
      navigate('/posts');
    } catch (error) {
      toast.error('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/posts')} className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600 mt-1">Update your post content</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Post Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
              <ReactQuill
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
                className="bg-white border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of your post"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">SEO Description</label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="Meta description for search engines"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">SEO Keywords</label>
              <input
                type="text"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                placeholder="Separate keywords with commas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 disabled:bg-gray-400"
            >
              <FiSave /> {submitting ? 'Saving...' : 'Update Post'}
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

export default EditPost;
