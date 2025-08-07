const DotBackground = () => {
  return (
    <div className="absolute inset-0">
      <div className="relative h-full w-full [&>div]:absolute [&>div]:h-full [&>div]:w-full [&>div]:bg-[radial-gradient(var(--border)_1px,transparent_1px)] [&>div]:[background-size:16px_16px]">
        <div></div>
      </div>
    </div>
  );
};

export default DotBackground;
