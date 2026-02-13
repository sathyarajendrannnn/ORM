// Fake review detection keywords (matches backend)
const SUSPICIOUS_KEYWORDS = [
  "best product ever", "amazing", "perfect", "excellent", "wonderful",
  "fantastic", "awesome", "incredible", "superb", "outstanding",
  "terrible", "worst", "horrible", "awful", "disappointed",
  "scam", "fraud", "fake", "useless", "waste of money",
  "buy this", "recommend", "must have", "five stars", "highly recommend",
  "click here", "discount", "cheap", "deal", "offer",
  "www.", "http://", "https://", "visit", "check out",
  "money back", "guarantee", "lifetime", "unbelievable", "miracle"
];

export const detectFakeReview = (content) => {
  if (!content) return { score: 0, risk: 'LOW', isFake: false };
  
  let score = 0;
  const lowerContent = content.toLowerCase();
  const words = content.split(/\s+/);
  
  // Check suspicious keywords
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      score += 10;
    }
  });
  
  // Check all caps
  const allCapsCount = words.filter(word => 
    word.length > 2 && word === word.toUpperCase()
  ).length;
  score += Math.min(allCapsCount * 5, 30);
  
  // Check exclamation marks
  const exclamationCount = (content.match(/!/g) || []).length;
  score += Math.min(exclamationCount * 2, 20);
  
  // Check repetition
  if (words.length > 10) {
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const repetitionRatio = 1 - (uniqueWords.size / words.length);
    if (repetitionRatio > 0.5) score += 25;
  }
  
  // Very short reviews
  if (words.length < 5) score += 15;
  
  // Contains URLs
  if (lowerContent.includes('http') || lowerContent.includes('www.')) {
    score += 30;
  }
  
  // Cap at 100
  score = Math.min(score, 100);
  
  // Determine risk level
  let risk = 'LOW';
  if (score >= 60) risk = 'HIGH';
  else if (score >= 30) risk = 'MEDIUM';
  
  return {
    score,
    risk,
    isFake: score >= 50
  };
};

export const getRiskColor = (risk) => {
  switch(risk) {
    case 'LOW': return 'text-green-600 bg-green-100';
    case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
    case 'HIGH': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};