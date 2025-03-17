import { FC } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg transform transition-transform duration-300",
  {
    variants: {
      variant: {
        default: "bg-green-500",
        destructive: "bg-destructive",
      },
      visibility: {
        visible: "translate-y-0",
        hidden: "translate-y-[200%]",
      },
    },
    defaultVariants: {
      variant: "default",
      visibility: "hidden",
    },
  }
);

export interface ToastNotificationProps
  extends VariantProps<typeof toastVariants> {
  message: string;
  isVisible: boolean;
  className?: string;
}

export const ToastNotification: FC<ToastNotificationProps> = ({
  message,
  isVisible,
  variant,
  className,
}) => {
  return (
    <div
      className={cn(
        toastVariants({
          variant,
          visibility: isVisible ? "visible" : "hidden",
          className,
        })
      )}
    >
      <div className="flex items-center space-x-2">
        {variant === "destructive" ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};
