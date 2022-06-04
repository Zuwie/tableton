import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

export default function RemixLink(props: LinkProps) {
  return <Link {...props}>{props.children}</Link>;
}
