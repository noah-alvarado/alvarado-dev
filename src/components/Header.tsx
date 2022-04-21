import * as feather from 'feather-icons';

import { Component, For } from 'solid-js';

import { Link } from 'solid-app-router';
import Toggle from './Toggle';

type MenuLinkProps = { alt: string; icon: string; href: string; };
const links: MenuLinkProps[] = [
  { alt: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/noah-alvarado/' },
  { alt: 'GitHub', icon: 'github', href: 'https://github.com/noah-alvarado' },
];

const MenuLink: Component<MenuLinkProps> = (props) => {
  const iconHTML = feather.icons[props.icon].toSvg({ class: '' });
  return (
    <li>
      <Link href={props.href} innerHTML={iconHTML}></Link>
    </li>
  );
};

const Header: Component = () => {
  return (
    <header class="text-stone-300 bg-stone-900 sticky top-0 z-10">
      <div class="container p-4 mx-auto">
        {/* TODO: if on a specific person's page, change to their picture and logo */}
        <div class="flex flex-wrap justify-between items-center gap-x-4 gap-y-2">
          <Link href="/">
            {/* TODO: be creative (ask Emily for help) and come up with a logo */}
            <h1 class="text-2xl leading-none">alvarado.dev</h1>
          </Link>
          <div class="flex flex-nowrap">
            <ul class="list-none flex items-center gap-x-6">
              {/* <Toggle /> */}
              <For each={links} children={MenuLink} />
            </ul>
          </div>
        </div>
      </div>
      <div class="w-full h-[2px] bg-orange-400" />
    </header>
  );
};

export default Header;
