import type { HTMLAttributes, ReactNode } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function PageContainer({ children, className = "", ...props }: PageContainerProps) {
  const classes = className ? `page-container ${className}` : "page-container";

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}