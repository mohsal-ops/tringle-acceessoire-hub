import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLocale } from "@/lib/i18n";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة | FAQ — Tringles Accessoires" },
      { name: "description", content: "Réponses rapides : prise de mesures gratuite, délais, paiement à la livraison, pose, tailles de tringles et tissus." },
      { property: "og:title", content: "الأسئلة الشائعة | FAQ — Tringles Accessoires" },
      { property: "og:description", content: "Tout ce que les clients demandent avant de commander des rideaux et des tringles en Algérie." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { t, locale } = useLocale();
  const { get } = useSettings();
  const email = get("contact_email");
  const wa = get("whatsapp_number", "+213561238016").replace(/\D/g, "");

  const items = [
    {
      q: t({ ar: "واش القياس مجاني؟", fr: "La prise de mesures est-elle gratuite ?" }),
      a: t({
        ar: "نعم. زيارة منزلية مجانية لتأخذ القياسات وتشرح الخيارات في جميع الولايات. ما تلزمكش تشرى، والموعد يحجز من صفحة حجز الزيارة.",
        fr: "Oui. Une visite à domicile gratuite prend vos mesures et vous explique les options, dans toutes les wilayas. Elle ne vous engage à rien ; le rendez-vous se réserve depuis la page de réservation.",
      }),
    },
    {
      q: t({ ar: "كيفاش نعرف المقاس الصحيح؟", fr: "Comment choisir la bonne taille ?" }),
      a: t({
        ar: "كل منتج يعرض المقاسات المتاحة (من 1 متر إلى 6 متر) مع سعر كل مقاس. قيس عرض النافذة من الحافة إلى الحافة، وإذا كنت محتار ابعت لنا القياس على واتساب وننصحك.",
        fr: "Chaque produit affiche les tailles disponibles (de 1 m à 6 m) avec le prix de chaque taille. Mesurez la largeur de la fenêtre d'un bord à l'autre ; en cas de doute, envoyez-nous la mesure sur WhatsApp et nous vous conseillons.",
      }),
    },
    {
      q: t({ ar: "كيفاش نخلص؟", fr: "Comment payer ?" }),
      a: t({
        ar: "الدفع عند الاستلام: تخلص الموزّع قيمة المنتج ومصاريف التسليم عند ما يوصلك الطرد. ما نطلبوش دفعة مقدمة.",
        fr: "Paiement à la livraison : vous réglez au livreur le produit et les frais de livraison à la remise du colis. Aucun acompte n'est demandé.",
      }),
    },
    {
      q: t({ ar: "قدّاش يخلص التوصيل؟", fr: "Quel est le coût de la livraison ?" }),
      a: t({
        ar: "التوصيل على حساب 58 ولاية، والسعر يختلف حسب الولاية ونوع التسليم (إلى المنزل أو إلى مكتب التوصيل). المبلغ يظهر تلقائيًا في نموذج الطلب قبل التأكيد، وقائمة الولايات كاملة في صفحة الشحن والتسليم.",
        fr: "La livraison couvre les 58 wilayas, avec un tarif variable selon la wilaya et le mode choisi (domicile ou bureau). Le montant s'affiche automatiquement dans le formulaire avant validation, et la liste complète est dans la page Livraison.",
      }),
    },
    {
      q: t({ ar: "واش تركّبوا السكك؟", fr: "Assurez-vous la pose ?" }),
      a: t({
        ar: "نعم، خدمة التركيب متوفرة. نتفق معك على الموعد والمبلغ قبل التدخل، حسب الولاية وعدد النوافذ.",
        fr: "Oui, la pose est disponible. Le rendez-vous et le tarif sont convenus avant l'intervention, selon la wilaya et le nombre de fenêtres.",
      }),
    },
    {
      q: t({ ar: "قدّاش من وقت باش يوصل الطلب؟", fr: "Quel est le délai de réception ?" }),
      a: t({
        ar: "نبدأ التحضير بعد تأكيد الطلب هاتفًا أو عبر واتساب، والمدة تعتمد على المقاسات المطلوبة والولاية. نعلمك بالموعد التقريبي عند التأكيد.",
        fr: "La préparation démarre après confirmation par téléphone ou WhatsApp ; la durée dépend des tailles commandées et de la wilaya. Le délai approximatif est communiqué à la confirmation.",
      }),
    },
    {
      q: t({ ar: "نقدر نبدّل اللون أو المقاس؟", fr: "Puis-je changer de coloris ou de taille ?" }),
      a: t({
        ar: "قبل ما نبدأ التحضير، نعم. بعد التحضير، الستائر المفصّلة على مقاسك ما تُبدَّلش. التفاصيل في صفحة سياسة الإرجاع.",
        fr: "Avant le lancement en fabrication, oui. Après, les rideaux confectionnés sur mesure ne sont pas échangeables. Le détail est dans la page Retours et échanges.",
      }),
    },
    {
      q: t({ ar: "واش الأقمشة تبقى مريحة للغسيل؟", fr: "Les tissus se lavent-ils facilement ?" }),
      a: t({
        ar: "نوفّر أقمشة تخدم مع الغسل العادي حسب تعليمات كل منتج، ونشرحلك طريقة العناية عند الاستشارة. الأقمشة الثقيلة تحتاج عناية خاصة ونعلمك بها من قبل.",
        fr: "Nous proposons des tissus compatibles avec un lavage courant selon les indications de chaque produit, et nous expliquons l'entretien lors du conseil. Les tissus lourds demandent un soin particulier, précisé à l'avance.",
      }),
    },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">{t({ ar: "الأسئلة الشائعة", fr: "Questions fréquentes" })}</h1>
        <p className="mt-3 text-muted-foreground">
          {t({ ar: "كل اللي يسألنا عليه الزبائن قبل الطلب، مكتوب باختصار.", fr: "Tout ce que les clients nous demandent avant de commander, résumé ici." })}
        </p>
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-border bg-card p-5 [&_summary]:list-none">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                <span>{item.q}</span>
                <span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">{t({ ar: "ما لقيتش جوابك؟", fr: "Vous n'avez pas trouvé votre réponse ?" })}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t({ ar: "ابعتلنا رسالة على واتساب ونجّاوبك في الحين.", fr: "Écrivez-nous sur WhatsApp, nous répondons tout de suite." })}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white hover:brightness-95">
              WhatsApp
            </a>
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary break-all">
                {email}
              </a>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
