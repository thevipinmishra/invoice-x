import { tv } from "@/lib/tv";
import {
  composeRenderProps,
  TextField as Pritimive,
  type TextFieldProps,
} from "react-aria-components";

const styles = tv({
  base: ["grid w-full gap-2 items-center"],
});

const TextField = (props: TextFieldProps) => {
  const { className, ...rest } = props;
  return (
    <Pritimive
      className={composeRenderProps(className, (className, renderProps) =>
        styles({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    />
  );
};

export { TextField };
