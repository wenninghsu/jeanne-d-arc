// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <imwenninghsu@gmail.com>

import { useData } from '../context/DataContext';
import { useCallback, useEffect } from 'react';

function Admin() {
  const { data, selectData, currentData, playedData, togglePlayedStatus, currentIndex, updateIndex } = useData();
  const handleControl = useCallback((action) => {
    if (action === 'RESET') {
      updateIndex(0);
    } else if (action === 'PREVIOUS') {
      updateIndex(Math.max(0, currentIndex - 1));
    } else if (action === 'NEXT') {
      updateIndex(Math.min(currentData.content.length - 1, currentIndex + 1));
    }
    const bc = new BroadcastChannel('data_control');
    bc.postMessage({ action });
    bc.close();
  }, [updateIndex, currentIndex, currentData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (!currentData || !currentData.content || !currentData.content.length) return;
        
        if (event.key === 'ArrowUp') {
          updateIndex(Math.max(0, currentIndex - 1));
          handleControl('PREVIOUS');
        } else if (event.key === 'ArrowDown') {
          updateIndex(Math.min(currentData.content.length - 1, currentIndex + 1));
          handleControl('NEXT');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentData, handleControl, updateIndex, currentIndex]);

  const getAvailableItems = () => {
    const available = [];
    Object.entries(data).forEach(([category, dataList]) => {
      Object.keys(dataList).forEach((title) => {
        const dataKey = `${category}-${title}`;
        if (!playedData[dataKey]) {
          available.push({ category, title });
        }
      });
    });
    return available;
  };

  const handleRandomSelect = () => {
    const availableItems = getAvailableItems();
    if (availableItems.length === 0) {
      selectData('', '');
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const { category: randomCategory, title: randomTitle } = availableItems[randomIndex];
    if (randomCategory === 'en' || currentData.title === randomTitle) {
      handleRandomSelect();
      return;
    }
    selectData(randomCategory, randomTitle);
  };

  return (
    <div className="p-8 pb-40">
      <div className="flex justify-between mb-4">
        <h1 className="h-12 text-5xl font-bold">{ currentData.title !== '' ? `${currentData.title}` : null }</h1>
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-6 space-x-4 border-t bg-zinc-900/95 backdrop-blur-sm border-zinc-800">
          <button
            onClick={handleRandomSelect}
            className="px-4 py-2 text-xl font-semibold transition-colors rounded-full text-zinc-900 bg-amber-500 hover:bg-amber-700 active:bg-red-700"
          >
            Random
          </button>
          <button
            onClick={() => handleControl('PREVIOUS')}
            className="px-4 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600"
          >
            上句 (⬆)
          </button>
          <span className='w-20 py-2 text-2xl leading-8 text-center text-white'>
            { currentIndex + 1 } / { currentData.content.length }
          </span>
          <button
            onClick={() => handleControl('NEXT')}
            className="px-4 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600"
          >
            下句 (⬇)
          </button>
          <button
            onClick={() => handleControl('RESET')}
            className="px-4 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600"
          >
            第一句
          </button>
          <button
            onClick={() => handleControl('SHOW_ALL')}
            className="px-4 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600"
          >
            全部
          </button>
          <button
            onClick={() => handleControl('TOGGLE_TITLE')}
            className="px-4 py-3 text-white transition-colors rounded-lg bg-rose-500 hover:bg-rose-700 active:bg-rose-900"
          >
            開關答案
          </button>
        </div>
        <div className="fixed z-50 top-4 right-4">
          <button
            onClick={() => {
              localStorage.clear();
              const bc = new BroadcastChannel('data_selection');
              bc.postMessage({ type: 'RESET_APP' });
              bc.close();
              selectData('', '');
              localStorage.setItem('currentIndex', '0');
              localStorage.setItem('showAll', 'false');
              localStorage.setItem('showTitle', 'false');
            }}
            className="px-4 py-4 font-medium leading-8 text-white transition-colors border-none rounded-full bg-zinc-800 hover:bg-zinc-600 active:bg-zinc-400"
          >
            封面
          </button>
        </div>
      </div>
      
      {Object.entries(data).map(([category, dataList]) => (
        <div key={category} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{category}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(dataList).map(([title, contentList]) => {
              const dataKey = `${category}-${title}`;
              const isPlayed = playedData[dataKey];
              return (
                <div
                  key={title}
                  className="relative flex gap-2"
                >
                  <button
                    onClick={() => {
                      if (currentData.category === category && currentData.title === title) {
                        return;
                      }
                      selectData(category, title);
                    }}
                    className={`p-1 border rounded-md transition-colors duration-200 w-full pr-24
                      ${currentData.category === category && currentData.title === title
                        ? 'bg-zinc-600/70 border-zinc-400 text-white font-medium'
                        : isPlayed
                          ? 'bg-zinc-300/40 text-zinc-300 border-none'
                          : 'bg-zinc-300/40 hover:bg-zinc-700/30 hover:border-zinc-300 border-transparent'
                      }`}
                  >
                    {title} ({contentList.length})
                  </button>
                  <button
                    onClick={() => togglePlayedStatus(category, title)}
                    className={`absolute p-1 px-2 right-2 text-xs rounded-full leading-3 top-1/2 -translate-y-1/2
                      ${isPlayed 
                        ? 'bg-zinc-300/60 text-zinc-600/30'
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