"use client"

import { Brain, Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useFinance } from "@/lib/finance-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { useState } from "react"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"

export function Header() {
  const { selectedMonth } = useFinance()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="lg:hidden text-muted-foreground">
                <Menu className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
                    <Brain className="size-4 text-primary-foreground" />
                  </div>
                  MoneyMind AI
                </SheetTitle>
              </SheetHeader>
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">{selectedMonth}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nova Transacao</span>
          </Button>
          <Avatar className="size-8 border border-border">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
              MM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <NewTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </header>
  )
}
