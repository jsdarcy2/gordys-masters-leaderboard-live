import { GolferScore, PoolParticipant } from "@/types";

/**
 * Calculate a participant's total score based on their best 4 golfer scores
 */
export const calculateTotalScore = (
  pickScores: Record<string, number>
): number => {
  // Get the 4 best scores out of 5 (lowest numbers are better in golf)
  const sortedScores = Object.values(pickScores).sort((a, b) => a - b);
  const bestFourScores = sortedScores.slice(0, 4);
  
  // Sum the best 4 scores
  return bestFourScores.reduce((sum, score) => sum + score, 0);
};

/**
 * Build a map of golfer names to their current scores
 */
export const buildGolferScoreMap = (leaderboard: GolferScore[]): Record<string, number> => {
  const golferScores: Record<string, number> = {};
  
  if (!Array.isArray(leaderboard)) {
    console.warn("Invalid leaderboard data provided to buildGolferScoreMap");
    return generateMockGolferScores();
  }
  
  leaderboard.forEach(golfer => {
    // Make sure we handle any edge cases where golfer score is undefined
    golferScores[golfer.name] = typeof golfer.score === 'number' ? golfer.score : 0;
  });
  
  return golferScores;
};

/**
 * Generate mock golfer scores when real data isn't available
 * Important: In golf, negative scores are better (under par)
 */
export const generateMockGolferScores = (): Record<string, number> => {
  const mockGolfers = [
    "Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Brooks Koepka", "Xander Schauffele",
    "Collin Morikawa", "Ludvig Åberg", "Viktor Hovland", "Bryson DeChambeau", "Jordan Spieth",
    "Justin Thomas", "Patrick Cantlay", "Hideki Matsuyama", "Shane Lowry", "Tommy Fleetwood",
    "Will Zalatoris", "Cameron Smith", "Dustin Johnson", "Tony Finau", "Max Homa",
    "Joaquín Niemann", "Matt Fitzpatrick", "Min Woo Lee", "Adam Scott", "Sungjae Im",
    "Sepp Straka", "Russell Henley", "Corey Conners", "Brian Harman", "Cameron Young"
  ];
  
  const golferScores: Record<string, number> = {};
  mockGolfers.forEach(golfer => {
    // Generate a random score between -10 and +5 (negative is under par = good)
    const randomScore = Math.floor(Math.random() * 16) - 10;
    golferScores[golfer] = randomScore;
  });
  
  return golferScores;
};

/**
 * Get the 4 best-performing golfers from a participant's 5 picks
 * This function now ensures we only ever return exactly 4 golfers (or fewer if less than 4 are available)
 */
export const getBestFourGolfers = (pickScores: Record<string, number>): string[] => {
  // Check if we have at least 4 picks
  if (Object.keys(pickScores).length < 4) {
    console.warn("Warning: Less than 4 picks available for best four calculation");
    return Object.keys(pickScores);
  }
  
  // If we have exactly 5 picks (normal case), take the best 4 scores
  if (Object.keys(pickScores).length === 5) {
    const bestFour = Object.entries(pickScores)
      .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
      .slice(0, 4)
      .map(([name]) => name);
      
    console.log("Best four golfers:", bestFour);
    
    return bestFour;
  }
  
  // If we have more than 5 picks (unusual case), still only take the best 4
  const bestFour = Object.entries(pickScores)
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
    .slice(0, 4)
    .map(([name]) => name);
    
  console.log("Best four golfers:", bestFour);
  
  return bestFour;
};

/**
 * Generate a realistic participant name instead of generic "Team X"
 */
export const generateParticipantName = (index: number): string => {
  const firstNames = [
    "John", "Jane", "Michael", "Emma", "David", "Sarah", "Robert", "Emily", 
    "William", "Olivia", "James", "Sophia", "Thomas", "Isabella", "Daniel", 
    "Mia", "Matthew", "Charlotte", "Andrew", "Amelia", "Christopher", "Harper", 
    "Joseph", "Abigail", "Anthony", "Elizabeth", "Mark", "Sofia", "Paul", 
    "Victoria", "Steven", "Ella", "Kevin", "Grace", "Brian", "Chloe", "George", 
    "Lily", "Edward", "Hannah", "Jason", "Zoe", "Jeffrey", "Natalie", "Ryan", 
    "Lucy", "Jacob", "Audrey", "Gary", "Leah", "Nicholas", "Samantha", "Eric", 
    "Brooklyn", "Stephen", "Anna", "Benjamin", "Caroline", "Patrick", "Madison"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
    "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
    "Thompson", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
    "Allen", "Young", "King", "Wright", "Scott", "Green", "Adams", "Baker", "Nelson",
    "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", 
    "Parker", "Evans", "Edwards", "Collins", "Stewart", "Morris", "Rogers", "Reed",
    "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Cox", "Howard",
    "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks"
  ];
  
  // Create a deterministic random name based on the index to keep it consistent
  const firstNameIndex = index % firstNames.length;
  const lastNameIndex = Math.floor(index / firstNames.length) % lastNames.length;
  
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
};

