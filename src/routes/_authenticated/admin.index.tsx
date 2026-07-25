import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminStats } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, CalendarClock, Clock, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  ssr: false,
  component: DashboardPage,
});

function DashboardPage() {
  const fn = useServerFn(getAdminStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });

  const cards = [
    { label: "طلبات قيد الانتظار", value: data?.pendingOrders, icon: Clock, to: "/admin/orders?status=pending" },
    { label: "طلبات اليوم", value: data?.todayOrders, icon: ShoppingBag, to: "/admin/orders" },
    { label: "مواعيد قيد الانتظار", value: data?.pendingAppointments, icon: CalendarClock, to: "/admin/appointments?status=pending" },
    { label: "زيارات قادمة", value: data?.upcomingAppointments, icon: CalendarDays, to: "/admin/appointments?status=confirmed" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">نظرة عامة على الطلبات والزيارات المنزلية.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to.split("?")[0] as any} className="block">
              <Card className="hover:border-primary transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isLoading ? "—" : c.value ?? 0}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <Card>
        <CardHeader><CardTitle>روابط سريعة</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link to="/admin/orders" className="text-primary hover:underline">إدارة الطلبات ←</Link>
          <Link to="/admin/appointments" className="text-primary hover:underline">إدارة المواعيد ←</Link>
        </CardContent>
      </Card>
    </div>
  );
}
