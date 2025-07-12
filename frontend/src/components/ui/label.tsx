import { tv } from "@/lib/tv";
import { Label as Primitive, type LabelProps } from "react-aria-components";

const styles = tv({
  base: [
    "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  ],
});

const Label = (props: LabelProps) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      className={styles({
        className,
      })}
      {...rest}
    />
  );
};

export { Label };
