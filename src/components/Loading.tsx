const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto my-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div 
          className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-300 border-t-[#43054E] border-r-[#43054E] rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;