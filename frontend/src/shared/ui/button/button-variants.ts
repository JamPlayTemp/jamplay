import { cva } from "class-variance-authority";

export const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
