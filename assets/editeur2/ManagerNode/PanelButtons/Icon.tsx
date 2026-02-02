import React from "react";

type IconProps = {
  icon: React.ReactNode;
  className?: string;
};

function Icon({ icon, className }: IconProps) {
  if (!React.isValidElement(icon)) return null;

  // On "dit" à TS qu'on clone un élément ayant au moins { className?: string, fill?: string }
  const element = icon as React.ReactElement<{
    className?: string;
    fill?: string;
  }>;
  const mergedClassName = `inline-block w-[1em] h-[1em] ${element.props.className ?? ""} ${className ?? ""}`;

  return React.cloneElement(element, {
    className: mergedClassName,
    fill: "currentColor",
  });
}

export default Icon;
