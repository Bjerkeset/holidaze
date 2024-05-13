"use client";
import { cn } from "@/lib/utils/utils";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MouseEventHandler, ReactNode } from "react";
import { LiaPlusSolid } from "react-icons/lia";
import { LiaMinusSolid } from "react-icons/lia";

type ValidateFunction = (value: number) => boolean;

// Theres a warning:
// Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
// that seem to come from this component "CountInput"

export default function CountInput({
  value,
  onChange,
  className,
  validate,
}: {
  value?: number;
  onChange?: Function;
  className?: string;
  validate?: ValidateFunction;
}) {
  const [count, setCounter] = useState(value || 0);
  const user = {
    value: 0,
    onChange: (c: any) => c >= 0,
  };

  useEffect(() => {
    if (onChange) onChange(count);
  }, [count]);

  useEffect(() => {
    setCounter(value || 0);
  }, [value]);

  function change(newValue: number) {
    newValue = Math.round(newValue);
    if (validate) {
      let isValid = validate(newValue);
      if (isValid) setCounter(newValue);
    } else setCounter(newValue);
  }

  function handleSubtraction() {
    change(count - 1);
  }
  function handleAddition() {
    change(count + 1);
  }
  return (
    <div
      className={cn(
        "w-32",
        "grid",
        "grid-cols-3",
        "bg-transparent",
        "px-3",
        "py-1",
        "text-sm",
        "transition-colors",
        className
      )}
    >
      <CounterButtonMinus onClick={handleSubtraction} />
      <Input
        type="number"
        className={cn(
          className,
          "w-full",
          "h-full",
          "text-inherit",
          "p-0",
          "rounded-none",
          "text-center",
          "no-spinner"
        )}
        value={count}
        onChange={(e) => change(Number(e.target.value))}
      />
      <CounterButtonPluss onClick={handleAddition} />
    </div>
  );
}

function CounterButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full",
        "h-full",
        "rounded-none",
        "first:rounded-l-lg",
        "last:rounded-r-lg",
        "hover:bg-primary",
        "hover:text-primary-foreground",
        "p-0",
        className
      )}
      variant={"ghost"}
      asChild
    >
      {children}
    </Button>
  );
}

export function CounterButtonPluss(props: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) {
  return (
    <CounterButton {...props}>
      <LiaPlusSolid className="w-full h-full" />
    </CounterButton>
  );
}

export function CounterButtonMinus(props: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) {
  return (
    <CounterButton {...props}>
      <LiaMinusSolid className="w-full h-full" />
    </CounterButton>
  );
}
