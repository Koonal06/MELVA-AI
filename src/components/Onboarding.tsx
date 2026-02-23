import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, AudioWaveform as Waveform, Brain, ArrowLeft, Upload, Mic, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import TeacherRecommendations from './TeacherRecommendations';
import MusicAnalysis from './MusicAnalysis';
import BeatGenerator from './BeatGenerator';
import { analyzeAudio } from '../lib/audioAnalysis';

interface OnboardingOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const options: OnboardingOption[] = [
  {
    id: 'teacher',
    title: 'AI-Based Music Suggestions',
    description: 'Get personalized music recommendations from a teacher\'s perspective',
    icon: <Music className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'analysis',
    title: 'Music Pattern Analysis',
    description: 'Upload your music for AI-powered analysis and insights',
    icon: <Brain className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'beats',
    title: 'AI-Generated Beats',
    description: 'Create custom beats using AI based on your input',
    icon: <Waveform className="w-8 h-8" />,
    color: 'from-pink-500 to-pink-600'
  }
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

const ALLOWED_FILE_TYPES = [
  'audio/midi',
  'audio/x-midi',
  'audio/mid',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp3',
  'audio/ogg',
  'application/x-midi',
  'application/midi'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'input' | 'recommendations' | 'analysis' | 'beats'>('welcome');
  const [selectedOption, setSelectedOption] = useState<OnboardingOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const [genre, setGenre] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [teacherAdvice, setTeacherAdvice] = useState('');
  const [hasTeacher, setHasTeacher] = useState<boolean | null>(null);

  const handleBack = () => {
    if (step === 'recommendations' || step === 'analysis' || step === 'beats') {
      setStep('input');
      setUploadedFile(null);
      setUploadError(null);
      setUploadProgress(0);
      setAnalysisResult(null);
    } else if (step === 'input') {
      setStep('welcome');
      setSelectedOption(null);
    } else {
      navigate('/welcome');
    }
  };

  const handleOptionSelect = (option: OnboardingOption) => {
    setSelectedOption(option);
    setStep('input');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isMidiFile = fileExtension === 'mid' || fileExtension === 'midi';
    
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !isMidiFile) {
      setUploadError('Please upload a valid audio or MIDI file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const fileUrl = URL.createObjectURL(file);
      
      const result = await analyzeAudio(fileUrl);
      setAnalysisResult(result);
      
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setUploadError('Error analyzing file. Please try again.');
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setUploadError(null);
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isMidiFile = fileExtension === 'mid' || fileExtension === 'midi';
    
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !isMidiFile) {
      setUploadError('Please upload a valid audio or MIDI file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    await processFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleContinue = () => {
    if (selectedOption?.id === 'teacher' && genre && skillLevel && teacherAdvice) {
      localStorage.setItem(
        'melva_onboarding_profile',
        JSON.stringify({
          genre: genre.trim(),
          level: skillLevel,
          teacherAdvice: teacherAdvice.trim(),
        })
      );
      setStep('recommendations');
    } else if (selectedOption?.id === 'analysis' && uploadedFile && analysisResult) {
      setStep('analysis');
    } else if (selectedOption?.id === 'beats') {
      setStep('beats');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (step === 'recommendations' && selectedOption?.id === 'teacher') {
    return (
      <div>
        <button
          onClick={handleBack}
          className="fixed top-20 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <TeacherRecommendations
          genre={genre}
          level={skillLevel}
          teacherAdvice={teacherAdvice}
        />
      </div>
    );
  }

  if (step === 'analysis' && selectedOption?.id === 'analysis') {
    return (
      <div>
        <button
          onClick={handleBack}
          className="fixed top-20 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <MusicAnalysis initialAnalysis={analysisResult} />
      </div>
    );
  }

  if (step === 'beats' && selectedOption?.id === 'beats') {
    return (
      <div>
        <button
          onClick={handleBack}
          className="fixed top-20 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <BeatGenerator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <button
        onClick={handleBack}
        className="fixed top-20 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl mx-auto pt-8">
        {step === 'welcome' ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to MELVA!</h1>
              <p className="text-xl text-gray-300">
                Your AI-powered music assistant. Choose how you'd like to explore music today.
              </p>
            </div>

            <div className="grid gap-6">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-500 transition-all duration-300 text-left group"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-400">{option.description}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">{selectedOption?.title}</h2>
            
            {selectedOption?.id === 'teacher' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">What genre or style are you practicing?</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Rock, Jazz, Classical, Romance"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    You can enter multiple styles separated by commas.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">What's your current skill level?</label>
                  <div className="grid grid-cols-3 gap-4">
                    {skillLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSkillLevel(level)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          skillLevel === level
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Do you have a teacher's guidance?</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setHasTeacher(true)}
                      className={`px-4 py-2 rounded-lg transition-colors flex-1 ${
                        hasTeacher === true
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setHasTeacher(false)}
                      className={`px-4 py-2 rounded-lg transition-colors flex-1 ${
                        hasTeacher === false
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    {hasTeacher
                      ? "What specific advice has your teacher given?"
                      : "What would you like to focus on?"}
                  </label>
                  <textarea
                    value={teacherAdvice}
                    onChange={(e) => setTeacherAdvice(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder={
                      hasTeacher
                        ? "e.g., Improve scales, work on jazz chord progressions..."
                        : "e.g., Learn basic chords, practice rhythm..."
                    }
                    rows={4}
                  />
                </div>
              </div>
            )}

            {selectedOption?.id === 'analysis' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".midi,.mid,.mp3,.wav,.ogg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                    ${uploadedFile ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-blue-500'}`}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                      <div>
                        <p className="font-semibold text-green-500">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      {analysisResult && (
                        <div className="text-left bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Analysis Results:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>Key: {analysisResult.key}</li>
                            <li>Tempo: {analysisResult.tempo} BPM</li>
                            <li>Confidence: {Math.round(analysisResult.confidence * 100)}%</li>
                          </ul>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-300 mb-2">Upload your audio or MIDI file</p>
                      <p className="text-sm text-gray-500">
                        Drag and drop or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-4">
                        Supported formats: MIDI, MP3, WAV, OGG (max 10MB)
                      </p>
                    </>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Analyzing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedOption?.id === 'beats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <Mic className="w-6 h-6" />
                    Record Beat
                  </button>
                  <button className="flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <Waveform className="w-6 h-6" />
                    Tap Pattern
                  </button>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Or describe your beat idea:</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Upbeat drum pattern with heavy bass..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={
                (selectedOption?.id === 'teacher' && (!genre || !skillLevel || !teacherAdvice)) ||
                (selectedOption?.id === 'analysis' && (!uploadedFile || !analysisResult))
              }
              className={`w-full mt-8 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                (selectedOption?.id === 'teacher' && (!genre || !skillLevel || !teacherAdvice)) ||
                (selectedOption?.id === 'analysis' && (!uploadedFile || !analysisResult))
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } transition-colors`}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Onboarding;
