import { ReactNode } from "react";
import { Button } from "@nextui-org/react";

interface FormButtonProps {
  children: ReactNode;
  isLoading: boolean;
  disabled?: boolean;
}

export default function FormButton({ children, isLoading, disabled }: FormButtonProps) {
  return (
    <Button type="submit" isLoading={isLoading} isDisabled={disabled || isLoading}>
      {children}
    </Button>
  );
}
