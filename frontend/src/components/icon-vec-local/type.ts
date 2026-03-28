import type { IconSvgsTypes } from "@/assets/svg";
import type { SVGProps } from "react";

export interface IconSvgLocalProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconSvgsTypes;
  classNames?: string;
  onClick?: () => void;
}
