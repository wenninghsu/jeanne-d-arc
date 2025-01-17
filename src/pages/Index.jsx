// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <imwenninghsu@gmail.com>

import { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Orange from '../components/Orange';

function Index() {
  const { currentData, selectData, currentIndex, updateIndex } = useData();
  
  const [showAll, setShowAll] = useState(() => {
    const saved = localStorage.getItem('showAll');
    return saved === 'true';
  });
  
  const [showTitle, setShowTitle] = useState(() => {
    const saved = localStorage.getItem('showTitle');
    return saved === 'true';
  });

  useEffect(() => {
    const bc = new BroadcastChannel('data_selection');
    bc.onmessage = (event) => {
      if (event.data.type === 'RESET_APP') {
        setShowAll(false);
        setShowTitle(false);
        selectData('', '');
        return;
      } if (event.data.type === 'SELECT_DATA') {
        const { category, title } = event.data;
        if (category && title) {
          selectData(category, title);
          setShowAll(false);
          localStorage.setItem('showAll', 'false');
          setShowTitle(false);
          localStorage.setItem('showTitle', 'false');
        }
      }
    };
    return () => bc.close();
  }, [selectData, currentData, updateIndex, setShowAll, setShowTitle]);

  const handlePrevious = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - 1);
    updateIndex(newIndex);
  }, [updateIndex, currentIndex]);
  
  const handleNext = useCallback(() => {
    if (!currentData || !currentData.content) return;
    const newIndex = Math.min(currentData.content.length - 1, currentIndex + 1);
    updateIndex(newIndex);
  }, [currentData, updateIndex, currentIndex]);
  
  const handleReset = useCallback(() => {
    updateIndex(0);
    setShowAll(false);
    localStorage.setItem('showAll', 'false');
  }, [updateIndex, setShowAll, updateIndex]);
  
  const handleShowAll = useCallback(() => {
    setShowAll(true);
    localStorage.setItem('showAll', 'true');
  }, [setShowAll]);

  useEffect(() => {
    const bc = new BroadcastChannel('data_control');
    bc.onmessage = (event) => {
      switch (event.data.action) {
        case 'PREVIOUS':
          if (currentData && currentData.content && currentData.content.length > 0) {
            handlePrevious();
          }
          break;
        case 'NEXT':
          if (currentData && currentData.content && currentData.content.length > 0) {
            handleNext();
          }
          break;
        case 'RESET':
          if (currentData && currentData.content && currentData.content.length > 0) {
            handleReset();
          }
          break;
        case 'SHOW_ALL':
          if (currentData && currentData.content && currentData.content.length > 0) {
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
  }, [currentIndex, showTitle, currentData, handleNext, handlePrevious, handleReset, handleShowAll, setShowTitle]);

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-zinc-900">
      <div className="w-full max-w-max">
        {
          currentData.title !== undefined && currentData.title !== '' ? (
            <div className="flex items-center justify-between w-full h-32">
              {showTitle ? (
                <h1 className="w-full font-semibold leading-normal text-center text-white text-7xl">
                  {currentData.title ? `${currentData.title}` : ''}
                </h1>
              ) : null}
            </div>
          ) : null
        }
        {
          currentData.title == undefined || currentData.title == '' && (
            <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
              <Orange />
            </div>
          )
        }
        {currentData.content && currentData.content.length > 0 && (
          <div className="py-2 space-y-6 text-center">
            <div className="min-h-[40vh] flex items-center justify-center">
              {showAll ? (
                <div className="space-y-4">
                  {currentData.content.map((line, index) => (
                    <p key={index} className="text-3xl font-light leading-snug text-white">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-5xl font-light leading-loose text-white">
                  {currentData.content[currentIndex]}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between w-full h-32">
        </div>
      </div>
    </div>
  );
}

export default Index;