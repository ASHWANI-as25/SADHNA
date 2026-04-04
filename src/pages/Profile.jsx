import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { localAuthService } from '../services/localAuth';
import { User, Mail, Calendar, Code, MapPin, Phone, FileText, Save, X, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dob: '',
    phone: '',
    location: '',
    skills: '',
    bio: '',
    experience: '',
    qualification: ''
  });

  useEffect(() => {
    // Load existing profile data
    if (user) {
      const { data: profile } = localAuthService.getUserProfile(user.id);
      if (profile) {
        setFormData({
          fullName: profile.fullName || user.email.split('@')[0],
          email: user.email,
          dob: profile.dob || '',
          phone: profile.phone || '',
          location: profile.location || '',
          skills: profile.skills || '',
          bio: profile.bio || '',
          experience: profile.experience || '',
          qualification: profile.qualification || ''
        });
      } else {
        setFormData(prev => ({
          ...prev,
          fullName: user.email.split('@')[0],
          email: user.email
        }));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Update user profile in database
      const { user: updated, error: updateError } = localAuthService.updateUserProfile(user.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      if (updateError) {
        setError(updateError);
        return;
      }

      setSuccess('✅ Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sadhna-red via-sadhna-navy to-sadhna-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">👤 My Profile</h1>
          <p className="text-gray-300">Manage your personal information and profile details</p>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-green-200"
          >
            {success}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          {/* Edit Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isEditing
                  ? 'bg-red-500/30 hover:bg-red-500/40 border border-red-500/50 text-red-200'
                  : 'bg-blue-500/30 hover:bg-blue-500/40 border border-blue-500/50 text-blue-200'
              }`}
            >
              {isEditing ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  Edit Profile
                </>
              )}
            </motion.button>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-gray-400 cursor-not-allowed opacity-50"
                />
                <p className="text-xs text-gray-400 mt-1">Cannot be changed</p>
              </div>
            </div>

            {/* Row 2: DOB & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+91-98765-43210"
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>
            </div>

            {/* Row 3: Location & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City, Country"
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Code size={16} />
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="React, Node.js, Python..."
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>
            </div>

            {/* Row 4: Qualification & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Qualification */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="B.Tech CSE, Masters in AI..."
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Code size={16} />
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="3"
                  className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 transition-all ${
                    isEditing
                      ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                      : 'cursor-not-allowed opacity-70'
                  }`}
                />
              </div>
            </div>

            {/* Bio - Full Width */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <FileText size={16} />
                About Me (Bio)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself, your career goals, and interests..."
                rows="4"
                className={`w-full bg-white/10 border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 resize-none transition-all ${
                  isEditing
                    ? 'hover:bg-white/20 focus:outline-none focus:border-blue-400'
                    : 'cursor-not-allowed opacity-70'
                }`}
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-end pt-4 border-t border-white/20"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg font-semibold bg-gray-600/30 hover:bg-gray-600/40 border border-gray-500/50 text-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-sm text-gray-300"
        >
          <p className="font-semibold text-white mb-2">💡 Profile Information:</p>
          <ul className="space-y-1 text-gray-400">
            <li>✅ All your information is stored securely in your browser</li>
            <li>✅ Click "Edit Profile" to update your details</li>
            <li>✅ Your email cannot be changed</li>
            <li>✅ Changes are saved automatically to the database</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
