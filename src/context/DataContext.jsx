// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <imwenninghsu@gmail.com>

import { createContext, useCallback, useContext, useState } from 'react';
import data from '../data';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [currentData, setCurrentData] = useState(() => {
    const saved = localStorage.getItem('currentData');
    return saved ? JSON.parse(saved) : {
      category: '',
      title: '',
      content: []
    };
  });

  const [playedData, setPlayedData] = useState(() => {
    const saved = localStorage.getItem('playedData');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('currentIndex');
    return saved && !isNaN(parseInt(saved)) ? parseInt(saved) : 0;
  });

  const selectData = (category, title) => {
    const bc = new BroadcastChannel('data_selection');
    bc.postMessage({ type: 'SELECT_DATA', category, title });
    bc.close();
    
    const newData = {
      category,
      title,
      content: category && title ? data[category][title] : []
    };
    
    setCurrentData(newData);
    setCurrentIndex(0);
    localStorage.setItem('currentData', JSON.stringify(newData));
    localStorage.setItem('currentIndex', '0');
  };

  const updateIndex = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
    localStorage.setItem('currentIndex', newIndex.toString());
  }, [setCurrentIndex]);

  const togglePlayedStatus = (category, title) => {
    const dataKey = `${category}-${title}`;
    const newPlayedData = {
      ...playedData,
      [dataKey]: !playedData[dataKey]
    };
    setPlayedData(newPlayedData);
    localStorage.setItem('playedData', JSON.stringify(newPlayedData));
  };

  return (
    <DataContext.Provider value={{
      data, currentData, selectData, 
      playedData, togglePlayedStatus,
      currentIndex, updateIndex
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}