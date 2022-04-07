import { Component, For } from 'solid-js';
import { Link, NavLink } from 'solid-app-router';

// TODO: add github and linkedin icon links
const links: MenuLinkProps[] = [
  { title: 'About', href: '/about' },

  // TODO: do some projects
  // { title: 'Projects', href: '/projects' },

  { title: 'Contact', href: '/contact' },
];

type MenuLinkProps = { title: string; href: string; };
const MenuLink: Component<MenuLinkProps> = (props) => {
  return (
    <li>
      <NavLink href={props.href} class="text-sm md:text-md">
        {props.title}
      </NavLink>
    </li>
  );
};

const Header: Component = () => {
  return (
    <header class="text-stone-300 bg-stone-900">
      <div class="container p-4 mx-auto">
        {/* TODO: if on a specific person's page, change to their picture and logo */}
        <div class="flex flex-wrap justify-between items-baseline gap-x-4">
          <Link href="/">
            {/* TODO: be creative (ask Emily for help) and come up with a logo */}
            <h1 class="text-2xl">alvarado.dev</h1>
          </Link>
          <nav class="flex flex-nowrap">
            <ul class="list-none flex items-baseline gap-x-6 gap-y-2">
              <For each={links} children={MenuLink} />
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
