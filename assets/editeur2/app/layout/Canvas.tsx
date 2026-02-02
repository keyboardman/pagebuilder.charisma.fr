import { type PropsWithChildren } from "react";

const Canvas = ({ children }: PropsWithChildren) => {
  return (
    <main className="admin-layout__main relative overflow-y-auto px-8 py-10">
      {children}
    </main>
  );
};

export default Canvas;