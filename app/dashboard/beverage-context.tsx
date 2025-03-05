"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Define the Beverage interface
export interface Beverage {
  id: number | string;
  name: string;
  type: string;
  style: string;
  producer: string;
  liked: boolean;
  notes: string;
  created_at: string;
  abv?: number | string;
}

interface BeverageContextType {
  beverages: Beverage[];
  setBeverages: (beverages: Beverage[]) => void;
  deleteBeverage: (id: string | number) => void;
  stats: {
    beerCount: number;
    wineCount: number;
    totalCount: number;
    likedCount: number;
    dislikedCount: number;
  };
}

const BeverageContext = createContext<BeverageContextType | undefined>(
  undefined
);

export function useBeverages() {
  const context = useContext(BeverageContext);
  if (!context) {
    throw new Error("useBeverages must be used within a BeverageProvider");
  }
  return context;
}

interface BeverageProviderProps {
  initialBeverages: Beverage[];
  children: ReactNode;
}

export function BeverageProvider({
  initialBeverages,
  children,
}: BeverageProviderProps) {
  const [beverages, setBeverages] = useState<Beverage[]>(initialBeverages);

  // Calculate stats based on current beverages
  const stats = {
    beerCount: beverages.filter((b) => b.type === "Beer").length,
    wineCount: beverages.filter((b) => b.type === "Wine").length,
    totalCount: beverages.length,
    likedCount: beverages.filter((b) => b.liked).length,
    dislikedCount: beverages.filter((b) => !b.liked).length,
  };

  // Optimistically delete a beverage
  const deleteBeverage = useCallback((id: string | number) => {
    setBeverages((prevBeverages) =>
      prevBeverages.filter(
        (beverage) => beverage.id.toString() !== id.toString()
      )
    );
  }, []);

  return (
    <BeverageContext.Provider
      value={{ beverages, setBeverages, deleteBeverage, stats }}
    >
      {children}
    </BeverageContext.Provider>
  );
}
