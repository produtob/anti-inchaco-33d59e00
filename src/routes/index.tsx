import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Leaf, Droplets, Flower2, Check, Star, ShieldCheck, Lock, Clock,
  Sparkles, Heart, ArrowRight, Volume2, VolumeX, ChevronDown, X,
  Utensils, Activity, TrendingDown, AlertTriangle,
} from "lucide-react";

import ebookCover from "@/assets/ebook-cover.png.asset.json";
import vslVideo from "@/assets/vsl.mp4.asset.json";
import faceBA from "@/assets/face-before-after.jpg.asset.json";
import bodyTransform from "@/assets/body-transform.png.asset.json";
import illus1 from "@/assets/illus-1.png.asset.json";
import illus2 from "@/assets/illus-2.png.asset.json";
import illus3 from "@/assets/illus-3.png.asset.json";
import illus4 from "@/assets/illus-4.png.asset.json";
import censored from "@/assets/censored.png.asset.json";

const CHECKOUT_URL = "#oferta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Método Anti-Inchaço Feminino — Desinche em 14 dias | Programa Oficial" },
      { name: "description", content: "Protocolo completo para mulheres 35+ reduzirem inchaço abdominal, retenção de líquidos e recuperarem leveza em 14 dias. Mais de 12.000 mulheres impactadas." },
      { property: "og:title", content: "Método Anti-Inchaço Feminino — 14 dias para desinchar" },
      { property: "og:description", content: "O sistema definitivo para desinchar, recuperar a leveza e voltar a vestir suas roupas favoritas." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ebookCover.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ebookCover.url },
    ],
    links: [
      { rel: "preload", as: "image", href: ebookCover.url, fetchpriority: "high" } as any,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Método Anti-Inchaço Feminino",
          description: "Protocolo guiado de 14 dias para reduzir inchaço abdominal e retenção de líquidos.",
          image: ebookCover.url,
          brand: { "@type": "Brand", name: "Método Anti-Inchaço" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "12000" },
          offers: { "@type": "Offer", price: "39.90", priceCurrency: "BRL", availability: "https://schema.org/InStock" },
        }),
      },
    ],
  }),
  component: LandingPage,
});

/* ---------- Building blocks ---------- */

function Pill({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "gold" }) {
  const cls = tone === "gold"
    ? "bg-[oklch(0.97_0.04_85)] text-[oklch(0.45_0.1_75)] ring-1 ring-[var(--gold-soft)]"
    : "bg-primary-soft text-primary-deep ring-1 ring-[color-mix(in_oklab,var(--primary)_25%,transparent)]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${cls}`}>
      {children}
    </span>
  );
}

function CTA({ children, href = CHECKOUT_URL, pulse = true, sub }: { children: React.ReactNode; href?: string; pulse?: boolean; sub?: string }) {
  return (
    <div className="flex w-full flex-col items-center">
      <a
        href={href}
        className={`group relative flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-[var(--success)] px-6 py-4 text-center text-base font-bold text-white shadow-[var(--shadow-premium)] transition-transform active:scale-[0.98] sm:py-5 sm:text-lg ${pulse ? "cta-pulse" : ""}`}
      >
        <span className="leading-tight">{children}</span>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </a>
      {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
      ))}
    </div>
  );
}

/* ---------- VSL Player ---------- */

function VSLPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.then === "function") p.catch(() => {});
  }, []);

  const unmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setMuted(false);
    setStarted(true);
    setShowHint(false);
    v.play().catch(() => {
      setMuted(true);
      v.muted = true;
      setShowHint(true);
    });
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[var(--primary-soft)] via-transparent to-[var(--gold-soft)] opacity-60 blur-xl" />
      <div className="relative overflow-hidden rounded-2xl bg-black shadow-[var(--shadow-premium)] ring-1 ring-[color-mix(in_oklab,var(--primary)_20%,transparent)]">
        <div className="relative aspect-[9/16] sm:aspect-video">
          <video
            ref={videoRef}
            src={vslVideo.url}
            playsInline
            autoPlay
            loop
            muted
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            onClick={() => muted && unmute()}
          />

          {muted && (
            <button
              onClick={unmute}
              aria-label="Ativar som do vídeo"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px] transition hover:bg-black/40"
            >
              <div className="fade-up flex flex-col items-center gap-3 rounded-2xl bg-[oklch(0.98_0.01_30)] px-6 py-5 text-center shadow-2xl ring-1 ring-black/10">
                <div className="relative">
                  <div className="absolute inset-0 -m-2 animate-ping rounded-full bg-[var(--destructive)]/40" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-full bg-[var(--destructive)] text-white shadow-lg">
                    <VolumeX className="h-7 w-7" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[var(--destructive)]">Seu vídeo já começou</p>
                  <p className="mt-0.5 text-base font-extrabold text-foreground">Toque para ouvir o áudio</p>
                </div>
              </div>
            </button>
          )}

          {started && !muted && (
            <button
              onClick={() => { const v = videoRef.current; if (v) { v.muted = true; setMuted(true); } }}
              className="absolute bottom-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
              aria-label="Silenciar"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      {showHint && !muted && (
        <p className="mt-2 text-center text-xs text-muted-foreground">Se não houver áudio, toque novamente para ativar o som.</p>
      )}
    </div>
  );
}

/* ---------- Sticky CTA ---------- */

function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur md:px-4">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <div className="hidden flex-1 sm:block">
          <p className="text-xs font-semibold text-foreground">Método Anti-Inchaço Feminino</p>
          <p className="text-[11px] text-muted-foreground">De <span className="line-through">R$322</span> por <strong className="text-[var(--success)]">R$39,90</strong></p>
        </div>
        <a
          href={CHECKOUT_URL}
          className="cta-pulse flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--success)] px-4 py-3 text-sm font-bold text-white shadow-lg"
        >
          Quero desinchar agora <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */

