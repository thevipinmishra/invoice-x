import { tv } from "@/lib/tv";
import {
  composeRenderProps,
  Group,
  NumberField as Primitive,
  type NumberFieldProps,
} from "react-aria-components";
import { Input } from "./input";
import { Button } from "./button";
import { Minus, Plus } from "lucide-react";

const styles = tv({
  slots: {
    root: ["grid gap-2 w-full"],
    group: ["flex rounded-md border border-input"]
  },
});

const NumberField = (props: NumberFieldProps) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      className={composeRenderProps(className, (className, renderProps) =>
        styles().root({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    />
  );
};

const NumberInput = () => {
    return <Group className={styles().group()}>
        <Button variant="ghost" size="icon" slot="decrement" className="rounded-r-none">
            <Minus />
        </Button>
        <Input className="rounded-none border-y-0 shadow-none" />
         <Button variant="ghost" size="icon" slot="increment" className="rounded-l-none">
            <Plus />
        </Button>
    </Group>
}

export { NumberField, NumberInput };
