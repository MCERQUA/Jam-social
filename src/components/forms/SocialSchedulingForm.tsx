import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Upload, Send, CheckCircle, Repeat, Image, Video, AlertCircle, X } from 'lucide-react';

const SocialSchedulingForm: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postText, setPostText] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [repeatFrequency, setRepeatFrequency] = useState('none');
  const [repeatEnd, setRepeatEnd] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; preview?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'X (Twitter)', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌' },
    { id: 'google-business', name: 'Google Business', icon: '🔍' },
    { id: 'threads', name: 'Threads', icon: '🧵' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻' },
    { id: 'bluesky', name: 'Bluesky', icon: '☁️' },
    { id: 'reddit', name: 'Reddit', icon: '🤖' },
  ];

  const repeatOptions = [
    { value: 'none', label: 'No repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const fileData = {
        name: file.name,
        type: isImage ? 'image' : 'video',
        preview: undefined as string | undefined
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedFile({ ...fileData, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFile(fileData);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    const fileInput = document.getElementById('media-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = e.target as HTMLFormElement;

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: new FormData(form)
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
        setSelectedPlatforms([]);
        setPostText('');
        setScheduleDate('');
        setScheduleTime('');
        setRepeatFrequency('none');
        setRepeatEnd('');
        setUploadedFile(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-black/40 backdrop-blur-sm border border-violet-500/30 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Calendar className="w-7 h-7 text-violet-400" />
          Schedule Your Social Media Post
        </h3>

        <form
          name="social-scheduling"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input type="hidden" name="form-name" value="social-scheduling" />
          <input type="hidden" name="bot-field" />

          {/* Hidden inputs for platforms */}
          {selectedPlatforms.map(platform => (
            <input key={platform} type="hidden" name="platforms" value={platform} />
          ))}

          {/* Platform Selection */}
          <div>
            <label className="block text-white mb-3 font-medium">
              Select Platforms *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {platforms.map(platform => (
                <motion.button
                  key={platform.id}
                  type="button"
                  onClick={() => handlePlatformToggle(platform.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-3 rounded-lg border transition-all duration-200
                    ${selectedPlatforms.includes(platform.id)
                      ? 'bg-violet-600/20 border-violet-500 text-white'
                      : 'bg-white/5 border-white/20 text-gray-400 hover:border-violet-500/50'}
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.name}</span>
                    {selectedPlatforms.includes(platform.id) && (
                      <CheckCircle className="w-4 h-4 text-violet-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Post Content */}
          <div>
            <label htmlFor="post-content" className="block text-white mb-3 font-medium">
              Post Content *
            </label>
            <textarea
              id="post-content"
              name="content"
              required
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="What would you like to share?"
            />
            <p className="text-gray-400 text-sm mt-2">
              {postText.length}/500 characters
            </p>
          </div>

          {/* Media Upload */}
          <div>
            <label htmlFor="media-upload" className="block text-white mb-3 font-medium">
              Upload Media (Image or Video)
            </label>

            {!uploadedFile ? (
              <div className="relative">
                <input
                  type="file"
                  id="media-upload"
                  name="media"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center gap-3 p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-violet-500/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-400">
                    Click to upload image or video
                  </span>
                </label>
              </div>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center">
                      <Video className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium truncate max-w-xs">
                          {uploadedFile.name}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {uploadedFile.type === 'image' ? 'Image file' : 'Video file'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      File uploaded successfully
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="schedule-date" className="block text-white mb-3 font-medium">
                Schedule Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="schedule-date"
                  name="schedule-date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="schedule-time" className="block text-white mb-3 font-medium">
                Schedule Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="schedule-time"
                  name="schedule-time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Repeat Options */}
          <div>
            <label htmlFor="repeat-frequency" className="block text-white mb-3 font-medium">
              <Repeat className="inline w-4 h-4 mr-2" />
              Repeat Frequency
            </label>
            <select
              id="repeat-frequency"
              name="repeat-frequency"
              value={repeatFrequency}
              onChange={(e) => setRepeatFrequency(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
            >
              {repeatOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {repeatFrequency !== 'none' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label htmlFor="repeat-end" className="block text-white mb-3 font-medium">
                Repeat Until
              </label>
              <input
                type="date"
                id="repeat-end"
                name="repeat-end"
                value={repeatEnd}
                onChange={(e) => setRepeatEnd(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || selectedPlatforms.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2
              ${isSubmitting || selectedPlatforms.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/30'}
              transition-all duration-300
            `}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Scheduling...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Schedule Post
              </>
            )}
          </motion.button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Post scheduled successfully! We'll handle the rest.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg"
            >
              <AlertCircle className="w-5 h-5" />
              Something went wrong. Please try again.
            </motion.div>
          )}

          {selectedPlatforms.length === 0 && (
            <p className="text-amber-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Please select at least one platform
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default SocialSchedulingForm;