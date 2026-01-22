export const generateNatureSuggestions = (baseName: string): string[] => {
  const suffixes = ["Oak", "Leaf", "Planter", "Seed", "Forest", "Green", "Rain", "Bloom"];
  // Clean the base name (remove spaces, lowercase)
  const cleanBase = baseName.replace(/\s+/g, '').toLowerCase();
  
  return suffixes.map(suffix => `${cleanBase}_${suffix.toLowerCase()}`);
};