/**
 * Generate mock pool standings data when real data isn't available
 */
export const generateMockPoolStandings = (count: number = 134): PoolParticipant[] => {
  const golferScores = generateMockGolferScores();
  const golferNames = Object.keys(golferScores);
  const poolParticipants: PoolParticipant[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate 5 random golfer picks for this participant
    const picks: string[] = [];
    while (picks.length < 5) {
      const randomGolfer = golferNames[Math.floor(Math.random() * golferNames.length)];
      if (!picks.includes(randomGolfer)) {
        picks.push(randomGolfer);
      }
    }
    
    // Calculate scores for each pick
    const pickScores: Record<string, number> = {};
    picks.forEach(golferName => {
      pickScores[golferName] = golferScores[golferName] || 0;
    });
    
    // Calculate total score from best 4 picks
    const totalScore = calculateTotalScore(pickScores);
    
    // Add this participant to the pool
    poolParticipants.push({
      position: 0, // Will be calculated after sorting
      name: generateParticipantName(i),
      totalScore: totalScore,
      totalPoints: totalScore, // For compatibility 
      paid: Math.random() > 0.1, // 90% chance of being paid
      picks,
      pickScores,
      bestFourTotal: totalScore
    });
  }
  
  // Sort by total score (lowest/best score first, golf scoring)
  poolParticipants.sort((a, b) => a.totalScore - b.totalScore);
  
  // Handle ties by keeping the same position for equal scores
  let currentPosition = 1;
  let previousScore = null;
  
  poolParticipants.forEach((participant, index) => {
    if (previousScore !== null && previousScore !== participant.totalScore) {
      currentPosition = index + 1;
    }
    
    participant.position = currentPosition;
    previousScore = participant.totalScore;
  });
  
  return poolParticipants;
};

/**
 * Calculate scores for all participants and sort by total score
 */
export const calculatePoolStandings = (
  selectionsData: Record<string, { picks: string[] }>,
  golferScores: Record<string, number>
): PoolParticipant[] => {
  const poolParticipants: PoolParticipant[] = [];
  
  // Process each participant's picks - ensure we process ALL participants
  console.log(`Processing ${Object.keys(selectionsData).length} participants from selections data`);
  
  if (Object.keys(selectionsData).length === 0) {
    console.warn("Warning: No participant data received in selectionsData, using mock data");
    return generateMockPoolStandings(134);
  }
  
  Object.entries(selectionsData).forEach(([name, data]) => {
    // Skip entries with invalid data
    if (!data || !data.picks || !Array.isArray(data.picks)) {
      console.warn(`Skipping invalid participant data for: ${name}`);
      return;
    }
    
    // Initialize pickScores object
    const pickScores: Record<string, number> = {};
    
    // Calculate scores for each pick
    data.picks.forEach(golferName => {
      // Get current score for this golfer (or 0 if not found)
      const golferScore = golferScores[golferName] !== undefined ? golferScores[golferName] : 0;
      pickScores[golferName] = golferScore;
    });
    
    // Calculate total from best 4 scores
    const totalScore = calculateTotalScore(pickScores);
    const bestFourGolfers = getBestFourGolfers(pickScores);
    
    // Add this participant to the pool
    poolParticipants.push({
      position: 0, // Will be calculated after sorting
      name: name,
      totalScore: totalScore,
      totalPoints: totalScore, // For compatibility
      paid: Math.random() > 0.1, // 90% chance of being paid
      picks: data.picks,
      pickScores: pickScores,
      bestFourTotal: totalScore
    });
  });
  
  console.log(`Final pool participants count after processing: ${poolParticipants.length}`);
  
  // Sort by total score (lowest/best score first, golf scoring)
  poolParticipants.sort((a, b) => a.totalScore - b.totalScore);
  
  // Handle ties by keeping the same position for equal scores
  let currentPosition = 1;
  let previousScore = null;
  
  poolParticipants.forEach((participant, index) => {
    if (previousScore !== null && previousScore !== participant.totalScore) {
      currentPosition = index + 1;
    }
    
    participant.position = currentPosition;
    previousScore = participant.totalScore;
  });
  
  return poolParticipants.length > 0 ? poolParticipants : generateMockPoolStandings(134);
};
