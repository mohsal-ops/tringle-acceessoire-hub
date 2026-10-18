import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLocale } from "@/lib/i18n";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — Tringles Accessoires" },
      { name: "description", content: "Conditions d'utilisation du site Tringles Accessoires : commandes, paiement à la livraison, prix et responsabilités." },
      { property: "og:title", content: "Conditions d'utilisation — Tringles Accessoires" },
      { property: "og:description", content: "Comment fonctionne une commande sur Tringles Accessoires : commande, confirmation, paiement à la livraison." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useLocale();
  const { get } = useSettings();
  const email = get("contact_email");

  const sections = [
    {
      title: t({ ar: "الطلب والتأكيد", fr: "Commande et confirmation" }),
      body: t({
        ar: "الطلب عبر الموقع أو واتساب لا يعني أن المنتج محجوز تلقائيًا. نتصل بك هاتفًا أو عبر واتساب لتأكيد المقاس، اللون، الكمية، وولاية التسليم قبل إرسال الطلب. أي تغيير في المقاس بعد التأكيد يُعامل كطلب جديد.",
        fr: "Passer une commande sur le site ou via WhatsApp ne réserve pas automatiquement le produit. Nous vous contactons par téléphone ou WhatsApp pour confirmer la taille, le coloris, la quantité et la wilaya de livraison avant l'envoi. Tout changement de taille après confirmation est traité comme une nouvelle commande.",
      }),
    },
    {
      title: t({ ar: "الأسعار", fr: "Prix" }),
      body: t({
        ar: "الأسعار المعروضة بالدينار الجزائري لكل منتج ومقاس، وقد تتغير حسب توفّر القماش أوmodel. سعر تسليم الولاية يُحسب تلقائيًا في نموذج الطلب حسب الولاية ونوع التسليم (إلى المنزل أو إلى مكتب التوصيل).",
        fr: "Les prix affichés sont en dinars algériens, par produit et par taille, et peuvent évoluer selon la disponibilité des tissus. Les frais de livraison de la wilaya sont calculés automatiquement dans le formulaire selon la wilaya et le mode de livraison (à domicile ou en bureau).",
      }),
    },
    {
      title: t({ ar: "الدفع عند الاستلام", fr: "Paiement à la livraison" }),
      body: t({
        ar: "الدفع يتم عند الاستلام: تدفع للموزّع قيمة المنتج ومصاريف التسليم عند استلام الطرد. لا نطلب أي دفعة مقدمة ولا بيانات بطاقة.",
        fr: "Le paiement se fait à la réception : vous réglez au livreur le montant du produit et les frais de livraison à la remise du colis. Aucun acompte ni données bancaires ne sont demandés.",
      }),
    },
    {
      title: t({ ar: "التسليم", fr: "Livraison" }),
      body: t({
        ar: "نسلّم إلى 58 ولاية عبر خدمة توصيل. مدة التحضير والإرسال تعتمد على المقاسات المطلوبة ونبدأ التحضير بعد تأكيد الطلب. يبقى الطرد في مكتب التوصيل مدة محدودة، لذلك يجب الرد على اتصال الموزّع أو استلام الطرد خلال الآجال.",
        fr: "Nous livrons les 58 wilayas via un service de livraison. Le délai de préparation dépend des tailles commandées et démarre après confirmation. Le colis reste un temps limité au bureau de livraison : il faut répondre au livreur ou retirer le colis dans les délais.",
      }),
    },
    {
      title: t({ ar: "التركيب والزيارة المنزلية", fr: "Pose et visite à domicile" }),
      body: t({
        ar: "خدمة Visit المنزلية المجانية لتأخذ المقاسات لا تلزمك بالشراء. إذا طلبت التركيب، يتم الاتفاق على موعده ومبلغه قبل التدخل.",
        fr: "La visite à domicile gratuite pour la prise de mesures n'engage pas à l'achat. Si vous demandez la pose, son rendez-vous et son tarif sont convenus avant l'intervention.",
      }),
    },
    {
      title: t({ ar: "استخدام الموقع", fr: "Utilisation du site" }),
      body: t({
        ar: "يُمنع استعمال الموقع لأغراض غير قانونية أو إرسال طلبات كيدية أو متكررة بدون نية شراء. قد نوقف الطلبات التي تُعرقل خدمة بقية الزبائن.",
        fr: "Le site ne doit pas être utilisé à des fins illégales, ni faire l'objet de commandes fantaisies ou répétées sans intention d'achat. Nous pouvons bloquer les demandes qui perturbent le service des autres clients.",
      }),
    },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">{t({ ar: "شروط الاستخدام", fr: "Conditions d'utilisation" })}</h1>
        <p className="mt-3 text-muted-foreground">
          {t({ ar: "قواعد بسيطة تشرح كيف تطلب وتستلم. قراها مرة واحدة، وكل شيء واضح بعدها.", fr: "Des règles simples qui expliquent comment commander et recevoir. À lire une fois, tout est clair ensuite." })}
        </p>
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
        {email && (
          <p className="mt-8 text-sm text-muted-foreground">
            {t({ ar: "سؤال حول هذه الشروط؟ اكتب لنا إلى", fr: "Une question sur ces conditions ? Écrivez-nous à" })}{" "}
            <a href={`mailto:${email}`} className="font-semibold text-primary break-all">{email}</a>
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
