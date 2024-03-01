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
import { Avatar } from "@nextui-org/avatar"
import { useMutation } from "react-query"
import { useRouter } from "next/navigation"
import { SignOut } from "@/types/sign-out"

export const Navbar = () => {
  const pathName = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [uuid, setUuid] = useState<string | null>(null)
  const isAuthenticated = hasAccessToken()
  const router = useRouter()

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid")
    if (storedUuid) {
      setUuid(storedUuid)
    }

    const delayTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 10)

    return () => clearTimeout(delayTimeout)
  }, [])

  const signOutUser = useMutation<void, Error, SignOut>(
    async ({ userId }) => {
      const response = await fetch(`http://localhost:3001/v1/api/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Unknown error")
      }
    },
    {
      onSuccess: () => {
        console.log(`Success to sign out`)
      },
      onError: () => {
        console.log(`Failed to sign out`)
      },
    }
  )

  const handleSignOut = () => {
    if (uuid) {
      localStorage.removeItem("uuid")
      localStorage.removeItem("access_token")

      signOutUser.mutate({ userId: uuid })
      router.push("/")
    }
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
                  "text-blue-300 font-semibold": pathName === item.href,
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
            <div className="flex justify-between">
              <div className="flex justify-start gap-2">
                <Link href="/dashboard">
                  <Button onClick={handleDashboard} size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button color="danger" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" className="w-8 h-8 text-tiny" />
            </div>
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
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(linkStyles({ color: "foreground" }), {
                  "text-blue-300 font-semibold": pathName === item.href,
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
