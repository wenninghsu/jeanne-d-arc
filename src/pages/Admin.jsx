// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <wenninghsu@potix.com>

import { useSong } from '../context/SongContext';
import { Link } from 'react-router-dom';

function Admin() {
  const { songs, selectSong, currentSong, playedSongs, togglePlayedStatus } = useSong();
  const handleControl = (action) => {
    const bc = new BroadcastChannel('song_control');
    bc.postMessage({ action });
    bc.close();
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-8 space-x-4 bg-zinc-900">
          <button
            onClick={() => handleControl('PREVIOUS')}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            上一句
          </button>
          <button
            onClick={() => handleControl('NEXT')}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            下一句
          </button>
          <button
            onClick={() => handleControl('RESET')}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            重置
          </button>
          <button
            onClick={() => handleControl('SHOW_ALL')}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            顯示全部
          </button>
          <button
            onClick={() => handleControl('TOGGLE_TITLE')}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            顯示答案
          </button>
        </div>
        <div className="flex gap-4">
          <button
            // onClick={() => {
            //   const bc = new BroadcastChannel('song_selection');
            //   bc.postMessage({ type: 'RESET_APP' });
            //   bc.close();
            //   selectSong('', '');
            //   localStorage.removeItem('currentSong');
            //   localStorage.removeItem('currentIndex');
            //   localStorage.removeItem('showAll');
            //   localStorage.removeItem('showTitle');
            // }}
            // onClick={() => {
            //   const bc = new BroadcastChannel('song_selection');
            //   bc.postMessage({ type: 'RESET_APP' });
            //   bc.close();
            //   localStorage.clear(); // 清除所有相關的 localStorage
            //   selectSong('', ''); // 重置當前歌曲
            // }}
            onClick={() => {
              // 先清除所有 localStorage
              localStorage.clear();
              // 發送重置消息
              const bc = new BroadcastChannel('song_selection');
              bc.postMessage({ type: 'RESET_APP' });
              // bc.close();
              // 重置當前歌曲
              selectSong('', '');
              // 強制刷新 localStorage 中的狀態
              localStorage.setItem('currentIndex', '0');
              localStorage.setItem('showAll', 'false');
              localStorage.setItem('showTitle', 'false');
            }}
            className="px-4 py-2 text-white transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            Show Cover
          </button>
        </div>
      </div>
      
      {Object.entries(songs).map(([artist, songList]) => (
        <div key={artist} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{artist}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(songList).map(([songName, lyricsList]) => {
              const songKey = `${artist}-${songName}`;
              const isPlayed = playedSongs[songKey];
              return (
                <div
                  key={songName}
                  className="relative flex gap-2"
                >
                  <button
                    onClick={() => {
                      if (currentSong.artist === artist && currentSong.songName === songName) {
                        return;
                      }
                      selectSong(artist, songName);
                    }}
                    className={`p-4 border rounded-lg transition-colors duration-200 w-full pr-24
                      ${currentSong.artist === artist && currentSong.songName === songName
                        ? 'bg-zinc-600 border-zinc-400 text-white shadow-xl shadow-zinc-900/50 ring-1 ring-zinc-400'
                        : isPlayed
                          ? 'bg-zinc-800/50 text-zinc-500 border-none'
                          : 'hover:bg-zinc-700/70 hover:border-zinc-700 border-transparent'
                      }`}
                  >
                    {songName} - {lyricsList.length} sent.
                  </button>
                  <button
                    onClick={() => togglePlayedStatus(artist, songName)}
                    className={`absolute top-3 right-2 text-xs rounded-full
                      ${isPlayed 
                        ? 'bg-zinc-600/50 text-zinc-300' 
                        : 'bg-green-500 text-white'
                      }`}
                  >
                    {isPlayed ? 'Played' : 'Not Played'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;