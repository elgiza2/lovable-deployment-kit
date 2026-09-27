import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useUserLang } from "@/lib/authI18n";
import {
  Sparkles, Zap, Crown,
  Globe, MousePointerClick, CheckCircle2,
  Target, Bot, ListChecks,
  type LucideIcon,
} from "lucide-react";

const SESSION_KEY = "megsy_offers_carousel_seen_v6";
const AUTOPLAY_MS = 4200;

type OfferFeature = { icon: LucideIcon; title: string; titleAr: string; sub: string; subAr: string };

type Offer = {
  id: string;
  image: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  features: OfferFeature[];
};

const OFFERS: Offer[] = [
  {
    id: "gpt_25",
    image: "/offer-gpt-25.jpg",
    title: "GPT 2.5 Unlimited",
    titleAr: "GPT 2.5 بلا حدود",
    body: "Use our flagship model without limits for a full month.",
    bodyAr: "استخدم أقوى نماذجنا بلا حدود لمدة شهر كامل.",
    features: [
      { icon: Sparkles, title: "Unlimited chats", titleAr: "محادثات بلا حدود", sub: "No message caps for a full month", subAr: "بدون حدود للرسائل لمدة شهر كامل" },
      { icon: Zap, title: "Faster responses", titleAr: "ردود أسرع", sub: "Priority speed on every request", subAr: "سرعة أعلى في كل طلب" },
      { icon: Crown, title: "Priority access", titleAr: "أولوية الوصول", sub: "New models reach you first", subAr: "النماذج الجديدة توصلك الأول" },
    ],
  },
  {
    id: "computer",
    image: "/offer-computer-25.jpg",
    title: "Megsy Computer",
    titleAr: "ميغسي كومبيوتر",
    body: "Let Megsy browse, click, research and get work done for you.",
    bodyAr: "خلّي ميغسي يتصفح ويبحث وينفذ المهام بدلًا منك.",
    features: [
      { icon: Globe, title: "Browses the web for you", titleAr: "يتصفح الويب بدلًا منك", sub: "Opens sites and gathers what you need", subAr: "يفتح المواقع ويجمع اللي محتاجه" },
      { icon: MousePointerClick, title: "Clicks and types", titleAr: "يضغط ويكتب", sub: "Fills forms and completes steps", subAr: "يملأ النماذج ويكمّل الخطوات" },
      { icon: CheckCircle2, title: "Delivers finished work", titleAr: "يسلّم شغل مكتمل", sub: "Research, files and results ready", subAr: "بحث وملفات ونتائج جاهزة" },
    ],
  },
  {
    id: "agent",
    image: "/offer-agent-25.jpg",
    title: "Megsy Agent",
    titleAr: "وكيل ميغسي",
    body: "Turn complex goals into finished work with an autonomous AI agent.",
    bodyAr: "حوّل المهام المعقدة إلى شغل مكتمل مع وكيل ذكاء اصطناعي مستقل.",
    features: [
      { icon: Target, title: "Turns goals into plans", titleAr: "يحوّل أهدافك لخطط", sub: "Breaks big tasks into clear steps", subAr: "يقسّم المهام الكبيرة لخطوات واضحة" },
      { icon: Bot, title: "Works autonomously", titleAr: "يشتغل بشكل مستقل", sub: "Keeps going until the job is done", subAr: "يكمّل لوحده لحد ما الشغل يخلص" },
      { icon: ListChecks, title: "Finishes complex tasks", titleAr: "ينهي المهام المعقدة", sub: "Multi-step work, handled end to end", subAr: "شغل متعدد الخطوات من الأول للآخر" },
    ],
  },
];

