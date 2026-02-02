import * as React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Dialog = ({ open, onOpenChange, children, className }: DialogProps) => {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  const handleClose = () => onOpenChange(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) handleClose();
  };

  return (
    <dialog
      ref={ref}
      onCancel={handleClose}
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 z-50 flex max-h-dvh w-full max-w-full items-center justify-center p-4 outline-none',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        className
      )}
    >
      {children}
    </dialog>
  );
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    role="document"
    onClick={(e) => e.stopPropagation()}
    className={cn(
      'relative max-h-[85dvh] w-full max-w-4xl overflow-hidden rounded-lg border bg-background shadow-lg',
      className
    )}
    {...props}
  >
    {children}
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    )}
  </div>
));

DialogContent.displayName = 'DialogContent';

export { Dialog, DialogContent };
