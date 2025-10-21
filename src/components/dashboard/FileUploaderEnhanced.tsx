"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../../lib/api/client";

interface FileUploaderProps {
  onUploadComplete?: () => void;
  onClose?: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  // DAM Metadata
  assetCategory?: string;
  usageTags?: string[];
  characterNames?: string[];
  objectDescription?: string;
  sceneLocation?: string;
  hasAlphaChannel?: boolean;
  // Audio metadata
  audioCategory?: string;
  audioStyle?: string;
  audioVocals?: boolean;
  audioLyrics?: string;
  audioTempo?: number;
  audioKey?: string;
  voiceoverType?: string;
  voiceoverScript?: string;
}

type Step = 'select' | 'metadata' | 'upload';

const ASSET_CATEGORIES = [
  { value: 'character', label: 'Character', icon: '👤', description: 'People, mascots, brand characters' },
  { value: 'object', label: 'Object', icon: '📦', description: 'Products, vehicles, props' },
  { value: 'scene', label: 'Scene', icon: '🏞️', description: 'Locations, backgrounds, environments' },
  { value: 'greenscreen', label: 'Greenscreen', icon: '🟩', description: 'Chromakey footage' },
  { value: 'background', label: 'Background', icon: '🖼️', description: 'Pre-rendered backgrounds' },
  { value: 'full_video', label: 'Full Video', icon: '🎬', description: 'Complete productions' },
  { value: 'clip', label: 'Clip', icon: '🎞️', description: 'Reusable segments' },
  { value: 'template', label: 'Template', icon: '📋', description: 'Editable templates' },
  { value: 'audio', label: 'Audio', icon: '🎵', description: 'Music and voice overs' },
];

const AUDIO_CATEGORIES = [
  { value: 'jingle', label: 'Logo Jingle', description: '10-15s branded audio' },
  { value: 'commercial_song', label: 'Commercial Song', description: '30-60s production music' },
  { value: 'radio_song', label: 'Radio Song', description: 'Radio-ready tracks' },
  { value: 'voiceover', label: 'Voice Over', description: 'Narration and announcements' },
  { value: 'sfx', label: 'Sound Effects', description: 'Impacts, transitions' },
  { value: 'background_music', label: 'Background Music', description: 'Instrumental beds' },
];

const USAGE_TAGS = [
  'talking', 'static', 'animated', 'with_background', 'greenscreen',
  'alpha_channel', 'ai_ready', 'web_optimized', '4k', 'hd',
];

