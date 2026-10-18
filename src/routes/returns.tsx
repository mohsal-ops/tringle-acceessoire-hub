import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLocale } from "@/lib/i18n";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Retours et échanges — Tringles Accessoires" },
      { name: "description", content: "Ce qui se passe si un rideau, une tringle ou un accessoire ne convient pas : vérification à la réception, échange et retour." },
      { property: "og:title", content: "Retours et échanges — Tringles Accessoires" },
      { property: "og:description", content: "Vérifiez le colis devant le livreur, et contactez-nous rapidement pour un échange ou un retour." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  const { t } = useLocale();
  const { get } = useSettings();
  const email = get("contact_email");
  const phones = [get("contact_phone_1"), get("contact_phone_2")].filter(Boolean);

  const sections = [
    {
      title: t({ ar: "افحص الطرد قبل ما تدفع", fr: "Vérifiez le colis avant de payer" }),
      body: t({
        ar: "الدفع عند الاستلام يعطيك الحق تفتح الطرد وتشوف المنتج قدام الموزّع. إذا كان المقاس مختلف، اللون غير متطابق، أو فيه قطعة ناقصة، ارفض الاستلام وصور المنتج وأرسل لنا الصور على واتساب. بلا ما تدفع ما يلزمك شيء.",
        fr: "Le paiement à la livraison vous donne le droit d'ouvrir le colis devant le livreur. Si la taille diffère, le coloris ne correspond pas ou une pièce manque, refusez la réception, prenez des photos et envoyez-les sur WhatsApp. Sans paiement, rien ne vous est dû.",
      }),
    },
    {
      title: t({ ar: "الإرجاع بسبب عيب", fr: "Retour pour défaut" }),
      body: t({
        ar: "إذا اكتشفت عيبًا في القماش أو السكّة بعد الاستلام، أخبرنا في أقرب وقت مع الصور. نبدّل القطعة المعيبة بواحدة سليمة، ونتكفّل بمصاريف الإرجاع والتبديل.",
        fr: "Si vous constatez un défaut sur le tissu ou la tringle après réception, prévenez-nous rapidement avec des photos. Nous remplaçons l'article défectueux par un article conforme, à nos frais, aller et retour.",
      }),
    },
    {
      title: t({ ar: "المقاسات الخاصة والتفصيل", fr: "Articles confectionnés sur mesure" }),
      body: t({
        ar: "الستائر المقصوصة أو المخيّطة على مقاسك، والألوان أو النموذج اللي اخترته بعد استشارتنا، ما تُرجَّع ولا تُبدَّل فقط لأن الرأي تغيّر — لأنّها خيّطت على مقاس بيتك. لهذا نأكد المقاس معك قبل التحضير، وننصح بالزيارة المنزلية المجانية.",
        fr: "Les rideaux coupés ou cousus à vos mesures, ainsi que les coloris et modèles retenus après notre conseil, ne sont ni repris ni échangés pour un simple changement d'avis : ils sont réalisés pour votre intérieur. C'est pourquoi la taille est confirmée avant fabrication et que la visite à domicile gratuite est conseillée.",
      }),
    },
    {
      title: t({ ar: "الإكسسوارات الجاهزة", fr: "Accessoires en stock" }),
      body: t({
        ar: "السكك، الحوامل، الخطّافات، والإكسسوارات الجاهزة يمكن إرجاعها إذا كانت كاملة وفي حالتها الأصلية، من غير ما تُركّب أو تتخدّم. مصاريف الإرجاع على حساب الزبون إلا إذا كان الخطأ من عندنا.",
        fr: "Rails, supports, crochets et autres accessoires en stock peuvent être retournés complets et dans leur état d'origine, sans avoir été posés ni utilisés. Les frais de retour restent à votre charge sauf si l'erreur vient de nous.",
      }),
    },
    {
      title: t({ ar: "كيف تفتح طلب إرجاع", fr: "Comment ouvrir un retour" }),
      body: t({
        ar: "أرسل رقم الطلب (يبدأ بـ CR-) مع شرح مختصر وصور إلى واتساب أو إلى بريدنا. نردّ عليك بخيار التبديل أو الاسترداد، والاسترداد يمشي بنفس طريقة الدفع عند الاستلام.",
        fr: "Envoyez votre numéro de commande (CR-…) avec une brève explication et des photos sur WhatsApp ou par e-mail. Nous revenons vers vous avec un échange ou un remboursement, ce dernier suivant le même chemin que le paiement à la réception.",
      }),
    },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">{t({ ar: "سياسة الإرجاع والتبديل", fr: "Retours et échanges" })}</h1>
        <p className="mt-3 text-muted-foreground">
          {t({ ar: "الستائر تُصنع على مقاسك، لكن حقك محفوظ: افحص، صوّر، وتواصل معنا.", fr: "Vos rideaux sont faits à vos mesures, mais vos droits sont garantis : vérifiez, prenez des photos, contactez-nous." })}
        </p>
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-sm">
          <h2 className="font-semibold">{t({ ar: "لبدء الإرجاع تواصل معنا", fr: "Pour démarrer un retour, contactez-nous" })}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="font-semibold text-primary" dir="ltr">{p}</a>
            ))}
            {email && <a href={`mailto:${email}`} className="font-semibold text-primary break-all">{email}</a>}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
