import { tv } from "@/lib/tv";
import { Text, type TextProps } from "react-aria-components";

const styles = tv({
  base: ["text-muted-foreground text-sm"],
});

const Description = (props: TextProps) => {
  const { slot = "description", className, ...rest } = props;
  return (
    <Text
      slot={slot}
      className={styles({
        className,
      })}
      {...rest}
    />
  );
};

export { Description };