const VOICEOVER_TYPES = ['male', 'female', 'character', 'narration', 'announcement'];

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onClose,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Metadata form state
  const [metadata, setMetadata] = useState<Partial<UploadFile>>({
    assetCategory: 'clip',
    usageTags: [],
    characterNames: [],
    hasAlphaChannel: false,
    audioVocals: false,
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleUsageTag = (tag: string) => {
    setMetadata((prev) => ({
      ...prev,
      usageTags: prev.usageTags?.includes(tag)
        ? prev.usageTags.filter((t) => t !== tag)
        : [...(prev.usageTags || []), tag],
    }));
  };

  const saveMetadataAndNext = () => {
    // Apply metadata to current file
    setFiles((prev) =>
      prev.map((f, i) => (i === currentFileIndex ? { ...f, ...metadata } : f))
    );

    // Move to next file or upload step
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
      // Reset metadata for next file
      setMetadata({
        assetCategory: 'clip',
        usageTags: [],
        characterNames: [],
        hasAlphaChannel: false,
        audioVocals: false,
      });
    } else {
      setCurrentStep('upload');
      uploadFiles();
    }
  };

  const uploadFiles = async () => {
    setIsUploading(true);

    try {
      // Update all files to uploading
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 }))
      );

      // Upload each file with its metadata
      for (let i = 0; i < files.length; i++) {
        const uploadFile = files[i];

        try {
          const fileMetadata = {
            assetCategory: uploadFile.assetCategory,
            usageTags: uploadFile.usageTags,
            characterNames: uploadFile.characterNames,
            objectDescription: uploadFile.objectDescription,
            sceneLocation: uploadFile.sceneLocation,
            hasAlphaChannel: uploadFile.hasAlphaChannel,
            audioCategory: uploadFile.audioCategory,
            audioStyle: uploadFile.audioStyle,
            audioVocals: uploadFile.audioVocals,
            audioLyrics: uploadFile.audioLyrics,
            audioTempo: uploadFile.audioTempo,
            audioKey: uploadFile.audioKey,
            voiceoverType: uploadFile.voiceoverType,
            voiceoverScript: uploadFile.voiceoverScript,
          };

          const result = await apiClient.uploadFiles([uploadFile.file], fileMetadata);

          setFiles((prev) =>
            prev.map((f, index) =>
              index === i
                ? { ...f, status: 'success' as const, progress: 100 }
                : f
            )
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f, index) =>
              index === i
                ? {
                    ...f,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'Upload failed',
                  }
                : f
            )
          );
        }
      }

      // Call onUploadComplete after a short delay
      setTimeout(() => {
        onUploadComplete?.();
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const renderSelectStep = () => (
    <div className="flex-1 overflow-y-auto p-6">
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-500/30 hover:border-gray-500/50'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">📤</div>
            <div>
              <p className="text-lg font-semibold text-white mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports videos, images, and audio files (max 120MB each)
              </p>
            </div>
            <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
              Select Files
              <input
                type="file"
                multiple
                accept="video/*,image/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((uploadFile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {uploadFile.file.type.startsWith('video/') ? '🎥' :
                     uploadFile.file.type.startsWith('image/') ? '🖼️' :
                     uploadFile.file.type.startsWith('audio/') ? '🎵' : '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <label className="block border-2 border-dashed border-gray-500/30 hover:border-gray-500/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
            <span className="text-sm text-gray-400">+ Add more files</span>
            <input
              type="file"
              multiple
              accept="video/*,image/*,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );

  const renderMetadataStep = () => {
    const currentFile = files[currentFileIndex];
    if (!currentFile) return null;

    const isAudio = currentFile.file.type.startsWith('audio/');

    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">
              File {currentFileIndex + 1} of {files.length}
            </p>
            <p className="text-white font-medium truncate">{currentFile.file.name}</p>
          </div>

          {/* Asset Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Asset Category *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ASSET_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setMetadata({ ...metadata, assetCategory: cat.value })}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    metadata.assetCategory === cat.value
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-500/20 hover:border-gray-500/40'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium text-white">{cat.label}</div>
                  <div className="text-xs text-gray-400">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Category (if audio) */}
          {isAudio && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Audio Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {AUDIO_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setMetadata({ ...metadata, audioCategory: cat.value })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      metadata.audioCategory === cat.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-500/20 hover:border-gray-500/40'
                    }`}
                  >
                    <div className="text-sm font-medium text-white">{cat.label}</div>
                    <div className="text-xs text-gray-400">{cat.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Usage Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Usage Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {USAGE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleUsageTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    metadata.usageTags?.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Fields based on category */}
          {metadata.assetCategory === 'character' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Character Names (comma separated)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Mike the Mascot, Brand Ambassador"
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    characterNames: e.target.value.split(',').map((n) => n.trim()),
                  })
                }
              />
            </div>
          )}

          {metadata.assetCategory === 'object' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Object Description
              </label>
              <textarea
                className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={2}
                placeholder="Blue Ford F-150 with Koolfoam wrap"
                onChange={(e) => setMetadata({ ...metadata, objectDescription: e.target.value })}
              />
            </div>
          )}

          {metadata.assetCategory === 'scene' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scene Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Office interior - Conference Room A"
                onChange={(e) => setMetadata({ ...metadata, sceneLocation: e.target.value })}
              />
            </div>
          )}

          {/* Audio specific fields */}
          {isAudio && metadata.audioCategory === 'voiceover' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Voice Type
                </label>
                <select
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setMetadata({ ...metadata, voiceoverType: e.target.value })}
                >
                  <option value="">Select voice type...</option>
                  {VOICEOVER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Script/Transcript
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Enter the full script or transcript..."
                  onChange={(e) => setMetadata({ ...metadata, voiceoverScript: e.target.value })}
                />
              </div>
            </>
          )}

          {isAudio && ['jingle', 'commercial_song', 'radio_song'].includes(metadata.audioCategory || '') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio Style
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="upbeat, energetic, corporate..."
                  onChange={(e) => setMetadata({ ...metadata, audioStyle: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-500"
                    checked={metadata.audioVocals}
                    onChange={(e) => setMetadata({ ...metadata, audioVocals: e.target.checked })}
                  />
                  Has Vocals
                </label>
              </div>
              {metadata.audioVocals && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lyrics
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                    placeholder="Enter full lyrics..."
                    onChange={(e) => setMetadata({ ...metadata, audioLyrics: e.target.value })}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderUploadStep = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-3">
        {files.map((uploadFile, index) => (
          <div
            key={index}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {uploadFile.file.type.startsWith('video/') ? '🎥' :
                 uploadFile.file.type.startsWith('image/') ? '🖼️' :
                 uploadFile.file.type.startsWith('audio/') ? '🎵' : '📁'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{uploadFile.file.name}</p>
                <p className="text-sm text-gray-400">{formatFileSize(uploadFile.file.size)}</p>

                {/* Progress bar */}
                {uploadFile.status === 'uploading' && (
                  <div className="mt-2 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadFile.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {/* Status messages */}
                {uploadFile.status === 'success' && (
                  <p className="text-sm text-green-400 mt-2">✓ Uploaded successfully</p>
                )}
                {uploadFile.status === 'error' && (
                  <p className="text-sm text-red-400 mt-2">
                    ✗ {uploadFile.error || 'Upload failed'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl border border-gray-500/20 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Upload Media</h2>
            {currentStep === 'metadata' && (
              <p className="text-sm text-gray-400 mt-1">
                Add details to help organize and find your assets
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {currentStep === 'select' && renderSelectStep()}
        {currentStep === 'metadata' && renderMetadataStep()}
        {currentStep === 'upload' && renderUploadStep()}

        {/* Footer */}
        {files.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-500/20 bg-gray-900/50">
            <p className="text-sm text-gray-400">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              {currentStep === 'select' && (
                <button
                  onClick={() => setCurrentStep('metadata')}
                  disabled={files.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  Next
                </button>
              )}
              {currentStep === 'metadata' && (
                <button
                  onClick={saveMetadataAndNext}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {currentFileIndex < files.length - 1 ? 'Next File' : 'Upload'}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
