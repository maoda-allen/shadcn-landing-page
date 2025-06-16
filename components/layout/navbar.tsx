"use client";
import { ChevronsDown, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";
import { useLanguage } from "@/lib/contexts/language-context";
import { LanguageSelector } from "../ui/language-selector";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useLanguage();

  const routeList = [
    {
      href: "#features",
      label: t('nav.features'),
    },
    {
      href: "#party-ideas",
      label: t('nav.partyIdeas'),
    },
    {
      href: "#pricing",
      label: t('nav.pricing'),
    },
    {
      href: "#faq",
      label: t('nav.faq'),
    },
  ];

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-30 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        {t('nav.brand')}
      </Link>
      
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
                    {t('nav.brand')}
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <div className="flex items-center gap-2">
                <ToggleTheme />
                <LanguageSelector />
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block">
        <NavigationMenuList className="flex items-center space-x-2">
          {routeList.map(({ href, label }) => (
            <NavigationMenuLink key={href} asChild>
              <Link href={href} className="text-base px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                {label}
              </Link>
            </NavigationMenuLink>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex items-center space-x-2">
        <Button asChild size="sm">
          <Link href="/birthday-party-planner">
            {t('nav.startPlanning')}
          </Link>
        </Button>
        
        <ToggleTheme />
        <LanguageSelector />
      </div>
    </header>
  );
};
