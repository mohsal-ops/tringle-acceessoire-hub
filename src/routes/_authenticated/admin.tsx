import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ShoppingBag, CalendarClock, Package, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "لوحة التحكم — ترينقل أكسسوار" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { to: "/admin/appointments", label: "المواعيد", icon: CalendarClock },
  { to: "/admin/products", label: "المنتجات", icon: Package },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const check = useServerFn(checkIsAdmin);
  const { data, isLoading, error } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => check(),
    retry: false,
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جارٍ التحميل…</div>;
  }
  if (error || !data?.isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">تم رفض الوصول</h1>
        <p className="text-muted-foreground max-w-md">أنت مسجّل الدخول لكن ليس لديك صلاحية الوصول إلى لوحة التحكم.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={signOut}>تسجيل الخروج</Button>
          <Button asChild><Link to="/">العودة إلى الموقع</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex bg-muted/20">
      <aside className="w-60 shrink-0 border-e bg-card flex flex-col">
        <div className="px-5 py-5 border-b">
          <div className="font-semibold">ترينقل أكسسوار</div>
          <div className="text-xs text-muted-foreground">لوحة التحكم</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <ExternalLink className="h-4 w-4" /> عرض الموقع
          </a>
          <button onClick={signOut} className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
