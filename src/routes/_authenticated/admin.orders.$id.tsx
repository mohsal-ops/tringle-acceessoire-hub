import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { getOrder, updateOrderStatus, updateOrderNotes } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { orderStatusLabel, deliveryTypeLabel } from "@/lib/admin-i18n";

export const Route = createFileRoute("/_authenticated/admin/orders/$id")({
  ssr: false,
  component: OrderDetailPage,
});

const STATUSES = ["pending", "confirmed", "in_delivery", "delivered", "cancelled"] as const;

function OrderDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const get = useServerFn(getOrder);
  const updateStatus = useServerFn(updateOrderStatus);
  const updateNotes = useServerFn(updateOrderNotes);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => get({ data: { id } }),
  });

  const [status, setStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (data?.order) {
      setStatus(data.order.status);
      setAdminNotes(data.order.admin_notes ?? "");
    }
  }, [data]);

  const statusMut = useMutation({
    mutationFn: () => updateStatus({ data: { id, status: status as any, note: statusNote || undefined } }),
    onSuccess: () => {
      toast.success("تم تحديث الحالة");
      setStatusNote("");
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const notesMut = useMutation({
    mutationFn: () => updateNotes({ data: { id, admin_notes: adminNotes } }),
    onSuccess: () => {
      toast.success("تم حفظ الملاحظات");
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">جارٍ التحميل…</div>;
  if (!data?.order) return <div className="p-8">غير موجود.</div>;
  const o: any = data.order;
  const snap = o.product_snapshot ?? {};

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> العودة إلى الطلبات
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold font-mono">{o.order_number}</h1>
          <p className="text-sm text-muted-foreground">أُنشئ في {new Date(o.created_at).toLocaleString()}</p>
        </div>
        <Badge variant="secondary">{orderStatusLabel(o.status)}</Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>الزبون</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="الاسم" value={o.customer_name} />
            <Row label="الهاتف" value={o.customer_phone} mono />
            {o.customer_email && <Row label="البريد الإلكتروني" value={o.customer_email} />}
            <Row label="التوصيل" value={deliveryTypeLabel(o.delivery_type)} />
            {o.wilaya?.name_fr && <Row label="الولاية" value={o.wilaya.name_fr} />}
            {o.city?.name_fr && <Row label="البلدية" value={o.city.name_fr} />}
            {o.address && <Row label="العنوان" value={o.address} />}
            {o.notes && <Row label="ملاحظة الزبون" value={o.notes} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>المنتج</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="المنتج" value={snap.name_ar || snap.name_fr || "—"} />
            <Row label="سعر الوحدة" value={`${Number(o.unit_price).toLocaleString()} دج`} />
            <Row label="الكمية" value={String(o.quantity)} />
            <Row label="المجموع" value={`${Number(o.total_price).toLocaleString()} دج`} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>تحديث الحالة</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{orderStatusLabel(s)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              placeholder="ملاحظة اختيارية للسجل"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
            <Button onClick={() => statusMut.mutate()} disabled={statusMut.isPending || status === o.status}>
              {statusMut.isPending ? "جارٍ الحفظ…" : "حفظ الحالة"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>ملاحظات داخلية</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea rows={4} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
          <Button onClick={() => notesMut.mutate()} disabled={notesMut.isPending}>
            {notesMut.isPending ? "جارٍ الحفظ…" : "حفظ الملاحظات"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>سجل الحالات</CardTitle></CardHeader>
        <CardContent>
          {data.history.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا يوجد سجل بعد.</p>
          ) : (
            <ul className="space-y-3">
              {data.history.map((h: any) => (
                <li key={h.id} className="flex gap-3 text-sm border-s-2 border-primary/40 ps-3">
                  <div className="flex-1">
                    <div>
                      <span className="text-muted-foreground">{h.old_status ? orderStatusLabel(h.old_status) : "جديد"}</span>
                      {" ← "}
                      <span className="font-medium">{orderStatusLabel(h.new_status)}</span>
                    </div>
                    {h.note && <div className="text-muted-foreground mt-1">{h.note}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{new Date(h.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}