const faqs = [
  { q: "Funciona para mulheres acima dos 40?", a: "Sim. O método foi desenhado especialmente para mulheres 35+, considerando alterações hormonais, metabolismo e retenção típica dessa fase." },
  { q: "Preciso ir à academia?", a: "Não. O protocolo é caseiro. Os rituais drenantes e os movimentos são simples e podem ser feitos em qualquer ambiente." },
  { q: "Preciso seguir uma dieta restritiva?", a: "Não. Você recebe um cardápio desinflamatório com substituições inteligentes, sem passar fome e sem cortar grupos alimentares essenciais." },
  { q: "Quanto tempo por dia eu preciso?", a: "Em média 10 a 15 minutos por dia para aplicar os rituais e organizar a rotina anti-inchaço." },
  { q: "Como recebo o material após a compra?", a: "O acesso é liberado imediatamente por e-mail, em qualquer celular, tablet ou computador. Acesso vitalício." },
  { q: "E se eu não tiver resultado?", a: "Você tem 7 dias de garantia incondicional. Se não sentir diferença, devolvemos 100% do valor sem perguntas." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-card shadow-[var(--shadow-soft)] ring-1 ring-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground sm:text-base">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  );
}

/* ---------- Page ---------- */

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-24 text-foreground">
      {/* Top trust bar */}
      <div className="bg-[var(--primary-deep)] text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 px-4 py-2 text-[11px] font-medium tracking-wide sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-[var(--gold-soft)]" />
          <span>+12.000 mulheres já transformaram a rotina com o método</span>
        </div>
      </div>

      {/* HERO */}
      <header className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_0%,oklch(0.95_0.05_145)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-3xl px-4 pt-6 sm:pt-10">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-wide text-primary-deep">MÉTODO ANTI-INCHAÇO FEMININO</span>
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 text-center">
            <Pill tone="gold">
              <Sparkles className="h-3 w-3" /> Programa oficial · 14 dias
            </Pill>
            <h1 className="text-balance text-3xl font-bold leading-[1.05] text-primary-deep sm:text-5xl">
              Sua barriga continua <em className="not-italic text-[var(--destructive)]">inchada</em> mesmo quando você tenta emagrecer?
            </h1>
            <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              Descubra o <strong className="text-foreground">Método Anti-Inchaço Feminino de 14 dias</strong> — o protocolo que reduz o inchaço, devolve a leveza e faz suas roupas favoritas voltarem a servir.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Stars /> <strong className="text-foreground">4,9</strong>/5</span>
              <span className="h-3 w-px bg-border" />
              <span><strong className="text-foreground">+12.000</strong> mulheres impactadas</span>
            </div>
          </div>

          {/* VSL */}
          <div className="mt-6 sm:mt-8">
            <VSLPlayer />
          </div>

          <div className="mt-6">
            <CTA sub="Acesso imediato · Pagamento 100% seguro">QUERO DESINCHAR EM 14 DIAS</CTA>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Compra segura</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> 7 dias de garantia</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Acesso imediato</span>
          </div>
        </div>
      </header>

      {/* DOR */}
      <section className="mx-auto mt-16 max-w-3xl px-4">
        <div className="text-center">
          <Pill><AlertTriangle className="h-3 w-3" /> Você se reconhece?</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Não é só uma fase. É o seu corpo pedindo ajuda.</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { i: <Droplets className="h-5 w-5" />, t: "Barriga inchada todos os dias", d: "Acorda bem e à tarde parece que engoliu uma bola." },
            { i: <X className="h-5 w-5" />, t: "Roupas apertando do nada", d: "Calças que serviam semana passada já marcam." },
            { i: <Activity className="h-5 w-5" />, t: "Retenção de líquidos constante", d: "Pernas pesadas, anel marcando, rosto inchado." },
            { i: <Heart className="h-5 w-5" />, t: "Autoestima abalada", d: "Evita espelho, foto e roupas mais ajustadas." },
            { i: <TrendingDown className="h-5 w-5" />, t: "Difícil emagrecer após os 35", d: "O que funcionava antes simplesmente parou." },
            { i: <Utensils className="h-5 w-5" />, t: "Intestino lento e desconforto", d: "Sensação de empachamento, gases e desânimo." },
          ].map((c) => (
            <div key={c.t} className="flex gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] ring-1 ring-border">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(0.96_0.04_30)] text-[var(--destructive)]">
                {c.i}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{c.t}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MECANISMO */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <Pill>O verdadeiro inimigo</Pill>
          <h2 className="mt-3 text-balance text-2xl font-bold text-primary-deep sm:text-4xl">
            O problema não é apenas gordura.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Estudos mostram que <strong className="text-foreground">retenção hídrica, inflamação silenciosa e intestino lento</strong> são os 3 gatilhos que mantêm o abdômen inchado — independente da balança.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { img: illus1.url, t: "Retenção hídrica", d: "Hormônios e sódio fazem o corpo segurar líquido nos tecidos." },
            { img: illus2.url, t: "Inflamação silenciosa", d: "Alimentos pró-inflamatórios mantêm o abdômen distendido." },
            { img: illus3.url, t: "Intestino lento", d: "Trânsito travado gera empachamento, gases e desconforto." },
          ].map((s) => (
            <div key={s.t} className="flex flex-col items-center rounded-2xl bg-card p-5 text-center shadow-[var(--shadow-soft)] ring-1 ring-border">
              <div className="grid h-32 w-32 place-items-center">
                <img src={s.img} alt={s.t} className="h-full w-full object-contain" loading="lazy" />
              </div>
              <h3 className="mt-2 text-base font-bold text-primary-deep">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MÉTODO 3 PASSOS */}
      <section className="mt-20 bg-gradient-to-b from-[oklch(0.97_0.02_140)] to-transparent py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <Pill tone="gold">O Método em 3 passos</Pill>
            <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Simples. Guiado. Em 14 dias.</h2>
          </div>

          <div className="mt-10 space-y-6">
            {[
              { n: "01", img: illus2.url, t: "Identifique os gatilhos", d: "Mapeie em 48h o que está inflamando o seu corpo: alimentos, hábitos e rotinas." },
              { n: "02", img: illus3.url, t: "Aplique o protocolo", d: "Cardápio desinflamatório, rituais drenantes e ajustes inteligentes no dia a dia." },
              { n: "03", img: illus4.url, t: "Sinta a transformação", d: "Menos inchaço, mais leveza, roupas voltando a servir e autoestima em alta." },
            ].map((s, idx) => (
              <div key={s.n} className={`flex flex-col items-center gap-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)] ring-1 ring-border sm:flex-row ${idx % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
                <div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)]">
                  <img src={s.img} alt={s.t} className="h-36 w-36 object-contain" loading="lazy" />
                  <span className="absolute -left-2 -top-2 grid h-10 w-10 place-items-center rounded-full bg-[var(--gold)] font-display text-base font-bold text-white shadow-[var(--shadow-gold)]">
                    {s.n}
                  </span>
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-primary-deep">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <CTA>QUERO COMEÇAR MEUS 14 DIAS</CTA>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mx-auto mt-16 max-w-3xl px-4">
        <div className="text-center">
          <Pill>Resultados reais</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">O que você vai sentir</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Menos inchaço abdominal já nos primeiros dias",
            "Sensação real de leveza ao longo do dia",
            "Mais disposição e energia da manhã à noite",
            "Digestão mais leve, sem peso após as refeições",
            "Intestino funcionando com regularidade",
            "Autoestima e confiança elevadas",
            "Roupas favoritas voltando a vestir",
            "Mais segurança ao se olhar no espelho",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-xl bg-card p-3 shadow-[var(--shadow-soft)] ring-1 ring-border">
              <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--success)] text-white">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROVA VISUAL */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <Pill tone="gold"><Sparkles className="h-3 w-3" /> Prova visual</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Quando o corpo desincha por dentro, o reflexo aparece por fora.</h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-premium)] ring-1 ring-border">
          <img src={faceBA.url} alt="Antes e depois — rosto desinchado" className="w-full" loading="lazy" />
          <div className="grid grid-cols-2 border-t border-border text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="border-r border-border py-2">Antes</div>
            <div className="py-2 text-[var(--success)]">Depois</div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-premium)] ring-1 ring-border">
          <div className="relative">
            <img src={bodyTransform.url} alt="Transformação corporal" className="w-full" loading="lazy" />
            <img
              src={censored.url}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] w-[55%] -translate-x-1/2 -rotate-6 select-none opacity-90"
            />
            <img
              src={censored.url}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[70%] w-[55%] -translate-x-1/2 rotate-3 select-none opacity-90"
            />
          </div>
          <div className="grid grid-cols-2 border-t border-border text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="border-r border-border py-2">Antes</div>
            <div className="py-2 text-[var(--success)]">Depois</div>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] italic text-muted-foreground">*Resultados podem variar conforme rotina, alimentação e organismo de cada mulher.</p>
      </section>

      {/* PROVA SOCIAL */}
      <section className="mt-20 bg-[var(--primary-deep)] py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Stars />
            <p className="text-5xl font-bold font-display">4,9</p>
            <p className="text-sm opacity-90">Avaliação média de mais de <strong>12.000 mulheres</strong></p>
          </div>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium ring-1 ring-white/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--gold)]" />
            </span>
            <strong>191 mulheres</strong> começaram o método nas últimas 24h
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="mx-auto mt-16 max-w-3xl px-4">
        <div className="text-center">
          <Pill>Histórias reais</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">O que dizem as mulheres do método</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { n: "Aline R.", age: 38, t: "Em 6 dias já notei diferença", d: "Minha barriga inchava todo fim de tarde. Comecei o protocolo na segunda e na sexta eu já consegui fechar a calça que estava guardada." },
            { n: "Patrícia M.", age: 42, t: "Sumiu o peso depois do almoço", d: "Eu vivia empachada. Hoje almoço bem, tomo água do jeito que o método ensina e me sinto leve a tarde inteira." },
            { n: "Cláudia S.", age: 45, t: "O intestino voltou a funcionar", d: "Era de 3 em 3 dias, com muito desconforto. Em duas semanas virou rotina diária, sem forçar nada." },
            { n: "Renata L.", age: 47, t: "Voltei a vestir meu jeans", d: "Estava parado no armário há quase um ano. Não é mágica, é seguir o passo a passo. Recomendo demais." },
            { n: "Sandra T.", age: 51, t: "Mais energia que aos 40", d: "Achei que era idade, era inflamação. Reduzi inchaço, perdi medidas e minha disposição mudou completamente." },
            { n: "Juliana B.", age: 39, t: "Foto sem prender a barriga", d: "Pela primeira vez em anos tirei foto na praia sem segurar. Confiança não tem preço." },
            { n: "Mariana C.", age: 44, t: "Saí da menopausa inchada", d: "Tudo o que eu comia parecia inflamar. O cardápio desinflamatório foi o que finalmente funcionou pra mim." },
            { n: "Beatriz N.", age: 36, t: "Drenagem que faz diferença", d: "Os rituais são simples e rápidos. Em poucos dias o rosto desinchou e a barriga deu uma baixada visível." },
          ].map((t) => (
            <div key={t.n} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] ring-1 ring-border">
              <Stars />
              <p className="mt-2 text-sm font-bold text-primary-deep">"{t.t}"</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.d}</p>
              <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-primary-deep">
                  {t.n.charAt(0)}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">{t.n}</p>
                  <p className="text-muted-foreground">{t.age} anos · Compra verificada</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ERROS */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <Pill><AlertTriangle className="h-3 w-3" /> Atenção</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Por que tantas mulheres não conseguem desinchar?</h2>
        </div>

        <div className="mt-8 space-y-3">
          {[
            { t: "Cortar comida demais", d: "Restrição extrema reduz metabolismo e o corpo segura ainda mais líquido como defesa." },
            { t: "Seguir receitas aleatórias da internet", d: "Sem estratégia, sem sequência, sem mecanismo. O corpo não responde a tentativa e erro." },
            { t: "Ignorar a retenção de líquidos", d: "A maior parte do inchaço abdominal não é gordura. É líquido + inflamação travados há meses." },
          ].map((e, i) => (
            <div key={e.t} className="flex gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] ring-1 ring-border">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(0.96_0.04_30)] font-display text-base font-bold text-[var(--destructive)]">
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{e.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[var(--primary-soft)] p-4 text-center text-sm font-medium text-primary-deep ring-1 ring-[color-mix(in_oklab,var(--primary)_25%,transparent)]">
          O Método Anti-Inchaço Feminino corrige os 3 erros com um protocolo guiado, dia a dia.
        </div>
      </section>

      {/* OFERTA */}
      <section id="oferta" className="mt-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Pill tone="gold"><Sparkles className="h-3 w-3" /> Oferta especial de lançamento</Pill>
            <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Tudo o que você recebe hoje</h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.98_0.015_140)] to-card shadow-[var(--shadow-premium)] ring-1 ring-[color-mix(in_oklab,var(--gold)_30%,transparent)]">
            <div className="grid gap-6 p-5 sm:grid-cols-[260px_1fr] sm:p-8">
              {/* Cover */}
              <div className="relative mx-auto w-full max-w-[240px]">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--gold-soft)] via-transparent to-[var(--primary-soft)] blur-2xl" />
                <div className="relative rotate-[-3deg] overflow-hidden rounded-2xl shadow-[var(--shadow-premium)] ring-1 ring-black/10 transition-transform hover:rotate-0">
                  <img src={ebookCover.url} alt="Capa do Método Anti-Inchaço Feminino" className="block w-full" />
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-display text-xl font-bold text-primary-deep sm:text-2xl">Método Anti-Inchaço Feminino</h3>
                <p className="mt-1 text-sm text-muted-foreground">Programa completo guiado de 14 dias + 5 bônus exclusivos</p>

                <ul className="mt-4 space-y-2.5">
                  {[
                    { t: "Método Anti-Inchaço Feminino (14 dias)", v: "R$ 97" },
                    { t: "Cardápio Desinflamatório completo", v: "R$ 47" },
                    { t: "Guia do Intestino Funcional", v: "R$ 47" },
                    { t: "Ritual Drenante (passo a passo)", v: "R$ 47" },
                    { t: "Receitas Anti-Inchaço", v: "R$ 47" },
                    { t: "Lista de Compras Inteligente", v: "R$ 37" },
                  ].map((i) => (
                    <li key={i.t} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--success)] text-white">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="flex-1 text-foreground">{i.t}</span>
                      <span className="shrink-0 text-xs font-semibold text-muted-foreground">{i.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price block */}
            <div className="border-t border-border bg-[var(--primary-deep)] px-5 py-6 text-center text-white sm:px-8">
              <p className="text-xs uppercase tracking-widest opacity-80">Valor total</p>
              <p className="mt-1 text-lg font-medium line-through opacity-70">R$ 322,00</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold-soft)]">Hoje, por apenas</p>
              <div className="mt-1 flex items-end justify-center gap-2">
                <span className="font-display text-2xl">R$</span>
                <span className="font-display text-6xl font-bold leading-none">39<span className="text-3xl">,90</span></span>
              </div>
              <p className="mt-2 text-xs opacity-90">ou 4x de R$ 11,07 no cartão</p>

              <div className="mt-6">
                <CTA sub="🔒 Pagamento 100% seguro · Acesso imediato">QUERO ACESSO IMEDIATO</CTA>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] opacity-90">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> 7 dias de garantia</span>
                <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Ambiente protegido</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Liberação imediata</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="mx-auto mt-16 max-w-3xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-[var(--shadow-premium)] ring-1 ring-border sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold)] shadow-[var(--shadow-gold)]">
              <ShieldCheck className="h-14 w-14 text-white" />
              <span className="absolute -bottom-1 rounded-full bg-[var(--primary-deep)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">7 dias</span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-primary-deep">Garantia incondicional de 7 dias</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Aplique o método por 7 dias. Se você não sentir <strong>menos inchaço, mais leveza e roupas servindo melhor</strong>, é só enviar um e-mail e devolvemos 100% do seu investimento. Sem perguntas. O risco é todo nosso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-3xl px-4">
        <div className="text-center">
          <Pill>Perguntas frequentes</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Ainda com dúvidas?</h2>
        </div>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-16 px-4">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-[var(--primary-deep)] to-[var(--primary)] p-6 text-center text-white shadow-[var(--shadow-premium)] sm:p-10">
          <Flower2 className="mx-auto h-10 w-10 text-[var(--gold-soft)]" />
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">Sua versão mais leve está a 14 dias de distância.</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm opacity-90 sm:text-base">
            Comece hoje. Sinta a diferença na primeira semana. Volte a vestir o que ama.
          </p>
          <div className="mt-6">
            <CTA sub="Acesso imediato após a confirmação do pagamento">COMEÇAR MEU MÉTODO AGORA</CTA>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto mt-16 max-w-3xl px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-primary-deep">
          <Leaf className="h-4 w-4" />
          <span className="text-sm font-semibold">Método Anti-Inchaço Feminino</span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Este produto não substitui acompanhamento médico, nutricional ou tratamento profissional. Resultados podem variar de pessoa para pessoa.
          Em caso de gestação, doenças preexistentes ou uso contínuo de medicamentos, consulte seu médico antes de iniciar qualquer protocolo.
        </p>
        <p className="mt-3 text-[11px] text-muted-foreground">© {new Date().getFullYear()} Método Anti-Inchaço Feminino. Todos os direitos reservados.</p>
      </footer>

      <StickyCTA />
    </div>
  );
}
