import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const data = [
  { goal: 4.0 },
  { goal: 3.0 },
  { goal: 2.0 },
  { goal: 3.0 },
  { goal: 2.0 },
  { goal: 2.8 },
  { goal: 1.9 },
  { goal: 2.4 },
  { goal: 3.0 },
  { goal: 2.0 },
  { goal: 2.8 },
  { goal: 1.9 },
  { goal: 3.4 },
];

interface RateDrawerProps {
    onClose: () => void;
    onSubmit: (rating: number) => void;
  }

  const RateDrawer: React.FC<RateDrawerProps> = ({ onClose, onSubmit }) => {
  const [goal, setGoal] = React.useState(5.0);

  function onClick(adjustment: number) {
    // Ensure the goal stays within the range of 0.0 to 5.0
    setGoal(Math.max(0.0, Math.min(5.0, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
            <img
              src="/assets/icons/rate2.svg"
              alt="rate"
              width={20}
              height={20}
              className="cursor-pointer"
            />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Rate Post</DrawerTitle>
            <DrawerDescription>Rate from 0.0 to 5.0.</DrawerDescription>
            <DrawerDescription>This action is irrevirsible once done successfully.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full bg-slate-800"
                onClick={() => onClick(-0.1)} // Decrement by 0.1
                disabled={goal <= 0.0}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal.toFixed(1)} {/* Display value with one decimal place */}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Rating
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full bg-slate-800"
                onClick={() => onClick(0.1)} // Increment by 0.1
                disabled={goal >= 5.0}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={{
                      fill: "white",
                      opacity: 0.9,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => onSubmit(goal)}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="" style={{color: 'black'}} onClick={onClose}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RateDrawer;
