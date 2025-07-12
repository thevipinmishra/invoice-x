import { tv } from "@/lib/tv";
import {
  DateInput,
  DatePicker as DPPrimitive,
  DateSegment,
  Dialog,
  Group,
  Popover,
  type DatePickerProps,
  type DateValue,
  composeRenderProps,
  type CalendarProps,
} from "react-aria-components";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

const styles = tv({
  slots: {
    datepicker: ["grid w-full gap-2"],
    popover: [
      "bg-popover text-popover-foreground entering:animate-in exiting:animate-out exiting:fade-out-0 entering:fade-in-0 exiting:zoom-out-95 entering:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
    ],
  },
});

const DatePicker = (props: DatePickerProps<DateValue>) => {
  const { className, ...rest } = props;
  return (
    <DPPrimitive
      className={composeRenderProps(className, (className, renderProps) =>
        styles().datepicker({
          ...renderProps,
          className,
        })
      )}
      {...rest}
    />
  );
};

const DatePickerControls = () => {
  return (
    <Group
      className={
        "flex border border-input items-center gap-4 h-9 rounded-md bg-transparent dark:bg-input/30"
      }
    >
      <DateInput className={"px-3 flex-1 flex "}>
        {(segment) => (
          <DateSegment
            segment={segment}
            className={
              "text-sm focus:bg-primary px-1 font-medium focus:outline-0 rounded focus:text-primary-foreground"
            }
          />
        )}
      </DateInput>
      <Button
        size="icon"
        variant="outline"
        className={"rounded-l-none border-r-0"}
      >
        <CalendarIcon />
      </Button>
    </Group>
  );
};

const DatePickerPopover = (props: CalendarProps<DateValue>) => {
  return (
    <Popover className={styles().popover()}>
      <Dialog className="outline-0">
        <Calendar {...props} />
      </Dialog>
    </Popover>
  );
};

export { DatePicker, DatePickerControls, DatePickerPopover };
