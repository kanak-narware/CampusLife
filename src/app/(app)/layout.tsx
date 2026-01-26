'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  PanelLeft,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { AuthGuard } from '@/components/auth-guard';
import { UserNav } from '@/components/user-nav';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/attendance', label: 'Attendance', icon: CheckCircle2 },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { user, isUserLoading } = useUser();

  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold font-headline">CampusLife</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          {isMobile && (
            <header className="p-4 border-b bg-card">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <Logo className="w-6 h-6 text-primary" />
                      <span className="text-lg font-semibold font-headline">CampusLife</span>
                  </div>
                  <SidebarTrigger asChild>
                      <Button variant="ghost" size="icon"><PanelLeft /></Button>
                  </SidebarTrigger>
               </div>
            </header>
          )}
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}
