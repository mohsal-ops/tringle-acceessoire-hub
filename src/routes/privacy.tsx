import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLocale } from "@/lib/i18n";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Tringles Accessoires" },
      { name: "description", content: "Comment Tringles Accessoires collecte et utilise vos données : nom, téléphone, adresse, et mesure de trafic." },
      { property: "og:title", content: "Politique de confidentialité — Tringles Accessoires" },
      { property: "og:description", content: "Vos coordonnées servent uniquement à préparer et livrer votre commande. Elles ne sont ni revendues ni partagées." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useLocale();
  const { get } = useSettings();
  const email = get("contact_email");

  const sections = [
    {
      title: t({ ar: "البيانات التي نجمعها", fr: "Les données que nous collectons" }),
      body: t({
        ar: "عند الطلب نطلب الاسم، رقم الهاتف، الولاية والعنوان، وأحيانًا ملاحظة عن المقاس أو اللون. عند حجز زيارة منزلية نضيف التاريخ المفضّل وعدد النوافذ. لا نطلب رقم بطاقة ولا كلمة مرور لتمرير طلب.",
        fr: "Pour une commande, nous demandons le nom, le téléphone, la wilaya et l'adresse, parfois une note sur la taille ou le coloris. Pour une visite à domicile, s'ajoutent la date souhaitée et le nombre de fenêtres. Nous ne demandons ni carte bancaire ni mot de passe pour commander.",
      }),
    },
    {
      title: t({ ar: "كيف نستعملها", fr: "Comment nous les utilisons" }),
      body: t({
        ar: "تُستعمل بياناتك لتحضير الطلب، الاتصال بك لتأكيده، وتنظيم التسليم أو الزيارة. لا نبيعها ولا نشاركها مع أي طرف، والموزّع يستلم الاسم والهاتف والعنوان فقط لغرض التوصيل.",
        fr: "Vos données servent à préparer la commande, vous contacter pour la confirmer et organiser la livraison ou la visite. Nous ne les vendons et ne les partageons pas ; le livreur ne reçoit que nom, téléphone et adresse pour le transport.",
      }),
    },
    {
      title: t({ ar: "الرسائل والاتصال", fr: "Contacts et messages" }),
      body: t({
        ar: "نتواصل معك عبر الهاتف أو واتساب بخصوص طلبك فقط. إذا اخترت استشارة أو عرضًا، يمكنك طلب إيقاف الرسائل في أي وقت بالرد على نفس المحادثة.",
        fr: "Nous vous contactons par téléphone ou WhatsApp au sujet de votre demande uniquement. Si vous acceptez un suivi ou une offre, vous pouvez demander l'arrêt des messages à tout moment dans la même conversation.",
      }),
    },
    {
      title: t({ ar: "قياس زيارة الموقع", fr: "Mesure de fréquentation" }),
      body: t({
        ar: "قد نستعمل أدوات إحصائية لنعرف أي الصفحات تُشاهد أكثر وأي المنتجات تهمّ الزبائن. هذه البيانات مجمّعة ولا تُستعمل لبيع منتجات أخرى باسمك.",
        fr: "Nous pouvons utiliser des outils de mesure pour savoir quelles pages sont vues et quels produits intéressent les clients. Ces données sont agrégées et ne servent pas à vous vendre autre chose.",
      }),
    },
    {
      title: t({ ar: "حذف بياناتك", fr: "Demander la suppression" }),
      body: t({
        ar: "يمكنك طلب حذف معلوماتك أو تصحيحها بكتابة رسالة قصيرة إلى بريدنا. نحتفظ بسجل الطلب فقط عندما يظل الطلب مفتوحًا أو عندما يطلب ذلك القانون.",
        fr: "Vous pouvez demander la suppression ou la correction de vos informations par un simple e-mail. Nous ne conservons un dossier de commande que si elle reste en cours ou si la loi l'exige.",
      }),
    },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">{t({ ar: "سياسة الخصوصية", fr: "Politique de confidentialité" })}</h1>
        <p className="mt-3 text-muted-foreground">
          {t({ ar: "معلومتك عندنا بسيطة: الاسم والهاتف والعنوان، وتُستعمل لتوصيل طلبك فقط.", fr: "Chez nous, vos informations restent simples : nom, téléphone, adresse, et elles servent à livrer votre commande." })}
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
            {t({ ar: "طلب حذف أو تصحيح؟ اكتب إلى", fr: "Une suppression ou correction à demander ? Écrivez à" })}{" "}
            <a href={`mailto:${email}`} className="font-semibold text-primary break-all">{email}</a>
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