export default function SeedanceOfferDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = useUserLang();
  const isArabic = lang === "ar-eg";
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const isEntryRoute = location.pathname === "/" || location.pathname === "/chat" || location.pathname === "/index";
    if (!isEntryRoute) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % OFFERS.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [open]);

  const dismiss = () => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* storage unavailable */ }
    setOpen(false);
  };

  const tryNow = () => {
    const offer = OFFERS[activeIndex];
    dismiss();
    navigate(offer.id === "computer" || offer.id === "agent" ? "/chat" : `/pricing?offer=${offer.id}`);
  };

  const move = (direction: 1 | -1) => setActiveIndex((index) => (index + direction + OFFERS.length) % OFFERS.length);
  const current = OFFERS[activeIndex];

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : dismiss())}>
      <DialogContent
        dir={isArabic ? "rtl" : "ltr"}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="offers-bottom-sheet fixed bottom-0 left-1/2 top-auto z-50 grid max-h-[92dvh] w-full max-w-[540px] translate-x-[-50%] translate-y-0 gap-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-t-[28px] rounded-b-none border-0 bg-white p-0 text-[#121212] shadow-[0_-14px_50px_rgba(0,0,0,0.22)] outline-none ring-0 focus:outline-none focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8 [&_button]:outline-none [&_button]:ring-0 [&_button:focus]:outline-none [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-0 [&>button]:hidden"
      >
        {/* drag handle */}
        <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-[#e4e2dd]" />

        {/* image banner */}
        <div
          className="px-4 pt-3 touch-pan-y"
          onPointerDown={(event) => { touchStartX.current = event.clientX; }}
          onPointerUp={(event) => {
            if (touchStartX.current === null) return;
            const delta = event.clientX - touchStartX.current;
            if (Math.abs(delta) > 42) move(delta > 0 ? -1 : 1);
            touchStartX.current = null;
          }}
        >
          <img
            key={current.image}
            src={current.image}
            alt={isArabic ? current.titleAr : current.title}
            loading="lazy"
            width={1280}
            height={640}
            className="block h-[170px] w-full rounded-2xl object-cover sm:h-[210px]"
          />
        </div>

        <div className="px-6 pb-7 pt-5 sm:px-9">
          <div className="text-center">
            <DialogTitle className="text-[22px] font-bold tracking-tight sm:text-[26px]">
              {isArabic ? current.titleAr : current.title}
            </DialogTitle>
            <DialogDescription className="mx-auto mt-1.5 max-w-[430px] text-[14px] leading-6 text-[#6f6b70] sm:text-[15px]">
              {isArabic ? current.bodyAr : current.body}
            </DialogDescription>
          </div>

          {/* feature rows */}
          <div className="mt-5 flex flex-col gap-4">
            {current.features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1efeb] text-[#121212]">
                  <feature.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold leading-5">{isArabic ? feature.titleAr : feature.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-[#8a8589]">{isArabic ? feature.subAr : feature.sub}</span>
                </span>
              </div>
            ))}
          </div>

          {/* carousel dots */}
          <div className="mt-5 flex items-center justify-center gap-1.5" dir="ltr">
            {OFFERS.map((offer, index) => (
              <button
                key={offer.id}
                type="button"
                aria-label={offer.title}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-[#121212]" : "w-1.5 bg-[#d8d5d0]"}`}
              />
            ))}
          </div>

          {/* actions — Later (gray) then Try now (blue), matching the reference sheet */}
          <button
            type="button"
            onPointerDown={(event) => { event.preventDefault(); dismiss(); }}
            onClick={dismiss}
            className="mt-5 h-[52px] w-full rounded-full bg-[#f1efeb] text-[15px] font-semibold text-[#121212] transition hover:bg-[#e8e5e0] active:scale-[0.985]"
          >
            {isArabic ? "لاحقًا" : "Later"}
          </button>
          <button
            type="button"
            onClick={(event) => { event.currentTarget.blur(); tryNow(); }}
            className="mt-2.5 h-[52px] w-full rounded-full bg-[#1a73e8] text-[15px] font-semibold !text-white shadow-[0_8px_20px_rgba(26,115,232,0.25)] transition hover:bg-[#1765cc] active:scale-[0.985]"
          >
            <span className="!text-white">{isArabic ? "جرّب الآن" : "Try now"}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
