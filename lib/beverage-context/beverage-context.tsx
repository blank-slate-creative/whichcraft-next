'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { Beverage } from '@/lib/api-client';

interface BeverageContextType {
  beverages: Beverage[];
  setBeverages: Dispatch<SetStateAction<Beverage[]>>;
  deleteBeverage: (id: string | number) => void;
  allBeverages: Beverage[];
  setAllBeverages: Dispatch<SetStateAction<Beverage[]>>;
  stats: {
    beerCount: number;
    wineCount: number;
    totalCount: number;
    likedCount: number;
    dislikedCount: number;
  };
}

const BeverageContext = createContext<BeverageContextType | undefined>(undefined);

export function useBeverages() {
  const context = useContext(BeverageContext);
  if (!context) {
    throw new Error('useBeverages must be used within a BeverageProvider');
  }
  return context;
}

interface BeverageProviderProps {
  initialBeverages: Beverage[];
  children: ReactNode;
}

export function BeverageProvider({ initialBeverages, children }: BeverageProviderProps) {
  const [beverages, setBeverages] = useState<Beverage[]>(initialBeverages);
  const [allBeverages, setAllBeverages] = useState<Beverage[]>(initialBeverages);

  // Calculate stats based on all beverages, not filtered ones
  const stats = {
    beerCount: allBeverages.filter(b => b.type === 'Beer').length,
    wineCount: allBeverages.filter(b => b.type === 'Wine').length,
    totalCount: allBeverages.length,
    likedCount: allBeverages.filter(b => b.liked).length,
    dislikedCount: allBeverages.filter(b => !b.liked).length,
  };

  // Optimistically delete a beverage
  const deleteBeverage = useCallback((id: string | number) => {
    setBeverages(prevBeverages =>
      prevBeverages.filter(beverage => beverage.id.toString() !== id.toString())
    );
    setAllBeverages(prevBeverages =>
      prevBeverages.filter(beverage => beverage.id.toString() !== id.toString())
    );
  }, []);

  return (
    <BeverageContext.Provider
      value={{
        beverages,
        setBeverages,
        deleteBeverage,
        stats,
        allBeverages,
        setAllBeverages,
      }}
    >
      {children}
    </BeverageContext.Provider>
  );
}
