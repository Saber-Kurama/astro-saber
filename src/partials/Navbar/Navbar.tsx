import { Navbar } from "@/components/Navbar";
import useElementSize from '@/hooks/useElementSize';
import type { MenuConfig } from '@/components/Menu';

export interface NavbarConfig {
  menu?: MenuConfig;
  hasThemeToggle?: boolean;
  hasSearchToggle?: boolean;
}

export interface CustomNavbarProps extends React.PropsWithChildren<React.ComponentPropsWithoutRef<'nav'>>{
  containerClassName?: string;
  config: NavbarConfig;
}
export const CustomNavbar = ({ containerClassName, config, ...rest }: CustomNavbarProps) => { 
  const {
    menu = [],
    hasThemeToggle = true,
    hasSearchToggle = true,
  } = config;
  const [ref, size] = useElementSize<HTMLElement>();
  return (<Navbar ref={ref} position='floating' {...rest} hideOnScroll show={show} onShowChange={onShowChange}>saber</Navbar>)
}
export default CustomNavbar;