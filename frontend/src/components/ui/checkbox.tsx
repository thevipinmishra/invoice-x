import { tv } from "@/lib/tv";
import { Check } from "lucide-react";
import {
  composeRenderProps,
  Checkbox as Primitive,
  CheckboxGroup as PrimitiveGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from "react-aria-components";

const styles = tv({
  slots: {
     root: [
      "flex gap-3 group items-center",
    ],
    checkbox: [
      " flex w-full border-input dark:bg-input/30 group-selected:bg-primary group-selected:text-primary-foreground dark:group-selected:bg-primary group-selected:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    ],
    icon: ['size-3.5 hidden group-selected:block'],
    group: [""],
  },
});

const Checkbox = (props: CheckboxProps) => {
  const { className, children, ...rest } = props;
  return (
    <Primitive
      className={composeRenderProps(className, (className, renderProps) =>
        styles().root({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    >
      {(values) => (
        <>
          <div className={styles().checkbox()}>
            <Check className={styles().icon()} />
          </div>
          {typeof children === "function" ? children(values) : <span className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">{children}</span>}
        </>
      )}
    </Primitive>
  );
};

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const { className, ...rest } = props;
  return (
    <PrimitiveGroup
      className={composeRenderProps(className, (className, renderProps) =>
        styles().group({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    />
  );
};

export { Checkbox, CheckboxGroup };
