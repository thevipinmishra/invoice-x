"use client";

import { tv } from "@/lib/tv";
import {
  TooltipTrigger as TooltipTriggerPrimitive,
  Tooltip as TooltipPrimitive,
  type TooltipTriggerComponentProps,
  type TooltipProps,
  composeRenderProps,
//   OverlayArrow,
} from "react-aria-components";

const styles = tv({
  slots: {
    content: [
      "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
    ],
    arrow: [
      "bg-primary fill-primary z-50 size-2.5 translate-y-[-2px] rotate-45 rounded-[2px]",
    ],
  },
});

function TooltipTrigger({ ...props }: TooltipTriggerComponentProps) {
    const {delay = 200, ...rest} = props;
  return <TooltipTriggerPrimitive data-slot="tooltip-trigger" delay={delay} {...rest} />;
}

function TooltipContent({ className, offset = 6, children, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive
      data-slot="tooltip-content"
      className={composeRenderProps(className, (className, renderProps) =>
        styles().content({
          ...renderProps,
          className,
        })
      )}
        offset={offset}
      {...props}
    >
      {(values) => (
        <>
          {/* <OverlayArrow className={styles().arrow()} /> */}

          {typeof children === "function" ? children(values) : children}
        </>
      )}
    </TooltipPrimitive>
  );
}

export { TooltipTrigger, TooltipContent };
