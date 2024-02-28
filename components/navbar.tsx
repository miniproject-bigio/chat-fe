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

export const Navbar = () => {
  const pathName = usePathname()

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
                  "from-blue-500 to-green-800 bg-clip-text text-transparent bg-gradient-to-b font-semibold": pathName === item.href,
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
        <Link href="/auth/register">
          <Button size="sm">Sign Up</Button>
        </Link>
        <Link href="/auth/login">
          <Button color="primary" size="sm">
            Login
          </Button>
        </Link>
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <GithubIcon className="text-default-500" />
          </Link>
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
        <div className="flex justify-start gap-3 w-full">
          <Link href="/auth/register">
            <Button fullWidth size="sm">
              Sign Up
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button color="primary" size="sm">
              Login
            </Button>
          </Link>
        </div>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(linkStyles({ color: "foreground" }), {
                  "from-blue-500 to-green-800 bg-clip-text text-transparent bg-gradient-to-b font-semibold": pathName === item.href,
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
