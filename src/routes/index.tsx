import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Hammer, Home as HomeIcon, Palette, MessageCircle, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { useSettings } from "@/hooks/useSettings";

const DEFAULT_HERO_IMAGES = [
  "/hero-0.webp",
  "/hero-1.webp",
  "/hero-2.webp",
  "/hero-3.webp",
  "/hero-4.webp",
];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tringles Accessoires — ترينقلز أكسسوار | ستائر وديكور في الجزائر" },
      {
        name: "description",
        content:
          "تشكيلة واسعة من الستائر، السكك والإكسسوارات. زيارة منزلية مجانية وتركيب احترافي في جميع ولايات الجزائر.",
      },
      { property: "og:title", content: "Tringles Accessoires — ستائر وديكور في الجزائر" },
      { property: "og:description", content: "زيارة منزلية مجانية وتركيب احترافي." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, locale } = useLocale();
  const { get } = useSettings();

  const heroTitle = locale === "ar" ? get("hero_title_ar", "زيّن دارك يزيانو حوالك") : get("hero_title_fr", "Habillez votre maison, sublimez votre quotidien");
  const heroSubtitle = locale === "ar"
    ? get("hero_subtitle_ar", "ستائر، سكك و إكسسوارات فاخرة — قياس مجاني، تركيب احترافي في جميع ولايات الجزائر.")
    : get("hero_subtitle_fr", "Rideaux, tringles et accessoires — mesure gratuite et pose pro dans toute l'Algérie.");

  const waRaw = get("whatsapp_number", "+213561238016").replace(/\D/g, "");
  const waHref = `https://wa.me/${waRaw}?text=${encodeURIComponent(
    locale === "ar"
      ? "مرحبا، نحتاج استشارة حول الستائر والسكك والأسعار"
      : "Bonjour, j'aimerais une consultation sur vos rideaux et tringles",
  )}`;

  const heroImages = useMemo(() => {
    const raw = get("hero_images") || get("hero_image_url") || "";
    const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
    return list.length ? list : DEFAULT_HERO_IMAGES;
  }, [get]);

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (heroImages.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 3000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const featured = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,slug,name_ar,name_fr,sizes,price,original_price,has_variants,created_at,categories(name_ar,name_fr),product_images(url,sort_order),product_variants(label,price,original_price,sort_order)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order")
        .limit(6);
      if (error) throw error;
      return (data ?? []).map((p) => ({
        ...p,
        category: p.categories,
        product_images: p.product_images,
      }));
    },
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate min-h-[70vh] md:min-h-[85vh] overflow-hidden">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${i === slide ? "opacity-100" : "opacity-0"}`}
            width={1920}
            height={1080}
          />
        ))}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/55 to-black/75" />
        <div className="relative mx-auto flex min-h-[70vh] md:min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center text-white">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-medium text-white ring-1 ring-white/25">
            <Ruler className="h-3.5 w-3.5" />
            {t({ ar: "قياس مجاني • تركيب احترافي • ضمان الجودة", fr: "Mesure gratuite • Pose pro • Qualité garantie" })}
          </span>
          <h1
            className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-2xl"
            style={{ fontFamily: locale === "ar" ? '"Noto Sans Arabic", sans-serif' : undefined }}
          >
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="mt-6 max-w-2xl text-base md:text-xl text-white/90 leading-relaxed">{heroSubtitle}</p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="group relative h-14 w-full sm:w-auto px-8 text-base md:text-lg font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-2xl ring-4 ring-[#25D366]/30 hover:ring-[#25D366]/50 transition-all hover:scale-105"
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t({ ar: "استشرنا واطلب عبر واتساب", fr: "Commander sur WhatsApp" })}
                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 w-full sm:w-auto px-6 bg-transparent text-white border-white/80 hover:bg-white hover:text-primary">
              <Link to="/products">{t({ ar: "تصفح المنتجات والأسعار", fr: "Voir les produits & prix" })}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-14 w-full sm:w-auto px-4 text-white hover:bg-white/10">
              <a href="#book" className="inline-flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                {t({ ar: "زيارة منزلية مجانية", fr: "Visite gratuite" })}
              </a>
            </Button>
          </div>
        </div>
          {heroImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === slide ? "w-8 bg-primary" : "w-2 bg-white/60"}`}
                />
              ))}
            </div>
          )}
      </section>


      {/* FEATURES */}
      <section className="mx-auto -mt-12 max-w-6xl px-4 relative z-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: HomeIcon, title: t({ ar: "زيارة منزلية مجانية", fr: "Visite à domicile gratuite" }),
              sub: t({ ar: "في جميع ولايات الجزائر", fr: "Dans toutes les wilayas" }) },
            { icon: Palette, title: t({ ar: "تشكيلة واسعة", fr: "Large choix de tissus" }),
              sub: t({ ar: "أجود الأقمشة والألوان", fr: "Qualité et couleurs variées" }) },
            { icon: Hammer, title: t({ ar: "تركيب احترافي", fr: "Installation pro" }),
              sub: t({ ar: "بأيدي فنيين متخصصين", fr: "Par des techniciens qualifiés" }) },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-light text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA BANNER — decision-oriented */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#128C7E] via-[#25D366] to-[#25D366] p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -start-10 -bottom-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
                <MessageCircle className="h-3.5 w-3.5" />
                {t({ ar: "استشارة مجانية فورية", fr: "Conseil gratuit et immédiat" })}
              </div>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold leading-tight">
                {t({
                  ar: "محتار في المقاس أو النموذج؟ راسلنا الآن على واتساب",
                  fr: "Une question sur les mesures ou les modèles ? Écrivez-nous sur WhatsApp",
                })}
              </h2>
              <p className="mt-2 text-white/90 md:text-lg">
                {t({
                  ar: "نساعدك تختار الأنسب لدارك — أسعار، مقاسات، ألوان و توصيات — بدون أي التزام.",
                  fr: "On vous aide à choisir ce qui convient à votre intérieur — prix, mesures, couleurs, conseils — sans engagement.",
                })}
              </p>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white text-[#128C7E] px-8 py-4 text-lg font-extrabold shadow-xl hover:scale-105 transition-transform whitespace-nowrap"
            >
              <MessageCircle className="h-6 w-6" />
              {t({ ar: "تواصل الآن", fr: "Discuter maintenant" })}
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-20">

        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t({ ar: "منتجاتنا المميزة", fr: "Nos produits vedettes" })}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t({ ar: "اختيارات مختارة بعناية لكل ذوق", fr: "Une sélection soignée pour chaque style" })}
          </p>
        </div>

        {featured.isLoading ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (featured.data ?? []).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            {t({ ar: "لا توجد منتجات مميزة حالياً", fr: "Aucun produit vedette pour le moment" })}
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3">
            {featured.data!.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/products">
              {t({ ar: "عرض جميع المنتجات", fr: "Voir tous les produits" })} →
            </Link>
          </Button>
        </div>
      </section>

      {/* APPOINTMENT */}
      <section id="book" className="bg-gradient-to-b from-primary-light/50 to-background py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t({ ar: "احجز زيارة منزلية", fr: "Réservez une visite à domicile" })}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t({
                ar: "ملاحظة: تكلفة التنقل 3,000 دج تُخصم من الفاتورة النهائية عند الشراء.",
                fr: "Frais de déplacement 3 000 DA, déduits de la facture finale en cas d'achat.",
              })}
            </p>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </SiteLayout>
  );
}
