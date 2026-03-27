import { IconSvgs } from '@/assets/svg';
import type { IconSvgLocalProps } from './type';

export const IconSvgLocal = (props: IconSvgLocalProps) => {
  const { name, classNames, height, width, onClick } = props;
  const svgPath = IconSvgs[name];

  if (!svgPath) return null;

  return (
    <img
      src={svgPath}
      alt={name}
      height={height}
      width={width}
      onClick={onClick}
      className={classNames}
    />
  );
};