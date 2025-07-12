import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DatePicker,
  DatePickerControls,
  DatePickerPopover,
} from "@/components/ui/datepicker";
import { Label } from "@/components/ui/label";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/comps")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6 space-y-10">
      <MenuTrigger>
        <Button variant="outline">Hello</Button>
        <Menu>
          <MenuItem onAction={() => alert("Action 1")}>
            <LogOut />
            <MenuItemLabel>Logout</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <Checkbox>Accept terms and conditions</Checkbox>

      <TooltipTrigger>
        <Button>Tooltip</Button>
        <TooltipContent>
          This is a tooltip that provides additional information about the
          button.
        </TooltipContent>
      </TooltipTrigger>

      <Select>
        <Label>Choose an option</Label>
        <SelectTrigger />
        <SelectContent>
          <SelectItem>Option 1</SelectItem>
          <SelectItem>Option 2</SelectItem>
          <SelectItem>Option 3</SelectItem>
          <SelectItem>Option 4</SelectItem>
          <SelectItem>Option 5</SelectItem>
        </SelectContent>
      </Select>

      <Calendar className={"rounded-md border shadow-sm"} />

      <DatePicker>
        <Label>Select a date</Label>
        <DatePickerControls />
        <DatePickerPopover />
      </DatePicker>
    </div>
  );
}
