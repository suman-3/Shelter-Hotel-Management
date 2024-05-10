import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-[85vh] items-center justify-center w-full">
      {children}
    </div>
  );
};

export default layout;
