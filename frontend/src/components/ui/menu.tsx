import { tv } from "@/lib/tv";
import {
  Menu as MPrimitive,
  MenuItem as MIPrimitive,
  MenuTrigger as MTPrimitive,
  Popover,
  Text,
  type MenuTriggerProps,
  type MenuProps,
  type MenuItemProps,
  type TextProps,
  MenuSection as MenuSectionPrimitive,
  composeRenderProps,
  type MenuSectionProps,
} from "react-aria-components";

const styles = tv({
  slots: {
    popover: [
      "bg-popover text-popover-foreground entering:animate-in exiting:animate-out exiting:fade-out-0 entering:fade-in-0 exiting:zoom-out-95 entering:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
    ],
    item: [
      "focus:bg-accent scroll-m-1 focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    menu: ['space-y-0.5'],
    menuSection: ["space-y-0.5"]
  },
});

const MenuTrigger = (props: MenuTriggerProps) => {
  const { ...rest } = props;
  return <MTPrimitive {...rest} />;
};

const Menu = (props: MenuProps<object>) => {
  const {className, ...rest } = props;

  return (
    <Popover className={styles().popover()} trigger="manual">
      <MPrimitive   className={composeRenderProps(className, (className, renderProps) =>
        styles().menu({
          ...renderProps,
          className,
        })
      )} {...rest} />
    </Popover>
  );
};

const MenuItem = (props: MenuItemProps) => {
  const { className, ...rest } = props;
  return (
    <MIPrimitive
      className={composeRenderProps(className, (className, renderProps) =>
        styles().item({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    />
  );
};

const MenuItemLabel = (props: TextProps) => {
  const { slot = "label", ...rest } = props;
  return <Text slot={slot} {...rest} />;
};

const MenuItemDescription = (props: TextProps) => {
  const { slot = "description", ...rest } = props;
  return <Text slot={slot} {...rest} />;
};

const MenuSection = (props: MenuSectionProps<object>) => {
  const { className, ...rest } = props;
  return (
    <MenuSectionPrimitive
      className={
        styles().menuSection({
          className,
        })
      }
      {...rest}
    />
  );
};

export { Menu, MenuTrigger, MenuItem, MenuItemLabel, MenuItemDescription, MenuSection };
