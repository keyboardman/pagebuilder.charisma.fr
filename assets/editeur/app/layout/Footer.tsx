import { type PropsWithChildren } from "react";

const Footer = ({ children }: PropsWithChildren) => {
  return (
    <footer className="admin-layout__footer border-t border-border bg-card px-6 py-4 text-sm shadow-sm backdrop-blur">
      {children}
    </footer>
  );
};

export default Footer;