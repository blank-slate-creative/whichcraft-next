# @whichcraft/beverage-context

A shared React context for managing beverage data in the Whichcraft application.

## Installation

```bash
npm install @whichcraft/beverage-context
```

## Usage

```tsx
// In your app's root component
import { BeverageProvider } from "@whichcraft/beverage-context";

function App({ initialBeverages }) {
  return (
    <BeverageProvider initialBeverages={initialBeverages}>
      {/* Your app components */}
    </BeverageProvider>
  );
}

// In any component that needs access to beverage data
import { useBeverages } from "@whichcraft/beverage-context";

function BeverageList() {
  const { beverages, deleteBeverage, stats } = useBeverages();

  return (
    <div>
      <p>Total: {stats.totalCount}</p>
      <ul>
        {beverages.map((beverage) => (
          <li key={beverage.id}>
            {beverage.name}
            <button onClick={() => deleteBeverage(beverage.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API

### BeverageProvider

A React context provider component that manages beverage state.

Props:

- `initialBeverages`: Initial array of Beverage objects
- `children`: React children

### useBeverages

A hook that provides access to the beverage context.

Returns:

- `beverages`: Array of currently filtered/displayed beverages
- `setBeverages`: Function to update the beverages array
- `allBeverages`: Array of all beverages (unfiltered)
- `setAllBeverages`: Function to update the allBeverages array
- `deleteBeverage`: Function to remove a beverage by ID
- `stats`: Object containing beverage statistics
  - `beerCount`: Number of beers
  - `wineCount`: Number of wines
  - `totalCount`: Total number of beverages
  - `likedCount`: Number of liked beverages
  - `dislikedCount`: Number of disliked beverages
