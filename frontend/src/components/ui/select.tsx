import { tv } from "@/lib/tv";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  composeRenderProps,
  ListBox,
  ListBoxItem,
  Popover,
  Select as SelectPrimitive,
  SelectValue,
  type ListBoxProps,
  type ListBoxItemProps,
  type SelectProps,
} from "react-aria-components";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

const styles = tv({
  slots: {
    select: ["grid w-full gap-2"],
    listbox: ["grid w-full p-1 gap-0.5 min-w-[var(--trigger-width)]"],
    popover: [
      "bg-popover text-popover-foreground entering:animate-in exiting:animate-out exiting:fade-out-0 entering:fade-in-0 exiting:zoom-out-95 entering:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md group",
    ],
    listboxItem: [
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
    ],
  },
});

const Select = (props: SelectProps) => {
  const { className, ...rest } = props;
  return (
    <SelectPrimitive
      className={composeRenderProps(className, (className, renderProps) =>
        styles().select({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    />
  );
};

const SelectTrigger = (props: ButtonProps) => {
  const { variant = "outline", ...rest } = props;
  return (
    <Button className={cn("justify-between gap-4")} variant={variant} {...rest}>
      <SelectValue
        className={cn("flex-1 text-left overflow-hidden text-ellipsis")}
      />
      <ChevronsUpDown
        aria-hidden
        className="shrink-0 text-muted-foreground size-3.5"
      />
    </Button>
  );
};

const SelectContent = <T extends object>(props: ListBoxProps<T>) => {
  const { className, ...rest } = props;
  return (
    <Popover className={styles().popover()}>
      <ListBox
        className={composeRenderProps(className, (className, renderProps) =>
          styles().listbox({
            ...renderProps,
            className,
          })
        )}
        {...rest}
      />
    </Popover>
  );
};

const SelectItem = (props: ListBoxItemProps) => {
  const { className, children, ...rest } = props;
  return (
    <ListBoxItem
      className={composeRenderProps(className, (className, renderProps) =>
        styles().listboxItem({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children(values) : children}
          {values.isSelected && (
            <Check className="text-foreground size-4 absolute right-2 top-1/2 -translate-y-1/2" />
          )}
        </>
      )}
    </ListBoxItem>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem };
