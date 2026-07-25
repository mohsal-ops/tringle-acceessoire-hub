import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { listAdminProducts, deleteProduct } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { productActiveFilterLabel } from "@/lib/admin-i18n";

const ACTIVE_FILTERS = ["all", "active", "inactive"] as const;

export const Route = createFileRoute("/_authenticated/admin/products/")({
  ssr: false,
  validateSearch: z.object({
    q: z.string().optional().default(""),
    active: z.enum(ACTIVE_FILTERS).optional().default("all"),
  }),
  component: ProductsListPage,
});

function ProductsListPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listAdminProducts);
  const del = useServerFn(deleteProduct);
  const [pending, setPending] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search.q, search.active],
    queryFn: () => list({ data: { search: search.q || undefined, active: search.active } }),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف المنتج");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setPending(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">المنتجات</h1>
          <p className="text-sm text-muted-foreground">{data?.products.length ?? 0} منتج</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new"><Plus className="h-4 w-4 me-1" /> منتج جديد</Link>
        </Button>
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle className="text-base">تصفية</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="ابحث بالاسم أو الرابط…"
              defaultValue={search.q}
              className="sm:w-64"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate({ to: "/admin/products", search: (p: any) => ({ ...p, q: (e.target as HTMLInputElement).value }) });
                }
              }}
            />
            <Select
              value={search.active}
              onValueChange={(v) => navigate({ to: "/admin/products", search: (p: any) => ({ ...p, active: v }) })}
            >
              <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTIVE_FILTERS.map((s) => <SelectItem key={s} value={s}>{productActiveFilterLabel(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">جارٍ التحميل…</p>
          ) : data && data.products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الرابط</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-end">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((p: any) => {
                  const img = p.images?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0];
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        {img ? (
                          <img src={img.url} alt="" className="h-10 w-10 rounded object-cover border" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {p.name_ar || p.name_fr}
                        {p.is_featured && <Star className="inline h-3 w-3 ms-1 text-primary fill-primary" />}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{p.slug}</TableCell>
                      <TableCell className="text-sm">{p.category?.name_ar ?? p.category?.name_fr ?? "—"}</TableCell>
                      <TableCell>{Number(p.price).toLocaleString()} دج</TableCell>
                      <TableCell>
                        <Badge variant={p.is_active ? "default" : "secondary"}>
                          {p.is_active ? "مُفعّل" : "غير مُفعّل"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/admin/products/$id" params={{ id: p.id }}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPending(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">لا توجد منتجات بعد.</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => pending && delMut.mutate(pending)}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
