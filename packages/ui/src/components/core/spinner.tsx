import { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

type SpinnerProps = {
  iconClassName?: string;
} & ComponentProps<"div">;

const Spinner = ({ className, iconClassName, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn("flex justify-center items-center h-svh", className)}
      {...props}
    >
      <Loader2 size={40} className={cn("animate-spin", iconClassName)} />
    </div>
  );
};

export default Spinner;
