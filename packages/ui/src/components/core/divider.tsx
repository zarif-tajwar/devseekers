// const Divider = () => {
//   return (
//     <div className="relative">
//       <div className="absolute inset-0 flex items-center">
//         <span className="w-full border-t"></span>
//       </div>
//       <div className="relative flex justify-center text-xs uppercase">
//         <span className="bg-background px-2 text-muted-foreground"></span>
//       </div>
//     </div>
//   );
// };

// export default Divider;

import { cn } from "@repo/ui/lib/utils";

interface DividerProps {
  title?: string;
  className?: string;
  titleClassName?: string;
  lineClassName?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Divider({
  title,
  className,
  titleClassName,
  lineClassName,
  orientation = "horizontal",
  decorative = true,
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex items-center",
        isHorizontal ? "w-full" : "h-full flex-col",
        className,
      )}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
    >
      <div
        className={cn(
          "flex-grow",
          isHorizontal ? "border-t" : "border-l",
          "border-muted-foreground/20",
          lineClassName,
        )}
      />
      {title && (
        <div
          className={cn(
            "flex-shrink-0 text-xs uppercase text-muted-foreground",
            isHorizontal ? "px-2" : "py-2",
            titleClassName,
          )}
        >
          {title}
        </div>
      )}
      {title && (
        <div
          className={cn(
            "flex-grow",
            isHorizontal ? "border-t" : "border-l",
            "border-muted-foreground/20",
            lineClassName,
          )}
        />
      )}
    </div>
  );
}
