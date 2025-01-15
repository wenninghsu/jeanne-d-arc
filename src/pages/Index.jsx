// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <wenninghsu@potix.com>

import { useState, useEffect } from 'react';
import { useSong } from '../context/SongContext';
import Orange from '../components/Orange';

function Index() {
  const { currentSong, selectSong } = useSong();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('currentIndex');
    // return saved ? parseInt(saved) : 0;
    return saved && !isNaN(parseInt(saved)) ? parseInt(saved) : 0;
  });
  
  const [showAll, setShowAll] = useState(() => {
    const saved = localStorage.getItem('showAll');
    return saved === 'true';
  });
  
  const [showTitle, setShowTitle] = useState(() => {
    const saved = localStorage.getItem('showTitle');
    return saved === 'true';
  });

  useEffect(() => {
    const bc = new BroadcastChannel('song_selection');
    bc.onmessage = (event) => {
      if (event.data.type === 'RESET_APP') {
        setCurrentIndex(0);
        setShowAll(false);
        setShowTitle(false);
        selectSong('', '');
        return;
      } if (event.data.type === 'SELECT_SONG') {
        const { artist, songName } = event.data;
        if (artist && songName) {
          selectSong(artist, songName);
          setCurrentIndex(0);
          localStorage.setItem('currentIndex', '0');
          setShowAll(false);
          localStorage.setItem('showAll', 'false');
          setShowTitle(false);
          localStorage.setItem('showTitle', 'false');
        }
      }
    };

    return () => bc.close();
  }, [selectSong, currentSong]);

  useEffect(() => {
    const bc = new BroadcastChannel('song_control');
    bc.onmessage = (event) => {
      switch (event.data.action) {
        case 'PREVIOUS':
          if (currentSong && currentSong.lyrics && currentSong.lyrics.length > 0) {
            handlePrevious();
          }
          break;
        case 'NEXT':
          if (currentSong && currentSong.lyrics && currentSong.lyrics.length > 0) {
            handleNext();
          }
          break;
        case 'RESET':
          if (currentSong && currentSong.lyrics && currentSong.lyrics.length > 0) {
            handleReset();
          }
          break;
        case 'SHOW_ALL':
          if (currentSong && currentSong.lyrics && currentSong.lyrics.length > 0) {
            handleShowAll();
          }
          break;
        case 'TOGGLE_TITLE':
          const newState = !showTitle;
          setShowTitle(newState);
          localStorage.setItem('showTitle', newState.toString());
          break;
        default:
          break;
      }
    };
    return () => bc.close();
  }, [currentIndex, showTitle, currentSong]);

  useEffect(() => {
    if (currentSong && currentSong.lyrics && currentSong.lyrics.length > 0) {
      setCurrentIndex(0);
      localStorage.setItem('currentIndex', '0');
    }
  }, [currentSong]);

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    localStorage.setItem('currentIndex', newIndex.toString());
  };
  
  const handleNext = () => {
    if (!currentSong || !currentSong.lyrics) return;
    const newIndex = Math.min(currentSong.lyrics.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
    localStorage.setItem('currentIndex', newIndex.toString());
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    localStorage.setItem('currentIndex', '0');
    setShowAll(false);
    localStorage.setItem('showAll', 'false');
  };
  
  const handleShowAll = () => {
    setShowAll(true);
    localStorage.setItem('showAll', 'true');
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-zinc-900">
      <div className="w-full max-w-4xl p-8">
        <div className="flex items-center justify-between h-10 mb-4">
          {showTitle ? (
            <h1 className="w-full font-semibold text-center text-white text-7xl">
              {currentSong.songName ? `${currentSong.songName}` : ''}
            </h1>
          ) : (
            currentSong.songName == undefined || currentSong.songName == '' && (
              <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
                <Orange />
              </div>
            )
          )}
        </div>

        {currentSong.lyrics && currentSong.lyrics.length > 0 && (
          <div className="space-y-6">
            <div className="min-h-[40vh] flex items-center justify-center">
              {showAll ? (
                <div className="space-y-4">
                  {currentSong.lyrics.map((line, index) => (
                    <p key={index} className="text-3xl font-light leading-relaxed text-white">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-5xl font-light text-white">
                  {currentSong.lyrics[currentIndex]}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;