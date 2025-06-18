import React from 'react';

interface TitleProps {
  title: string;
  className?: string;
}

const Title: React.FC<TitleProps> = ({ title, className = '' }) => {
  return (
    <h1
      className={`text-xl sm:text-3xl text-[#43054E] font-semibold text-center ${className}`}
    >
      {title}
    </h1>
  );
};

export default Title;
