"use client";

import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ActionIcon, AppShell, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPower, IconHome2, IconMenu } from "@tabler/icons-react";
import { logout } from "../../utils/action";
import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(() => import("../../components/ThemeSwitcher"), {
  ssr: false,
});
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div>
      <AppShell
        layout="alt"
        header={{ height: 60 }}
        navbar={{
          width: 240,
          breakpoint: "sm",
          collapsed: { mobile: desktopOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <div className="flex px-4 py-2 items-center gap-4">
            <ActionIcon
              classNames={{ root: "border-none" }}
              size="lg"
              variant="default"
              onClick={toggleDesktop}
            >
              <IconMenu size={20} />
            </ActionIcon>
            <div className="items-center flex-1 flex justify-end gap-4">
              <ThemeSwitcher />
              <ActionIcon
                classNames={{ root: "border-none" }}
                size="lg"
                variant="default"
                onClick={async () => {
                  await logout();
                  notifications.show({
                    title: "Logged Out",
                    message: "You are Logged Out Successfully",
                  });
                  router.push("/admin/login");
                  return;
                }}
              >
                <IconPower size={20} />
              </ActionIcon>
            </div>
          </div>
        </AppShell.Header>
        <AppShell.Navbar className="bg-primary-900 dark:bg-zinc-800" p="md">
          <h4 className="p-0 m-0 mb-10 mt-2 text-lg text-center uppercase text-zinc-50 font-normal">
            NEXT BLOG
          </h4>
          <NavLink
            href="/admin/home"
            component={Link}
            label="Home"
            className={`my-1 ${pathname == "/admin/home" ? "bg-white text-zinc-800" : ""}`}
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          />
          <NavLink
            component="button"
            label="Categories"
            className={`my-1 ${pathname.includes("/admin/category") ? "bg-white text-zinc-800" : ""}`}
            opened={pathname.includes("/admin/category")}
            onClick={() => {
              router.push("/admin/category");
            }}
            childrenOffset={28}
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          >
            <NavLink
              href="/admin/category"
              component={Link}
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              label="View Category"
            />
            <NavLink
              href="/admin/category/manage"
              component={Link}
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              label="Add Category"
            />
          </NavLink>
          <NavLink
            component="button"
            label="Posts"
            className={`my-1 ${pathname.includes("/admin/post") ? "bg-white text-zinc-800" : ""}`}
            opened={pathname.includes("/admin/post")}
            onClick={() => {
              router.push("/admin/post");
            }}
            childrenOffset={28}
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          >
            <NavLink
              href="/admin/post"
              component={Link}
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              label="View Post"
            />
            <NavLink
              href="/admin/post/manage"
              component={Link}
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              label="Add Post"
            />
          </NavLink>
          <NavLink
            href="/admin/gallery"
            component={Link}
            label="Gallery"
            className={`my-1 ${pathname == "/admin/gallery" ? "bg-white text-zinc-800" : ""}`}
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          />
        </AppShell.Navbar>
        <AppShell.Main className="bg-zinc-50 dark:bg-zinc-800">
          {children}
        </AppShell.Main>
      </AppShell>
    </div>
  );
}
