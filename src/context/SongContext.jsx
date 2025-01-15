// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <wenninghsu@potix.com>

import { createContext, useContext, useState } from 'react';

const SongContext = createContext();

export function SongProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(() => {
    const saved = localStorage.getItem('currentSong');
    return saved ? JSON.parse(saved) : {
      artist: '',
      songName: '',
      lyrics: []
    };
  });

  const [playedSongs, setPlayedSongs] = useState(() => {
    const saved = localStorage.getItem('playedSongs');
    return saved ? JSON.parse(saved) : {};
  });

  const songs = {
    "artist0": {
      "song0": ["aaa0", "bbb0", "ccc0"],
      "song1": ["aaa1", "bbb1", "ccc1"],
      "song2": ["aaa2", "bbb2", "ccc2"],
      "song3": ["aaa3", "bbb3", "ccc3"]
    },
    "artist2": {
      "song4": ["aaa4", "bbb4", "ccc4", "ddd4", "eee4"],
      "song5": ["aaa5", "bbb5", "ccc5", "ddd5"],
      "song6": ["aaa6", "bbb6", "ccc6"],
      "song3": ["aaa3", "bbb3", "ccc3"]
    }
  };

  const selectSong = (artist, songName) => {
    const bc = new BroadcastChannel('song_selection');
    bc.postMessage({ type: 'SELECT_SONG', artist, songName });
    bc.close();
    
    const newSong = {
      artist,
      songName,
      lyrics: artist && songName ? songs[artist][songName] : []
    };
    
    setCurrentSong(newSong);
    localStorage.setItem('currentSong', JSON.stringify(newSong));
  };

  const togglePlayedStatus = (artist, songName) => {
    const songKey = `${artist}-${songName}`;
    const newPlayedSongs = {
      ...playedSongs,
      [songKey]: !playedSongs[songKey]
    };
    setPlayedSongs(newPlayedSongs);
    localStorage.setItem('playedSongs', JSON.stringify(newPlayedSongs));
  };

  return (
    // <SongContext.Provider value={{ songs, currentSong, selectSong }}>
    <SongContext.Provider value={{ 
      songs, currentSong, selectSong, 
      playedSongs, togglePlayedStatus 
    }}>
      {children}
    </SongContext.Provider>
  );
}

export function useSong() {
  return useContext(SongContext);
}