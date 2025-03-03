export const STATES = ["California", "New York", "Texas"];

const cityMap: Record<string, string[]> = {
  California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Rochester", "Syracuse"],
  Texas: ["Houston", "Austin", "Dallas", "San Antonio"],
  // Add more states and cities as needed
};

// Mock function to get cities for a state
export const getCitiesForState = (state: string): string[] => {
  return cityMap[state] || ["Select State First"];
};
