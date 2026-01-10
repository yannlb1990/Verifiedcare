'use client';

interface FairPriceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FairPriceScore({ score, size = 'md', showLabel = true }: FairPriceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-teal-100 text-teal-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center rounded-xl ${sizeClasses[size]} ${getScoreColor(score)}`}>
      <span className={`${textSizes[size]} font-bold`}>{score}</span>
      {showLabel && (
        <span className="text-xs uppercase tracking-wide">Fair Price</span>
      )}
    </div>
  );
}
