interface CircleAnimationProps {
  index: number;
  className?: string;
}

export const CircleAnimation = ({ index, className = '' }: CircleAnimationProps) => {
  return (
    <div
      className={`${className} w-8 h-8 rounded-full ${index > 2 ? 'hidden md:block' : ''}`}
    />
  );
};