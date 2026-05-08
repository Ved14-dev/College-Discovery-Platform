'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface College {
  id: string;
  name: string;
  rank: number;
  fees: number;
  location: string;
  image_url: string;
  description: string;
  cutoff_score: number;
}

interface CompareContextType {
  selectedColleges: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isComparing: (collegeId: string) => boolean;
  isCompareFull: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('collegeCompare');
    if (saved) {
      try {
        setSelectedColleges(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load compare list', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('collegeCompare', JSON.stringify(selectedColleges));
  }, [selectedColleges]);

  const addToCompare = (college: College) => {
    setSelectedColleges((prev) => {
      // Limit to 3 colleges
      if (prev.length >= 3) {
        return prev;
      }
      // Check if already in list
      if (prev.find((c) => c.id === college.id)) return prev;
      return [...prev, college];
    });
  };

  const removeFromCompare = (collegeId: string) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== collegeId));
  };

  const clearCompare = () => {
    setSelectedColleges([]);
  };

  const isComparing = (collegeId: string) => {
    return selectedColleges.some((c) => c.id === collegeId);
  };

  const isCompareFull = selectedColleges.length >= 3;

  return (
    <CompareContext.Provider value={{ 
      selectedColleges, 
      addToCompare, 
      removeFromCompare, 
      clearCompare, 
      isComparing,
      isCompareFull
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
