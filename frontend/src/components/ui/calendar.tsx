import { tv } from "@/lib/tv";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Calendar as Primitive,
  CalendarCell,
  CalendarGrid,
  Heading,
  type CalendarProps,
  type DateValue,
  composeRenderProps,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
} from "react-aria-components";
import { Button, buttonVariants } from "./button";

const styles = tv({
  slots: {
    root: ["bg-background p-3 w-fit"],
    header: "flex items-center justify-between mb-2",
    calendarHeader: ["text-muted-foreground font-normal text-[0.8rem] pb-1"],
    calendarCell: [
      buttonVariants({
        variant: "ghost",
        size: "icon",
      }),
      "cursor-default selected:bg-primary selected:text-primary-foreground",
    ],
  },
});

const Calendar = (props: CalendarProps<DateValue>) => {
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
    >
      <header className={styles().header()}>
        <Button size="icon" variant="ghost" slot={"previous"}>
          <ChevronLeft />
        </Button>
        <Heading className="text-sm font-semibold tracking-tight" />
        <Button size="icon" variant="ghost" slot={"next"}>
          <ChevronRight />
        </Button>
      </header>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className={styles().calendarHeader()}>
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell className={styles().calendarCell()} date={date} />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </Primitive>
  );
};

export { Calendar };
