"use client"

import { Navbar as NextUINavbar, NavbarContent, NavbarMenu, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenuItem } from "@nextui-org/navbar"
import { Link } from "@nextui-org/link"
import { link as linkStyles } from "@nextui-org/theme"
import { siteConfig } from "@/config/site"
import NextLink from "next/link"
import clsx from "clsx"
import { ThemeSwitch } from "@/components/theme-switch"
import { GithubIcon } from "@/components/icons"
import { Logo } from "@/components/icons"
import { usePathname } from "next/navigation"
import { Button } from "@nextui-org/button"
import { hasAccessToken } from "@/config/hasAccessToken"
import { useEffect, useState } from "react"
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar"

export const Navbar = () => {
  const pathName = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = hasAccessToken()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleSignOut = () => {
    console.log("sign out clicked")
  }

  const handleDashboard = () => {
    return <Link href="/dashboard"></Link>
  }

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Chat App RH</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(linkStyles({ color: "foreground" }), {
                  "text-blue-400 font-semibold": pathName === item.href,
                })}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button fullWidth onClick={handleDashboard} size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button color="danger" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" className="w-8 h-8 text-tiny" />
            </>
          ) : (
            <>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
              <Link href="/auth/login">
                <Button color="primary" size="sm">
                  Login
                </Button>
              </Link>
              <Link isExternal href={siteConfig.links.github} aria-label="Github">
                <GithubIcon className="text-default-500" />
              </Link>
            </>
          )}
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {isLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <>
            <Button fullWidth size="sm" onClick={handleDashboard}>
              Dashboard
            </Button>
            <Button fullWidth color="primary" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/register">
              <Button size="sm">Sign Up</Button>
            </Link>
            <Link href="/auth/login">
              <Button color="primary" size="sm">
                Login
              </Button>
            </Link>
          </>
        )}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(linkStyles({ color: "foreground" }), {
                  "text-blue-400 font-semibold": pathName === item.href,
                })}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  )
}
