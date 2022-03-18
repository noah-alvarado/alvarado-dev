import { Component, For } from 'solid-js';
import { Link, NavLink } from 'solid-app-router';

// TODO: add github and linkedin icon links
const links: MenuLinkProps[] = [
  { title: 'Projects', href: '/projects' },

  // IDEA: might be dropdown if on main page and there are multiple profiles (noah + jude + abram)
  { title: 'Contact', href: '/contact' },
];

type MenuLinkProps = { title: string; href: string; };
const MenuLink: Component<MenuLinkProps> = (props) => {
  return (
    <li>
      <NavLink
        href={props.href}
        class="text-lg text-white hover:bg-indigo-500 py-2 px-6 rounded-lg"

        // might not need this once other pages are made
        end
      >
        {props.title}
      </NavLink>
    </li>
  );
};

const Header: Component = () => {
  return (
    <header class="bg-blue-700 text-white py-6">
      {/* IDEA: if on a specific person's page, change to their picture and logo */}
      <div class="container flex justify-between items-baseline px-4">
        <Link href="/">
          <h1 class="text-2xl">alvarado.dev</h1>
        </Link>
        <nav class="screeflex flex-nowrap">
          <ul class="list-none flex items-baseline gap-6">
            <For each={links} children={MenuLink} />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
