import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "تسجيل الدخول — لوحة تحكم ترينقلز أكسسوار" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ترينقلز أكسسوار — لوحة التحكم</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm /></TabsContent>
            <TabsContent value="signup"><SignupForm /></TabsContent>
          </Tabs>
          <p className="mt-4 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:underline">← العودة إلى الموقع</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("تم تسجيل الدخول");
    navigate({ to: "/admin" });
  }

  async function onForgot() {
    if (!email) return toast.error("أدخل بريدك الإلكتروني أولاً");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("تم إرسال بريد إعادة تعيين كلمة المرور");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
      </div>
      <div>
        <Label htmlFor="pwd">كلمة المرور</Label>
        <Input id="pwd" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
      </Button>
      <button type="button" onClick={onForgot} className="block w-full text-center text-sm text-muted-foreground hover:underline">
        هل نسيت كلمة المرور؟
      </button>
    </form>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("تفقّد بريدك الإلكتروني لتأكيد حسابك.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="su-email">البريد الإلكتروني</Label>
        <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
      </div>
      <div>
        <Label htmlFor="su-pwd">كلمة المرور</Label>
        <Input id="su-pwd" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جارٍ إنشاء الحساب…" : "إنشاء حساب"}
      </Button>
    </form>
  );
}
