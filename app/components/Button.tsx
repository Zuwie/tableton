import classNames from "classnames";
import type { ButtonHTMLAttributes, FC, ReactNode, Ref } from "react";
import { forwardRef } from "react";

enum ButtonVariant {
  Primary = "primary",
  PrimaryGhost = "primary-ghost",
  PrimaryLight = "primary-light",
  White = "white",
  WhiteGhost = "white-ghost",
  Success = "success",
  Danger = "danger",
  Cancel = "cancel",
}

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant: ButtonVariant;
  ref?: Ref<HTMLButtonElement>;
}

export const Button: FC<IButtonProps> = forwardRef((props, ref) => (
  <button
    ref={ref}
    type="button"
    {...props}
    className={classNames([props.className], {
      "button-primary": props.variant === ButtonVariant.Primary,
      "button-primary-ghost": props.variant === ButtonVariant.PrimaryGhost,
      "button-primary-light": props.variant === ButtonVariant.PrimaryLight,
      "button-white": props.variant === ButtonVariant.White,
      "button-white-ghost": props.variant === ButtonVariant.WhiteGhost,
      "button-success": props.variant === ButtonVariant.Success,
      "button-danger": props.variant === ButtonVariant.Danger,
      "button-cancel": props.variant === ButtonVariant.Cancel,
    })}
  >
    {props.children}
  </button>
));

Button.displayName = "Button";
