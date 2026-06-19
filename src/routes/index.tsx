import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Leaf, Droplets, Flower2, Check, Star, ShieldCheck, Lock, Clock,
  Sparkles, Heart, ArrowRight, Volume2, VolumeX, ChevronDown, X,
  Utensils, Activity, TrendingDown, AlertTriangle, MessageCircle, Gift,
  Mail,
} from "lucide-react";

import ebookCover from "@/assets/ebook-cover.png.asset.json";
import vslVideo from "@/assets/vsl.mp4.asset.json";
import faceBA from "@/assets/face-before-after.jpg.asset.json";
import bodyTransform from "@/assets/body-transform.png.asset.json";
import illus1 from "@/assets/illus-1.png.asset.json";
import illus2 from "@/assets/illus-2.png.asset.json";
import illus3 from "@/assets/illus-3.png.asset.json";
import illus4 from "@/assets/illus-4.png.asset.json";
import { trackEvent } from "@/lib/meta-pixel";

const CHECKOUT_URL = "https://pay.cakto.com.br/3a9ynm4_396700";

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
  const handleClick = () => {
    trackEvent("AddToCart", { content_name: "Método Anti-Inchaço Feminino", currency: "BRL", value: 39.90 });
    trackEvent("InitiateCheckout", { content_name: "Método Anti-Inchaço Feminino", currency: "BRL", value: 39.90, num_items: 1 });
  };
  return (
    <div className="flex w-full flex-col items-center">
      <a
        href={href}
        onClick={handleClick}
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
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={vslVideo.url}
            playsInline
            autoPlay
            loop
            muted
            preload="metadata"
            width={1920}
            height={1080}
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
          <p className="text-xs font-semibold text-foreground">Sistema Feminino 14D™</p>
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

/* ---------- Quiz Popup (lead capture) ---------- */

const QUIZ_KEY = "mai_quiz_seen_v1";
const QUIZ_QUESTIONS = [
  {
    q: "Em que momento do dia você sente MAIS inchaço?",
    options: [
      { v: "tarde", t: "Da tarde em diante", tag: "retencao" },
      { v: "refeicao", t: "Logo após as refeições", tag: "inflamacao" },
      { v: "manha", t: "Acordo já estufada", tag: "intestino" },
    ],
  },
  {
    q: "O que você sente com mais frequência?",
    options: [
      { v: "pernas", t: "Pernas pesadas / anel marcando", tag: "retencao" },
      { v: "gases", t: "Gases e empachamento", tag: "inflamacao" },
      { v: "preso", t: "Intestino preso ou irregular", tag: "intestino" },
    ],
  },
  {
    q: "Sua roupa aperta mais quando?",
    options: [
      { v: "tpm", t: "Perto do ciclo / TPM", tag: "retencao" },
      { v: "comer", t: "Depois de comer", tag: "inflamacao" },
      { v: "sempre", t: "Quase todo dia", tag: "intestino" },
    ],
  },
];

const QUIZ_RESULTS: Record<string, { title: string; desc: string }> = {
  retencao: {
    title: "Tipo 1 — Inchaço por Retenção Hídrica",
    desc: "Seu corpo está segurando líquido nos tecidos. O Protocolo 14D™ age direto na drenagem e no equilíbrio hormonal feminino.",
  },
  inflamacao: {
    title: "Tipo 2 — Inchaço Inflamatório",
    desc: "Alimentos pró-inflamatórios estão mantendo seu abdômen distendido. O cardápio desinflamatório do Sistema 14D™ corrige isso.",
  },
  intestino: {
    title: "Tipo 3 — Inchaço por Intestino Lento",
    desc: "Seu trânsito intestinal está travado. O Guia do Intestino Funcional do Sistema 14D™ destrava em poucos dias.",
  },
};

function QuizPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(QUIZ_KEY)) return;
    const t = setTimeout(() => setOpen(true), 22000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(QUIZ_KEY)) setOpen(true);
    };
    document.addEventListener("mouseleave", onLeave);
    return () => { clearTimeout(t); document.removeEventListener("mouseleave", onLeave); };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      try { trackEvent("ViewContent", { content_name: "Quiz Anti-Inchaço" }); } catch {}
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => {
    sessionStorage.setItem(QUIZ_KEY, "1");
    setOpen(false);
  };

  const pick = (tag: string) => {
    const next = [...tags, tag];
    setTags(next);
    if (step < QUIZ_QUESTIONS.length - 1) setStep(step + 1);
    else setStep(QUIZ_QUESTIONS.length); // move to capture
  };

  const dominant = (() => {
    const c: Record<string, number> = {};
    tags.forEach((t) => (c[t] = (c[t] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || "retencao";
  })();

  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      setPhoneErr("Digite um WhatsApp válido com DDD.");
      return;
    }
    setPhoneErr("");
    try {
      localStorage.setItem("mai_lead", JSON.stringify({ phone: digits, type: dominant, ts: Date.now() }));
      trackEvent("Lead", { content_name: "Quiz Anti-Inchaço", content_category: dominant });
    } catch {}
    sessionStorage.setItem(QUIZ_KEY, "1");
    setDone(true);
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  if (!open) return null;

  const result = QUIZ_RESULTS[dominant];
  const totalSteps = QUIZ_QUESTIONS.length + 1;
  const currentStep = Math.min(step, QUIZ_QUESTIONS.length);
  const progress = done ? 100 : ((currentStep) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 px-3 pb-3 pt-6 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-premium)] ring-1 ring-border">
        <button
          onClick={close}
          aria-label="Fechar"
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-muted-foreground ring-1 ring-border hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-1 w-full bg-border">
          <div className="h-full bg-[var(--success)] transition-all" style={{ width: `${progress}%` }} />
        </div>

        {!done && step < QUIZ_QUESTIONS.length && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-center gap-1.5">
              <Pill tone="gold"><Gift className="h-3 w-3" /> Teste gratuito · 60 segundos</Pill>
            </div>
            <h3 className="mt-3 text-center font-display text-lg font-bold leading-tight text-primary-deep sm:text-xl">
              Descubra qual dos <span className="text-[var(--destructive)]">3 tipos de inchaço</span> está afetando você
            </h3>
            <p className="mt-1 text-center text-xs text-muted-foreground">Pergunta {step + 1} de {QUIZ_QUESTIONS.length}</p>

            <p className="mt-4 text-sm font-semibold text-foreground sm:text-base">{QUIZ_QUESTIONS[step].q}</p>
            <div className="mt-3 space-y-2">
              {QUIZ_QUESTIONS[step].options.map((o) => (
                <button
                  key={o.v}
                  onClick={() => pick(o.tag)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition active:scale-[0.99] hover:border-primary hover:bg-[var(--primary-soft)]"
                >
                  <span>{o.t}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && step >= QUIZ_QUESTIONS.length && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-center">
              <Pill><MessageCircle className="h-3 w-3" /> Último passo</Pill>
            </div>
            <h3 className="mt-3 text-center font-display text-lg font-bold leading-tight text-primary-deep sm:text-xl">
              Pronto! Identificamos seu tipo de inchaço.
            </h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Digite seu WhatsApp para receber o <strong className="text-foreground">resultado personalizado</strong> + uma <strong className="text-[var(--success)]">condição especial</strong> do Sistema 14D™.
            </p>
            <form onSubmit={submitPhone} className="mt-4 space-y-3">
              <div>
                <label htmlFor="wa" className="text-xs font-semibold text-foreground">Seu WhatsApp (com DDD)</label>
                <input
                  id="wa"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="mt-1 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base font-medium text-foreground outline-none ring-0 focus:border-primary"
                  maxLength={16}
                  required
                />
                {phoneErr && <p className="mt-1 text-xs text-[var(--destructive)]">{phoneErr}</p>}
              </div>
              <button
                type="submit"
                className="cta-pulse flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--success)] px-5 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-premium)]"
              >
                Ver meu resultado <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[10px] text-muted-foreground">Seus dados estão seguros · Sem spam</p>
            </form>
          </div>
        )}

        {done && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-center">
              <Pill tone="gold"><Sparkles className="h-3 w-3" /> Resultado pronto</Pill>
            </div>
            <h3 className="mt-3 text-center font-display text-xl font-bold leading-tight text-primary-deep">
              {result.title}
            </h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{result.desc}</p>
            <div className="mt-4 rounded-xl bg-[var(--primary-soft)] p-3 text-center text-xs text-primary-deep ring-1 ring-[color-mix(in_oklab,var(--primary)_25%,transparent)]">
              👉 Aplicar o protocolo agora com <strong>50% OFF</strong> — apenas <strong className="text-[var(--success)]">R$ 39,90</strong>
            </div>
            <a
              href={CHECKOUT_URL}
              onClick={() => {
                trackEvent("AddToCart", { content_name: "Método Anti-Inchaço Feminino", currency: "BRL", value: 39.90 });
                trackEvent("InitiateCheckout", { content_name: "Método Anti-Inchaço Feminino", currency: "BRL", value: 39.90, num_items: 1 });
              }}
              className="cta-pulse mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--success)] px-5 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-premium)]"
            >
              Quero começar meu protocolo <ArrowRight className="h-4 w-4" />
            </a>
            <button onClick={close} className="mt-2 w-full text-center text-[11px] text-muted-foreground underline">
              Continuar lendo a página
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function LandingPage() {
  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: "Método Anti-Inchaço Feminino",
      content_category: "Ebook / Programa",
      content_ids: ["metodo-anti-inchaco-feminino"],
      content_type: "product",
      currency: "BRL",
      value: 39.90,
    });
  }, []);
  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-24 text-foreground">
      {/* URGENCY BANNER (sticky) */}
      <div className="sticky top-0 z-30 bg-[var(--destructive)] text-white shadow-md">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 px-3 py-1.5 text-center text-[10.5px] font-semibold leading-tight tracking-wide sm:text-xs">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span><strong>191 mulheres</strong> iniciaram hoje · últimas vagas promocionais</span>
        </div>
      </div>

      {/* Top trust bar */}
      <div className="bg-[var(--primary-deep)] text-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-[11px] font-medium tracking-wide sm:text-xs">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" /> <strong>4,9/5</strong></span>
          <span className="hidden h-3 w-px bg-white/30 sm:inline-block" />
          <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-[var(--gold-soft)]" /> <strong>+12.000</strong> mulheres no protocolo</span>
          <span className="hidden h-3 w-px bg-white/30 sm:inline-block" />
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[var(--gold-soft)]" /> Garantia 7 dias</span>
          <span className="hidden h-3 w-px bg-white/30 sm:inline-block" />
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[var(--gold-soft)]" /> Acesso imediato</span>
        </div>
      </div>

      <main id="main">
      {/* HERO */}
      <header className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_0%,oklch(0.95_0.05_145)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-3xl px-4 pt-6 sm:pt-10">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-wide text-primary-deep">SISTEMA FEMININO 14D™</span>
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 text-center">
            <Pill tone="gold">
              <Sparkles className="h-3 w-3" /> Protocolo Feminino de Reequilíbrio Corporal · 14 dias guiados
            </Pill>
            <h1 className="text-balance text-3xl font-bold leading-[1.05] text-primary-deep sm:text-5xl">
              Você pode estar carregando <em className="not-italic text-[var(--destructive)]">anos de retenção, inflamação e desconforto</em> sem perceber.
            </h1>
            <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              Existe um <strong className="text-foreground">protocolo feminino de 14 dias</strong> criado para ajudar seu corpo a voltar ao estado de leveza natural — agindo nos 3 fatores reais do inchaço: <strong className="text-foreground">retenção, inflamação silenciosa e intestino lento</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Stars /> <strong className="text-foreground">4,9</strong>/5</span>
              <span className="h-3 w-px bg-border" />
              <span><strong className="text-foreground">+12.000</strong> mulheres no protocolo 14D™</span>
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

      {/* IDENTIFICAÇÃO */}
      <section className="mx-auto mt-16 max-w-3xl px-4">
        <div className="rounded-3xl bg-[var(--primary-soft)] p-6 text-center shadow-[var(--shadow-soft)] ring-1 ring-[color-mix(in_oklab,var(--primary)_18%,transparent)] sm:p-8">
          <Pill><Heart className="h-3 w-3" /> Você não está sozinha</Pill>
          <h2 className="mt-3 font-display text-2xl font-bold text-primary-deep sm:text-3xl">
            Você não é a única que passa por isso.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            Milhares de mulheres convivem diariamente com <strong className="text-foreground">barriga estufada, retenção de líquidos e desconforto</strong> sem entender a verdadeira causa — e sem nenhum método feminino real para corrigir.
          </p>
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

      {/* DIFERENCIAL */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <Pill tone="gold"><Sparkles className="h-3 w-3" /> Mecanismo único</Pill>
          <h2 className="mt-3 text-balance text-2xl font-bold text-primary-deep sm:text-4xl">Por que este método é diferente?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            É um protocolo focado nos <strong className="text-foreground">3 fatores reais ligados ao inchaço feminino</strong>. Nada de promessa milagrosa.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            "Dieta extrema",
            "Jejum radical",
            "Chá milagroso",
            "Remédio diurético",
            "Solução temporária",
            "Treino exaustivo",
          ].map((n) => (
            <div key={n} className="flex items-center gap-2 rounded-xl bg-card p-3 text-sm shadow-[var(--shadow-soft)] ring-1 ring-border">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[oklch(0.96_0.04_30)] text-[var(--destructive)]">
                <X className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-foreground">Não é {n.toLowerCase()}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-[var(--primary-deep)] p-5 text-center text-white shadow-[var(--shadow-premium)]">
          <p className="text-sm leading-relaxed sm:text-base">
            É um <strong className="text-[var(--gold-soft)]">protocolo guiado dia a dia</strong>, criado para o corpo feminino, que age na retenção, na inflamação e no intestino — os 3 fatores que realmente mantêm a barriga estufada.
          </p>
        </div>
        <div className="mt-6 text-center">
          <a href={CHECKOUT_URL} onClick={() => { trackEvent("AddToCart", { content_name: "Método Anti-Inchaço Feminino", currency: "BRL", value: 39.90 }); }} className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--success)] underline-offset-4 hover:underline">
            👉 Quero aplicar o protocolo <ArrowRight className="h-4 w-4" />
          </a>
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

      {/* IMAGINE */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary-soft)] via-card to-[oklch(0.97_0.04_85)] p-6 shadow-[var(--shadow-premium)] ring-1 ring-border sm:p-10">
          <div className="text-center">
            <Pill tone="gold"><Heart className="h-3 w-3" /> A sua nova rotina</Pill>
            <h2 className="mt-3 font-display text-2xl font-bold text-primary-deep sm:text-4xl">
              Imagine acordar e sentir…
            </h2>
          </div>
          <ul className="mx-auto mt-6 max-w-xl space-y-2.5">
            {[
              "A barriga mais leve já ao se levantar",
              "A roupa fechando sem aquele esforço de prender o ar",
              "Menos desconforto e peso depois das refeições",
              "Mais confiança para sair, marcar reunião, encontrar amigas",
              "Mais segurança nas fotos — sem se esconder atrás de ninguém",
              "Voltar a gostar do que vê quando passa em frente ao espelho",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl bg-card/70 p-3 backdrop-blur ring-1 ring-border">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
                <span className="text-sm font-medium text-foreground sm:text-base">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <a href={CHECKOUT_URL} onClick={() => { trackEvent("AddToCart", { content_name: "Método Anti-Inchaço Feminino", currency: "BRL", value: 39.90 }); }} className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--success)] underline-offset-4 hover:underline">
              👉 Quero sentir essa diferença <ArrowRight className="h-4 w-4" />
            </a>
          </div>
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
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed opacity-90 sm:text-base">
            Mais de <strong className="text-[var(--gold-soft)]">12.000 mulheres</strong> já iniciaram o protocolo 14D™ e registraram melhorias em:
          </p>
          <div className="mx-auto mt-4 grid max-w-xl grid-cols-2 gap-2 text-left text-xs sm:grid-cols-5 sm:text-[11px]">
            {["Retenção", "Digestão", "Conforto abdominal", "Sensação de leveza", "Autoestima"].map((b) => (
              <div key={b} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                <Check className="h-3.5 w-3.5 text-[var(--gold-soft)]" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium ring-1 ring-white/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--gold)]" />
            </span>
            <strong>191 mulheres</strong> começaram o protocolo nas últimas 24h
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

      {/* PARA QUEM */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <Pill>Indicado para</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">Para quem este método foi criado?</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Mulheres acima dos 35 anos",
            "Mulheres que acordam bem e terminam o dia inchadas",
            "Mulheres com retenção de líquidos constante",
            "Mulheres que já tentaram dietas e não obtiveram resultado",
            "Mulheres que querem voltar a vestir suas roupas favoritas",
            "Mulheres que querem se sentir leves e confiantes de novo",
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

      {/* OBJEÇÕES */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <Pill><Heart className="h-3 w-3" /> Talvez você esteja pensando…</Pill>
          <h2 className="mt-3 text-2xl font-bold text-primary-deep sm:text-4xl">As 3 dúvidas mais comuns antes de começar</h2>
        </div>
        <div className="mt-8 space-y-3">
          {[
            { q: "“Já tentei de tudo.”", a: "Perfeito. A maioria das mulheres que entra no protocolo 14D™ também dizia isso — e foi exatamente por isso que finalmente funcionou. O problema nunca foi você, foi a abordagem." },
            { q: "“Não tenho tempo.”", a: "O protocolo leva poucos minutos por dia. Foi desenhado para mulheres ocupadas, com rotina pesada, filhos, casa e trabalho." },
            { q: "“Tenho mais de 40 anos.”", a: "Grande parte das participantes tem entre 40 e 55 anos. O método foi criado considerando alterações hormonais, metabolismo mais lento e retenção típica dessa fase." },
          ].map((e) => (
            <div key={e.q} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] ring-1 ring-border">
              <p className="text-sm font-bold text-primary-deep sm:text-base">{e.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OFERTA */}
      <section id="oferta" className="mt-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Pill tone="gold"><Sparkles className="h-3 w-3" /> Sistema 14D™ · Liberação imediata</Pill>
            <h2 className="mt-3 text-balance text-2xl font-bold text-primary-deep sm:text-4xl">Protocolo Feminino de Reequilíbrio Corporal 14D™</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Você não está adquirindo apenas um ebook. Está entrando em um <strong className="text-foreground">sistema feminino completo, guiado dia a dia</strong>, criado para reorganizar seu corpo em 14 dias — agindo na retenção, na inflamação e no intestino.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.98_0.015_140)] to-card shadow-[var(--shadow-premium)] ring-1 ring-[color-mix(in_oklab,var(--gold)_30%,transparent)]">
            <div className="grid gap-6 p-5 sm:grid-cols-[260px_1fr] sm:p-8">
              {/* Cover */}
              <div className="relative mx-auto w-full max-w-[240px]">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--gold-soft)] via-transparent to-[var(--primary-soft)] blur-2xl" />
                <div className="relative rotate-[-3deg] overflow-hidden rounded-2xl shadow-[var(--shadow-premium)] ring-1 ring-black/10 transition-transform hover:rotate-0">
                  <img src={ebookCover.url} alt="Capa do Método Anti-Inchaço Feminino" className="block w-full" width={1054} height={1492} />
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-display text-xl font-bold text-primary-deep sm:text-2xl">Liberado no primeiro dia</h3>
                <p className="mt-1 text-sm text-muted-foreground">Tudo o que você recebe assim que confirmar o pagamento</p>

                <ul className="mt-4 space-y-2.5">
                  {[
                    { t: "Protocolo Feminino 14D™ (sistema guiado)", v: "R$ 97" },
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
              <p className="mx-auto max-w-md text-sm font-display italic leading-snug text-[var(--gold-soft)] sm:text-base">
                Quanto vale voltar a se sentir bem com o seu próprio corpo?
              </p>
              <div className="mx-auto mt-4 h-px w-16 bg-white/20" />
              <p className="mt-4 text-xs uppercase tracking-widest opacity-80">Valor total dos materiais</p>
              <p className="mt-1 text-lg font-medium line-through opacity-70">R$ 322,00</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold-soft)]">Hoje, por apenas</p>
              <div className="mt-1 flex items-end justify-center gap-2">
                <span className="font-display text-2xl">R$</span>
                <span className="font-display text-6xl font-bold leading-none">39<span className="text-3xl">,90</span></span>
              </div>
              <p className="mt-2 text-xs opacity-90">ou 4x de R$ 11,07 no cartão</p>
              <p className="mt-2 inline-block rounded-full bg-[var(--gold)]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--gold-soft)] ring-1 ring-[var(--gold)]/40">
                Economia de R$ 282,10
              </p>

              <div className="mt-6">
                <CTA sub="🔒 Pagamento 100% seguro · Acesso imediato">QUERO ACESSO IMEDIATO</CTA>
              </div>

              <div className="mx-auto mt-5 flex max-w-md items-start gap-2 rounded-xl bg-white/5 px-4 py-3 text-left text-[11px] leading-relaxed text-white/90 ring-1 ring-white/15">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold-soft)]" />
                <span>Esta condição promocional pode ser encerrada sem aviso após o término desta campanha.</span>
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
              <h3 className="font-display text-2xl font-bold text-primary-deep sm:text-3xl">Experimente sem risco durante 7 dias</h3>
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
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">Você pode continuar lidando com o inchaço todos os dias…</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-95 sm:text-base">
            …ou começar hoje o método que já ajudou <strong className="text-[var(--gold-soft)]">mais de 12.000 mulheres</strong> a recuperar a leveza, a confiança e o orgulho de se olhar no espelho.
          </p>
          <div className="mt-6">
            <CTA sub="Acesso imediato após a confirmação do pagamento">COMEÇAR MEU MÉTODO AGORA</CTA>
          </div>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="mx-auto mt-16 max-w-3xl px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-primary-deep">
          <Leaf className="h-4 w-4" />
          <span className="text-sm font-semibold">Método Anti-Inchaço Feminino</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-foreground/80">
          Este produto não substitui acompanhamento médico, nutricional ou tratamento profissional. Resultados podem variar de pessoa para pessoa.
          Em caso de gestação, doenças preexistentes ou uso contínuo de medicamentos, consulte seu médico antes de iniciar qualquer protocolo.
        </p>
        <p className="mt-3 text-xs text-foreground/80">© {new Date().getFullYear()} Método Anti-Inchaço Feminino. Todos os direitos reservados.</p>
      </footer>

      <StickyCTA />
      <QuizPopup />
    </div>
  );
}
