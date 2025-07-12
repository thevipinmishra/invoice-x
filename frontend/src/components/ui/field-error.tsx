import { tv } from "@/lib/tv";
import {
  composeRenderProps,
  FieldError as Primitive,
  type FieldErrorProps,
} from "react-aria-components";

const styles = tv({
  base: ["text-destructive text-sm"],
});

const FieldError = (props: FieldErrorProps) => {
  const { className, ...rest } = props;
  return (
    <Primitive
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

export { FieldError };
