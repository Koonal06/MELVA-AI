import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  showSkipButtons?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  artist,
  onNext,
  onPrevious,
  showSkipButtons = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Validate audio source URL without making a HEAD request
  const validateAudioSource = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      
      const handleCanPlay = () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        resolve(true);
      };
      
      const handleError = () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        resolve(false);
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      audio.src = url;
      // Attempt to load metadata only
      audio.preload = 'metadata';
    });
  };

  // Reset player state when source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setIsLoading(true);

    // Validate the audio source
    validateAudioSource(src).then(isValid => {
      if (!isValid) {
        setError('Unable to load audio source. Please check the URL and try again.');
        setIsLoading(false);
      }
    });
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume and mute state
    audio.volume = volume;
    audio.muted = isMuted;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onNext) onNext();
    };
    const handleError = () => {
      setError('Unable to play audio. Please check your connection and try again.');
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleCanPlayThrough = () => {
      setIsLoading(false);
      setError(null);
    };

    // Add event listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    // Cleanup
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [src, volume, isMuted, onNext]);

  const togglePlay = async () => {
    if (!audioRef.current || error) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setError(null);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Unable to play audio. The format might be unsupported.');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 w-full">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {error && (
        <div className="text-red-500 text-sm mb-2 p-2 bg-red-100/10 rounded">
          {error}
        </div>
      )}

      {isLoading && !error && (
        <div className="text-blue-400 text-sm mb-2">
          Loading audio...
        </div>
      )}

      {/* Title and Artist */}
      {(title || artist) && (
        <div className="mb-4">
          {title && <div className="font-semibold text-gray-100">{title}</div>}
          {artist && <div className="text-sm text-gray-400">{artist}</div>}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleTimeChange}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!duration || !!error}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showSkipButtons && (
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
              disabled={!onPrevious || !!error}
            >
              <SkipBack className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={togglePlay}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            disabled={!!error || isLoading}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          {showSkipButtons && (
            <button
              onClick={onNext}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
              disabled={!onNext || !!error}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            disabled={!!error}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            disabled={!!error}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;