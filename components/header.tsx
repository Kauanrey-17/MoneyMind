"use client";

import { Brain, Plus, Menu, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { MobileNav } from "@/components/mobile-nav";
import { NewTransactionDialog } from "@/components/new-transaction-dialog";

import { useFinance } from "@/context/finance-context";
import { useAuth } from "@/context/auth-context";

import { useState, useMemo } from "react";

export function Header() {
  const { user, signOut } = useAuth();

  const { selectedMonth } = useFinance();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  // =========================
  // USER INITIALS
  // =========================

  const userInitials = useMemo(() => {
    if (!user?.email) return "U";

    const parts = user.email.split("@")[0];

    const names = parts.split(/[.\-_ ]/);

    if (names.length === 1)
      return names[0].slice(0, 2).toUpperCase();

    return (
      names[0][0] + names[1][0]
    ).toUpperCase();
  }, [user]);

  // =========================
  // USER NAME
  // =========================

  const userName = useMemo(() => {
    if (!user?.email) return "Usuário";

    return user.email;
  }, [user]);

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    await signOut();
  }

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">

        <div className="flex h-full items-center justify-between px-4 lg:px-6">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[280px] bg-sidebar p-0 border-r border-border"
              >
                <SheetHeader className="px-4 pt-4 pb-2">

                  <SheetTitle className="flex items-center gap-2">

                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                      <Brain className="size-4 text-primary-foreground" />
                    </div>

                    <span className="font-semibold">
                      MoneyMind AI
                    </span>

                  </SheetTitle>

                </SheetHeader>

                <MobileNav />

              </SheetContent>
            </Sheet>

            {/* Month */}
            <div className="flex flex-col">

              <span className="text-xs text-muted-foreground">
                Período atual
              </span>

              <span className="text-sm font-semibold">
                {selectedMonth}
              </span>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* New Transaction */}
            <Button
              onClick={() => setDialogOpen(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="size-4" />

              <span className="hidden sm:inline">
                Nova Transação
              </span>

            </Button>

            {/* USER MENU */}
            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Avatar className="size-9 border border-border cursor-pointer hover:ring-2 hover:ring-primary/30 transition">

                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>

                </Avatar>

              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56"
              >

                <DropdownMenuLabel className="flex flex-col gap-1">

                  <span className="text-xs text-muted-foreground">
                    Logado como
                  </span>

                  <span className="text-sm font-medium truncate">
                    {userName}
                  </span>

                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer gap-2">
                  <User className="size-4" />
                  Perfil
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 text-red-500 focus:text-red-500"
                >

                  <LogOut className="size-4" />

                  Sair

                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>

        </div>

      </header>

      <NewTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}