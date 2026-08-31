import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  HelpCircle,
  ImagePlus,
  Leaf,
  Menu,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { BonsaiScene } from "./BonsaiScene";
import {
  businessTypes,
  features,
  feelings,
  fonts,
  goals,
  palettes,
  sections,
  steps,
  styles,
} from "./workshopData";
import { loadPictures, removePicture, savePicture } from "./storage";
import { Lang, translate } from "./i18n";
type Picture = { id: string; name: string; url: string };
type DomainStatus =
  | "idle"
  | "checking"
  | "registered"
  | "possibly-available"
  | "invalid"
  | "error";
type OrderStatus = "idle" | "sending" | "sent" | "error";
type Project = {
  businessName: string;
  projectKind: string;
  domainName: string;
  domainStatus: DomainStatus;
  businessType: string;
  goal: string;
  audience: string;
  offer: string;
  serviceArea: string;
  differentiator: string;
  competitors: string;
  existingWebsite: string;
  feeling: string[];
  style: string;
  palette: string;
  font: string;
  sections: string[];
  features: string[];
  headline: string;
  subheadline: string;
  about: string;
  proof: string;
  cta: string;
  contact: string;
  seo: string;
  languages: string;
  integrations: string;
  legal: string;
  contentOwner: string;
  maintenance: string;
  deadline: string;
  budget: string;
  socialLinks: Record<string, string>;
  logoId: string;
  pictureIds: string[];
};
const blank: Project = {
    businessName: "",
    projectKind: "Website",
    domainName: "",
    domainStatus: "idle",
    businessType: "",
    goal: "",
    audience: "",
    offer: "",
    serviceArea: "",
    differentiator: "",
    competitors: "",
    existingWebsite: "",
    feeling: [],
    style: "",
    palette: "",
    font: "",
    sections: ["Hero", "Services", "About", "Contact"],
    features: [],
    headline: "",
    subheadline: "",
    about: "",
    proof: "",
    cta: "Contact us",
    contact: "",
    seo: "",
    languages: "",
    integrations: "",
    legal: "",
    contentOwner: "",
    maintenance: "",
    deadline: "",
    budget: "",
    socialLinks: {},
    logoId: "",
    pictureIds: [],
  },
  STORE = "bonsai-workshop-v2";
const socialPlatforms = [
  "Website",
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "WhatsApp",
  "Google Business",
  "Other link",
];
const projectKinds = [
  "Website",
  "Online shop",
  "Web application",
  "Mobile application",
  "Website + application",
];
const deliveryEstimate = (kind: string, features: number) =>
  (({
    Website: "3–6 weeks",
    "Online shop": "5–10 weeks",
    "Web application": "8–16 weeks",
    "Mobile application": "12–24 weeks",
    "Website + application": "16–28 weeks",
  })[kind] || "4–12 weeks") + (features > 8 ? " · complex scope review" : "");
const websiteExamples = [
  {
    title: "BonsAi Studio",
    type: "Studio website",
    url: "https://itbonsai.pl",
    accent: "#315f40",
    note: "Main active studio site for web, apps and AI services.",
  },
  {
    title: "Sea Warriors Sopot",
    type: "Fitness / martial arts",
    url: "https://sea-warriors-sopot.vercel.app",
    accent: "#d94b38",
    note: "Strong local service page with clear action and club energy.",
  },
  {
    title: "MORI Forest Retreat",
    type: "Hospitality concept",
    url: "https://mori-forest-retreat.vercel.app",
    accent: "#7d8f59",
    note: "Quiet premium retreat direction with natural storytelling.",
  },
  {
    title: "Forge Steel",
    type: "Industrial website",
    url: "https://steel-company-2.vercel.app",
    accent: "#46505c",
    note: "Bolder B2B visual system for heavy industry and credibility.",
  },
  {
    title: "Fiku Miku",
    type: "Online shop",
    url: "https://files-mentioned-by-the-user-bonsai.vercel.app",
    accent: "#e9a7be",
    note: "Bright ecommerce style for products, categories and sales.",
  },
];
const toggle = (a: string[], v: string) =>
  a.includes(v) ? a.filter((x) => x !== v) : [...a, v];
function Brand() {
  return (
    <div className="brand">
      <span>
        <Leaf /> BonsAi Studio
      </span>
      <small>WEB • APPS • AI</small>
    </div>
  );
}
function Choice({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`choice ${selected ? "selected" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
      {selected ? <Check className="tick" /> : null}
    </button>
  );
}
export function App() {
  const [started, setStarted] = useState(false),
    [step, setStep] = useState(0),
    [project, setProject] = useState<Project>(() => {
      try {
        return { ...blank, ...JSON.parse(localStorage.getItem(STORE) || "{}") };
      } catch {
        return blank;
      }
    }),
    [pictures, setPictures] = useState<Picture[]>([]),
    [logo, setLogo] = useState<Picture | null>(null),
    [help, setHelp] = useState(false),
    [summary, setSummary] = useState(false),
    [menu, setMenu] = useState(false),
    [saved, setSaved] = useState(false),
    [orderStatus, setOrderStatus] = useState<OrderStatus>("idle"),
    [orderMessage, setOrderMessage] = useState(""),
    [pulse, setPulse] = useState(0),
    [lang, setLang] = useState<Lang>(
      () => (localStorage.getItem("bonsai-lang") as Lang) || "en",
    );
  const t = (text: string) => translate(lang, text);
  const palette = palettes.find((x) => x.name === project.palette),
    tone = palette?.colors?.[1] || "#d5a35d";
  const growth = Math.max(
    0.08,
    [
      project.businessName,
      project.businessType,
      project.goal,
      project.feeling.length,
      project.style,
      project.palette,
      project.font,
      project.sections.length,
      project.features.length,
      project.headline,
      logo?.id,
      pictures.length,
    ].filter(Boolean).length / 11,
  );
  useEffect(() => {
    loadPictures(project.pictureIds).then((fs) =>
      setPictures(
        fs.map(({ id, file }) => ({
          id,
          name: file.name,
          url: URL.createObjectURL(file),
        })),
      ),
    );
    if (project.logoId) {
      loadPictures([project.logoId]).then((fs) => {
        const loaded = fs[0];
        if (loaded) {
          setLogo({
            id: loaded.id,
            name: loaded.file.name,
            url: URL.createObjectURL(loaded.file),
          });
        }
      });
    }
  }, []);
  useEffect(() => {
    document.querySelector(".work-area")?.scrollTo({ top: 0 });
  }, [step]);
  useEffect(() => {
    localStorage.setItem("bonsai-lang", lang);
    document.documentElement.lang = lang === "ja" ? "ja" : lang;
  }, [lang]);
  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    setProject((p) => ({ ...p, [key]: value }));
    setPulse(Date.now());
  };
  const persist = () => {
    localStorage.setItem(STORE, JSON.stringify(project));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  const next = () => {
    persist();
    setStep((s) => Math.min(9, s + 1));
    setPulse(Date.now());
  };
  const addPictures = async (e: ChangeEvent<HTMLInputElement>) => {
    for (const file of Array.from(e.target.files || [])) {
      const id = crypto.randomUUID();
      await savePicture(id, file);
      setPictures((p) => [
        ...p,
        { id, name: file.name, url: URL.createObjectURL(file) },
      ]);
      setProject((p) => ({ ...p, pictureIds: [...p.pictureIds, id] }));
    }
    e.target.value = "";
    setPulse(Date.now());
  };
  const addLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files || [])[0];
    if (!file) return;
    if (project.logoId) await removePicture(project.logoId);
    const id = crypto.randomUUID();
    await savePicture(id, file);
    setLogo({ id, name: file.name, url: URL.createObjectURL(file) });
    setProject((p) => ({ ...p, logoId: id }));
    e.target.value = "";
    setPulse(Date.now());
  };
  const delLogo = async () => {
    if (project.logoId) await removePicture(project.logoId);
    setLogo(null);
    setProject((p) => ({ ...p, logoId: "" }));
  };
  const delPicture = async (id: string) => {
    await removePicture(id);
    setPictures((p) => p.filter((x) => x.id !== id));
    setProject((p) => ({
      ...p,
      pictureIds: p.pictureIds.filter((x) => x !== id),
    }));
  };
  const reset = () => {
    if (!confirm("Start a new concept? Your saved choices will be cleared."))
      return;
    localStorage.removeItem(STORE);
    project.pictureIds.forEach(removePicture);
    if (project.logoId) removePicture(project.logoId);
    setProject(blank);
    setPictures([]);
    setLogo(null);
    setStep(0);
  };
  const spec = useMemo(() => {
    const socials =
      Object.entries(project.socialLinks || {})
        .filter(([, url]) => url.trim())
        .map(([name, url]) => `${name}: ${url}`)
        .join("\n") || "—";
    return `BONSAI WEBSITE BUILD BRIEF\n\nBUSINESS\nName: ${project.businessName || "—"}\nDomain: ${project.domainName || "—"}${project.domainName ? ` (${project.domainStatus})` : ""}\nType: ${project.businessType || "—"}\nGoal: ${project.goal || "—"}\nAudience: ${project.audience || "—"}\nOffer: ${project.offer || "—"}\nService area: ${project.serviceArea || "—"}\nDifferentiator: ${project.differentiator || "—"}\nCompetitors / inspiration: ${project.competitors || "—"}\nExisting website: ${project.existingWebsite || "—"}\n\nDIRECTION\nFeeling: ${project.feeling.join(", ") || "—"}\nStyle: ${project.style || "—"}\nColors: ${project.palette || "—"}\nTypography: ${project.font || "—"}\nSections: ${project.sections.join(", ")}\nFeatures: ${project.features.join(", ") || "—"}\n\nCONTENT\nHeadline: ${project.headline || "—"}\nSubheadline: ${project.subheadline || "—"}\nAbout: ${project.about || "—"}\nProof / testimonials: ${project.proof || "—"}\nCTA: ${project.cta || "—"}\nContact: ${project.contact || "—"}\nSEO topics and locations: ${project.seo || "—"}\nLanguages: ${project.languages || "—"}\nIntegrations: ${project.integrations || "—"}\nLegal / privacy: ${project.legal || "—"}\nContent owner: ${project.contentOwner || "—"}\nOngoing maintenance: ${project.maintenance || "—"}\nDeadline: ${project.deadline || "—"}\nBudget: ${project.budget || "—"}\nSocial links:\n${socials}\nLogo: ${logo?.name || "—"}\nPictures: ${pictures.length}\n\nCreated with BonsAi Studio · itbonsai.pl`;
  }, [project, pictures.length, logo?.name]);
  const copy = async () => {
      await navigator.clipboard.writeText(spec);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    },
    download = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([spec], { type: "text/plain" }));
      a.download = `${project.businessName || "bonsai"}-concept.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    sendOrder = async () => {
      persist();
      const submitted = new Intl.DateTimeFormat(
        lang === "pl" ? "pl-PL" : lang === "ja" ? "ja-JP" : "en-GB",
        { dateStyle: "full", timeStyle: "long" },
      ).format(new Date());
      const subject = `New ${project.projectKind || "website"} order — ${project.businessName || "BonsAI Workshop"}`;
      const message = `ORDER SUBMITTED: ${submitted}\nORDER TYPE: ${project.projectKind}\nESTIMATED DELIVERY: ${deliveryEstimate(project.projectKind, project.features.length)} (final timing confirmed after review)\n\n${spec}\n\nPlease reply to confirm the scope, final delivery date and quotation.`;
      setOrderStatus("sending");
      setOrderMessage("");
      try {
        const response = await fetch("/api/send-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, message }),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result?.error || "Email could not be sent.");
        }

        setOrderStatus("sent");
        setOrderMessage("Order sent to studio@itbonsai.pl.");
      } catch (error) {
        setOrderStatus("error");
        setOrderMessage(
          error instanceof Error
            ? error.message
            : "Email could not be sent. Please try again or use the fallback email window.",
        );
        window.location.href = `mailto:studio@itbonsai.pl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      }
    };
  return (
    <main
      className={`atelier ${started ? "workshop" : "landing"}`}
      style={
        {
          "--tone": tone,
          "--c1": palette?.colors?.[0] || "#080909",
          "--c2": tone,
          "--c3": palette?.colors?.[2] || "#eee6d9",
        } as React.CSSProperties
      }
    >
      <div className="garden-bg" />
      <div className="vignette" />
      <div className="scene">
        <BonsaiScene growth={growth} pulse={pulse} />
      </div>
      <header>
        <Brand />
        <div className="lang-switch" aria-label="Language">
          {(["en", "pl", "ja"] as Lang[]).map((x) => (
            <button
              key={x}
              className={lang === x ? "active" : ""}
              onClick={() => setLang(x)}
            >
              {x === "ja" ? "日本語" : x.toUpperCase()}
            </button>
          ))}
        </div>
        {started ? (
          <div className="top-progress">
            <b>{String(step + 1).padStart(2, "0")}</b> / 10
          </div>
        ) : (
          <nav>
            <button onClick={() => setStarted(true)}>
              {t("Create brief")}
            </button>
            <a href="https://itbonsai.pl" target="_blank" rel="noreferrer">
              {t("Studio")}
            </a>
            <button onClick={() => setHelp(true)}>{t("Help")}</button>
          </nav>
        )}
        <div className="head-actions">
          {started ? (
            <>
              <button onClick={persist}>
                <Save /> {t(saved ? "Saved" : "Save progress")}
              </button>
              <button onClick={() => setHelp(true)}>
                <HelpCircle /> {t("Help")}
              </button>
              <button className="outline" onClick={() => setSummary(true)}>
                {t("My BonsAI")}
              </button>
            </>
          ) : (
            <button className="outline" onClick={() => setStarted(true)}>
              {t("Create brief")}
            </button>
          )}
          <button
            className="menu"
            onClick={() => setMenu(!menu)}
            aria-label="Menu"
          >
            <Menu />
          </button>
        </div>
      </header>
      {!started ? (
        <section className="landing-copy">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("Grow your perfect website.")}
          </motion.h1>
          <p>
            {t(
              "Build your website direction step by step. Choose the style, colors, content, features and pictures—then watch your BonsAI grow.",
            )}
          </p>
          <button className="primary" onClick={() => setStarted(true)}>
            {t("Create my website brief")} <ChevronRight />
          </button>
          <p className="landing-explainer">
            {t(
              "Answer simple questions about your business, style, features, content and photos. At the end you can send the full website or app brief to BonsAi Studio.",
            )}
          </p>
          <small>{t("Your progress is saved on this device.")}</small>
          <div className="reference-sites" aria-label={t("Website references")}>
            <div className="reference-sites__intro">
              <span>{t("Active references")}</span>
              <b>{t("Choose from work that fits your customer.")}</b>
            </div>
            <div className="reference-sites__grid">
              {websiteExamples.map((example) => (
                <a
                  key={example.url}
                  className="reference-card"
                  href={example.url}
                  target="_blank"
                  rel="noreferrer"
                  style={
                    { "--preview-accent": example.accent } as React.CSSProperties
                  }
                >
                  <div className="reference-preview" aria-hidden="true">
                    <iframe src={example.url} title={`${example.title} preview`} />
                    <div className="reference-browser">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <span>{t(example.type)}</span>
                  <b>{example.title}</b>
                  <p>{t(example.note)}</p>
                  <i>
                    {t("Open example")} <ExternalLink />
                  </i>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <aside className="step-rail">
            {steps.map((name, i) => (
              <button
                key={name}
                className={`${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                onClick={() => setStep(i)}
              >
                <i>{i < step ? <Check /> : String(i + 1).padStart(2, "0")}</i>
                <span>{t(name)}</span>
              </button>
            ))}
          </aside>
          <section className="work-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${step}-${lang}`}
                className="step-content"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
              >
                <Step
                  lang={lang}
                  step={step}
                  project={project}
                  update={update}
                  pictures={pictures}
                  logo={logo}
                  addPictures={addPictures}
                  addLogo={addLogo}
                  delLogo={delLogo}
                  delPicture={delPicture}
                  copy={copy}
                  download={download}
                  sendOrder={sendOrder}
                  orderStatus={orderStatus}
                  orderMessage={orderMessage}
                />
              </motion.div>
            </AnimatePresence>
          </section>
          <aside className="tree-status">
            <span>
              {t("Your website is")}{" "}
              <b>
                {Math.round(growth * 100)}% {t("grown")}
              </b>
            </span>
            <i>
              <i style={{ width: `${growth * 100}%` }} />
            </i>
            <small>
              {project.style || t("Choose your direction to grow the trunk.")}
            </small>
          </aside>
          <div className="bottom-nav">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft /> {t("Back")}
            </button>
            <button
              className="continue"
              onClick={step === 9 ? () => setSummary(true) : next}
            >
              {step === 9
                ? t("Open My BonsAI")
                : `${lang === "pl" ? "Dalej:" : lang === "ja" ? "次へ:" : "Continue to"} ${t(steps[step + 1])}`}{" "}
              <ArrowRight />
            </button>
          </div>
        </>
      )}
      <AnimatePresence>
        {(help || summary) && (
          <>
            <motion.div
              className="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setHelp(false);
                setSummary(false);
              }}
            />
            <motion.aside
              className="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <button
                className="close"
                onClick={() => {
                  setHelp(false);
                  setSummary(false);
                }}
                aria-label="Close"
              >
                <X />
              </button>
              {help ? (
                <Help lang={lang} />
              ) : (
                <Summary
                  lang={lang}
                  project={project}
                  growth={growth}
                  pictures={pictures}
                  copy={copy}
                  download={download}
                  reset={reset}
                />
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      {menu ? (
        <div className="mobile-nav">
          <button onClick={persist}>{t("Save progress")}</button>
          <button onClick={() => setHelp(true)}>{t("Help")}</button>
          <button onClick={() => setSummary(true)}>{t("My BonsAI")}</button>
        </div>
      ) : null}
    </main>
  );
}
type SP = {
  lang: Lang;
  step: number;
  project: Project;
  update: <K extends keyof Project>(k: K, v: Project[K]) => void;
  pictures: Picture[];
  logo: Picture | null;
  addPictures: (e: ChangeEvent<HTMLInputElement>) => void;
  addLogo: (e: ChangeEvent<HTMLInputElement>) => void;
  delLogo: () => void;
  delPicture: (id: string) => void;
  copy: () => void;
  download: () => void;
  sendOrder: () => void | Promise<void>;
  orderStatus: OrderStatus;
  orderMessage: string;
};
function Step({
  lang,
  step,
  project,
  update,
  pictures,
  logo,
  addPictures,
  addLogo,
  delLogo,
  delPicture,
  copy,
  download,
  sendOrder,
  orderStatus,
  orderMessage,
}: SP) {
  const t = (s: string) => translate(lang, s);
  const selectedPalette = palettes.find((x) => x.name === project.palette);
  const heads = [
    [
      "Tell us what you are growing.",
      "This gives every later recommendation the right roots.",
    ],
    [
      "How should people feel?",
      "Choose up to four qualities your website should communicate.",
    ],
    [
      "Choose the character of your website.",
      "Explore 30 genuinely different design directions.",
    ],
    [
      "Choose the atmosphere.",
      "The palette immediately changes your living BonsAI.",
    ],
    [
      "Give your message a voice.",
      "Typography shapes how confident, warm or innovative your brand feels.",
    ],
    ["Build the structure.", "Select every section your website needs."],
    ["Add useful capabilities.", "Choose the tools that help customers act."],
    [
      "Content Garden.",
      "Add the information, logo and pictures needed to make the website.",
    ],
    [
      "Bring your brand to life.",
      "Upload logos, team pictures, products, spaces or inspiration.",
    ],
    [
      "Your BonsAI is ready.",
      "Review the direction and take the specification with you.",
    ],
  ][step];
  const tips = [
    "Start with the customer, not the design. A precise audience and offer make every later choice easier.",
    "Choose feelings your customers need in order to trust you—not only words that describe your personal taste.",
    "Pick the direction that supports your offer and content. Distinctive is useful only when it stays clear.",
    "Use one dominant color, one supporting tone and one accent. Contrast must keep every sentence readable.",
    "Choose readability before novelty. A strong display face works best with a calm body typeface.",
    "Every section needs a job: explain, prove, answer or convert. Remove sections that repeat the same message.",
    "Select only features that support a real customer action. Each extra system adds build time and maintenance.",
    "Write plainly and specifically. Strong proof and a clear next action are more persuasive than slogans.",
    "Use sharp, consistent images with similar lighting. Include your logo, team, work, products and location.",
    "Review the brief as a customer: can they understand the offer, trust it and know exactly what to do next?",
  ];
  return (
    <>
      <span className="kicker">
        {String(step + 1).padStart(2, "0")} / {t(steps[step])}
      </span>
      <h1>{t(heads[0])}</h1>
      <p className="lead">{t(heads[1])}</p>
      <motion.aside
        className="leaf-tip"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <span>
          <Leaf /> {t("A good choice")}
        </span>
        <p>{t(tips[step])}</p>
      </motion.aside>
      {step === 0 ? (
        <div className="form-stack">
          <fieldset>
            <legend>{t("What would you like to order?")}</legend>
            <div className="option-grid compact">
              {projectKinds.map((x) => (
                <Choice
                  key={x}
                  selected={project.projectKind === x}
                  onClick={() => update("projectKind", x)}
                >
                  {t(x)}
                </Choice>
              ))}
            </div>
            <small className="delivery-note">
              {t("Typical delivery")}:{" "}
              <b>
                {deliveryEstimate(project.projectKind, project.features.length)}
              </b>
              . {t("The final schedule is confirmed after scope review.")}
            </small>
          </fieldset>
          <label>
            {t("Business or project name")}
            <input
              value={project.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="e.g. North Shore Architecture"
            />
          </label>
          <DomainCheck
            lang={lang}
            value={project.domainName}
            status={project.domainStatus}
            updateName={(v) => update("domainName", v)}
            updateStatus={(v) => update("domainStatus", v)}
          />
          <fieldset>
            <legend>{t("Business type")}</legend>
            <div className="option-grid compact">
              {businessTypes.map((x) => (
                <Choice
                  key={x}
                  selected={project.businessType === x}
                  onClick={() => update("businessType", x)}
                >
                  {t(x)}
                </Choice>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t("Main website goal")}</legend>
            <div className="option-grid compact">
              {goals.map((x) => (
                <Choice
                  key={x}
                  selected={project.goal === x}
                  onClick={() => update("goal", x)}
                >
                  {t(x)}
                </Choice>
              ))}
            </div>
          </fieldset>
          <label>
            {t("Who is your ideal customer?")}
            <textarea
              value={project.audience || ""}
              onChange={(e) => update("audience", e.target.value)}
              placeholder={t(
                "Describe who they are, what they need and what matters to them.",
              )}
            />
          </label>
          <label>
            {t("What do you sell or provide?")}
            <textarea
              value={project.offer || ""}
              onChange={(e) => update("offer", e.target.value)}
              placeholder={t(
                "List your main services, products or packages and typical prices if known.",
              )}
            />
          </label>
          <div className="two-fields">
            <label>
              {t("Service area or market")}
              <input
                value={project.serviceArea || ""}
                onChange={(e) => update("serviceArea", e.target.value)}
                placeholder={t("Local city, country or worldwide")}
              />
            </label>
            <label>
              {t("Existing website")}
              <input
                type="url"
                value={project.existingWebsite || ""}
                onChange={(e) => update("existingWebsite", e.target.value)}
                placeholder="https://…"
              />
            </label>
          </div>
          <label>
            {t("Why should customers choose you?")}
            <textarea
              value={project.differentiator || ""}
              onChange={(e) => update("differentiator", e.target.value)}
              placeholder={t(
                "Your strongest difference, promise or advantage.",
              )}
            />
          </label>
          <label>
            {t("Competitors or websites you like")}
            <textarea
              value={project.competitors || ""}
              onChange={(e) => update("competitors", e.target.value)}
              placeholder={t(
                "Add links and explain what you like or dislike about them.",
              )}
            />
          </label>
        </div>
      ) : null}
      {step === 1 ? (
        <div className="option-grid feelings">
          {feelings.map((x) => (
            <Choice
              key={x}
              selected={project.feeling.includes(x)}
              onClick={() =>
                project.feeling.includes(x) || project.feeling.length < 4
                  ? update("feeling", toggle(project.feeling, x))
                  : undefined
              }
            >
              {t(x)}
              <small>
                {t(project.feeling.includes(x) ? "Selected" : "Add feeling")}
              </small>
            </Choice>
          ))}
        </div>
      ) : null}
      {step === 2 ? (
        <div className="style-grove-screen">
          <div className="template-orbit">
            <button
              className="template-preview template-preview--left"
              onClick={() => update("style", "Dark Premium")}
            >
              <span>KAGE</span>
              <b>Precision in Every Detail</b>
              <small>Architecture · Interiors · Consulting</small>
              <i>VIEW PROJECTS →</i>
            </button>
            <button
              className="template-preview template-preview--main"
              onClick={() => update("style", "Japanese Minimal")}
            >
              <span>SHIRO</span>
              <b>Stillness by Design</b>
              <small>Thoughtful spaces. Meaningful experiences.</small>
              <i>SCROLL TO DISCOVER ↓</i>
            </button>
            <button
              className="template-preview template-preview--right"
              onClick={() => update("style", "Organic")}
            >
              <span>HANA</span>
              <b>Rooted in Nature</b>
              <small>Sustainable spaces. Healthy living.</small>
              <i>LEARN MORE →</i>
            </button>
          </div>
          <div className="style-grove-bottom">
            <section className="selected-style-card">
              <Leaf />
              <h2>{project.style || "Japanese Minimal"}</h2>
              <p>Calm · Intentional · Timeless</p>
              <span>
                {t(
                  "For hospitality, architecture, wellness and premium services.",
                )}
              </span>
            </section>
            <div className="style-carousel">
              {styles.slice(0, 25).map((x, i) => (
                <Choice
                  key={x.id}
                  selected={project.style === x.name}
                  onClick={() => update("style", x.name)}
                >
                  <span className={`style-art art-${i % 8}`} />
                  <b>{x.name}</b>
                </Choice>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {step === 3 ? (
        <div className="color-grove-screen">
          <section className="palette-hero">
            <span>{t("Choose the atmosphere.")}</span>
            <h2>{project.palette || "Moss Gold"}</h2>
            <p>
              {t(
                "Use one dominant color, one supporting tone and one accent. Contrast must keep every sentence readable.",
              )}
            </p>
            <div className="large-swatches">
              {(selectedPalette?.colors || ["#1f2923", "#8a925f", "#f3ead7"]).map(
                (c: string) => (
                  <i key={c} style={{ background: c }} />
                ),
              )}
            </div>
          </section>
          <div className="palette-board">
            {palettes.map((x) => (
              <Choice
                key={x.id}
                selected={project.palette === x.name}
                onClick={() => update("palette", x.name)}
              >
                <span className="swatches">
                  {x.colors!.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                <b>{x.name}</b>
              </Choice>
            ))}
          </div>
        </div>
      ) : null}
      {step === 4 ? (
        <div className="font-options">
          {fonts.map((x, i) => (
            <Choice
              key={x}
              selected={project.font === x}
              onClick={() => update("font", x)}
              className={`font-${i}`}
            >
              <span>Aa</span>
              <b>{x}</b>
              <small>Grow ideas into experiences.</small>
            </Choice>
          ))}
        </div>
      ) : null}
      {step === 5 ? (
        <div className="sections-path-screen">
          <div className="section-card-grid">
            {sections.slice(0, 12).map((x, i) => (
              <Choice
                key={x}
                selected={project.sections.includes(x)}
                onClick={() => update("sections", toggle(project.sections, x))}
              >
                <span className={`section-mini section-mini-${i % 6}`} />
                <b>{t(x)}</b>
              </Choice>
            ))}
          </div>
          <aside className="selected-page-preview">
            <span>{t("Your selected sections")}</span>
            {project.sections.slice(0, 8).map((name) => (
              <i key={name}>{t(name)}</i>
            ))}
            <b>
              {project.sections.length} {t("sections selected")}
            </b>
          </aside>
        </div>
      ) : null}
      {step === 6 ? (
        <div className="effects-shrine-screen">
          <section className="effects-list">
            <h2>{t("Effects Pond")}</h2>
            {[
              "Soft reveal",
              "Gallery motion",
              "Premium cursor",
              "Floating tips",
              "Quiet parallax",
              "BonsAI assistant",
            ].map((name) => (
              <button
                key={name}
                className={project.features.includes(name) ? "active" : ""}
                onClick={() => update("features", toggle(project.features, name))}
              >
                <span />
                <b>{t(name)}</b>
                <i />
              </button>
            ))}
          </section>
          <section className="live-mini-preview">
            <span>BonsAI Studio</span>
            <h2>Crafted with care. Built to inspire.</h2>
            <p>Beautiful websites that grow with your vision.</p>
            <button>{t("Explore services")}</button>
          </section>
          <section className="features-shrine">
            <h2>{t("Features Shrine")}</h2>
            {features.slice(0, 12).map((x) => (
              <Choice
                key={x}
                selected={project.features.includes(x)}
                onClick={() => update("features", toggle(project.features, x))}
              >
                <b>{t(x)}</b>
              </Choice>
            ))}
          </section>
        </div>
      ) : null}
      {step === 7 ? (
        <div className="content-garden">
          <div className="form-stack content-form">
          <h2>{t("Tell us about your website")}</h2>
          <label>
            {t("Main headline")}
            <input
              value={project.headline}
              onChange={(e) => update("headline", e.target.value)}
              placeholder="What should customers remember?"
            />
          </label>
          <label>
            {t("Supporting message")}
            <textarea
              value={project.subheadline}
              onChange={(e) => update("subheadline", e.target.value)}
              placeholder="Explain the value in one or two sentences."
            />
          </label>
          <label>
            {t("About your business")}
            <textarea
              value={project.about}
              onChange={(e) => update("about", e.target.value)}
              placeholder="What makes your work different?"
            />
          </label>
          <label>
            {t("Proof that builds trust")}
            <textarea
              value={project.proof || ""}
              onChange={(e) => update("proof", e.target.value)}
              placeholder={t(
                "Testimonials, reviews, awards, qualifications, client names or results.",
              )}
            />
          </label>
          <div className="two-fields">
            <label>
              {t("Primary button")}
              <input
                value={project.cta}
                onChange={(e) => update("cta", e.target.value)}
              />
            </label>
            <label>
              {t("Contact details")}
              <input
                value={project.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder="Email, phone or address"
              />
            </label>
          </div>
          <label>
            {t("SEO topics and locations")}
            <textarea
              value={project.seo || ""}
              onChange={(e) => update("seo", e.target.value)}
              placeholder={t("What would customers search for to find you?")}
            />
          </label>
          <div className="two-fields">
            <label>
              {t("Website languages")}
              <input
                value={project.languages || ""}
                onChange={(e) => update("languages", e.target.value)}
                placeholder={t("e.g. English, Polish, Japanese")}
              />
            </label>
            <label>
              {t("Required integrations")}
              <input
                value={project.integrations || ""}
                onChange={(e) => update("integrations", e.target.value)}
                placeholder={t("CRM, booking, payments, email, analytics…")}
              />
            </label>
          </div>
          <label>
            {t("Legal, privacy or accessibility requirements")}
            <textarea
              value={project.legal || ""}
              onChange={(e) => update("legal", e.target.value)}
              placeholder={t(
                "Privacy policy, cookies, terms, age restrictions or accessibility needs.",
              )}
            />
          </label>
          <div className="two-fields">
            <label>
              {t("Who will provide and approve content?")}
              <input
                value={project.contentOwner || ""}
                onChange={(e) => update("contentOwner", e.target.value)}
                placeholder={t("Name, team or BonsAi Studio")}
              />
            </label>
            <label>
              {t("Who will maintain the website?")}
              <input
                value={project.maintenance || ""}
                onChange={(e) => update("maintenance", e.target.value)}
                placeholder={t("Your team, BonsAi Studio or not sure")}
              />
            </label>
          </div>
          <div className="two-fields">
            <label>
              {t("Desired launch date")}
              <input
                value={project.deadline || ""}
                onChange={(e) => update("deadline", e.target.value)}
                placeholder={t("Date or timeframe")}
              />
            </label>
            <label>
              {t("Approximate budget")}
              <input
                value={project.budget || ""}
                onChange={(e) => update("budget", e.target.value)}
                placeholder={t("Range and currency, or not sure")}
              />
            </label>
          </div>
          <fieldset className="social-section">
            <legend>{t("Social links & online profiles")}</legend>
            <p>
              {t(
                "Add any links customers should find on your website. Leave the rest empty.",
              )}
            </p>
            <div className="social-grid">
              {socialPlatforms.map((name) => (
                <label key={name}>
                  {t(name)}
                  <input
                    type="url"
                    inputMode="url"
                    value={project.socialLinks?.[name] || ""}
                    onChange={(e) =>
                      update("socialLinks", {
                        ...(project.socialLinks || {}),
                        [name]: e.target.value,
                      })
                    }
                    placeholder={
                      name === "WhatsApp"
                        ? "https://wa.me/…"
                        : name === "Other link"
                          ? "https://…"
                          : `https://${name.toLowerCase().replace(" ", "")}.com/…`
                    }
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          </div>
          <aside className="brand-kit">
            <h2>{t("Brand Kit")}</h2>
            <label className="upload upload-logo">
              {logo ? (
                <>
                  <img src={logo.url} alt={logo.name} />
                  <b>{logo.name}</b>
                  <span>{t("Click to replace logo")}</span>
                </>
              ) : (
                <>
                  <Upload />
                  <b>{t("Upload logo")}</b>
                  <span>PNG, SVG or JPG</span>
                </>
              )}
              <input
                type="file"
                accept="image/svg+xml,image/jpeg,image/png,image/webp"
                onChange={addLogo}
              />
            </label>
            {logo ? (
              <button className="outline remove-logo" onClick={delLogo}>
                <Trash2 /> {t("Remove logo")}
              </button>
            ) : null}
            <label className="upload upload-pictures">
              <ImagePlus />
              <b>{t("Add pictures")}</b>
              <span>PNG, SVG or JPG</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={addPictures}
              />
            </label>
            {pictures.length ? (
              <div className="mini-picture-strip">
                {pictures.slice(0, 6).map((p) => (
                  <img key={p.id} src={p.url} alt={p.name} />
                ))}
              </div>
            ) : null}
            <label>
              {t("Brand colors and style notes")}
              <textarea
                value={project.proof || ""}
                onChange={(e) => update("proof", e.target.value)}
                placeholder={t(
                  "Describe your brand colors, fonts, style preferences or notes for our design team",
                )}
              />
            </label>
            <div className="brand-tip">
              <Leaf />
              <b>{t("Good content makes design look expensive.")}</b>
            </div>
          </aside>
        </div>
      ) : null}
      {step === 8 ? (
        <div className="pictures">
          <label className="upload">
            <ImagePlus />
            <b>{t("Add pictures")}</b>
            <span>{t("JPG, PNG or WebP · stored safely on this device")}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={addPictures}
            />
          </label>
          {pictures.length ? (
            <div className="picture-grid">
              {pictures.map((p) => (
                <figure key={p.id}>
                  <img src={p.url} alt={p.name} />
                  <figcaption>
                    {p.name}
                    <button
                      onClick={() => delPicture(p.id)}
                      aria-label={`Remove ${p.name}`}
                    >
                      <Trash2 />
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="empty">
              <Upload /> {t("Your visual library is waiting to grow.")}
            </p>
          )}
        </div>
      ) : null}
      {step === 9 ? (
          <Review
            lang={lang}
            project={project}
            pictures={pictures}
            copy={copy}
            download={download}
            sendOrder={sendOrder}
            orderStatus={orderStatus}
            orderMessage={orderMessage}
          />
      ) : null}
    </>
  );
}
function Multi({
  lang,
  items,
  selected,
  update,
  type,
}: {
  lang: Lang;
  items: string[];
  selected: string[];
  update: (v: string[]) => void;
  type: string;
}) {
  const t = (s: string) => translate(lang, s);
  return (
    <div className="option-grid compact selectable-list">
      {items.map((x) => (
        <Choice
          key={x}
          selected={selected.includes(x)}
          onClick={() => update(toggle(selected, x))}
        >
          <span>{t(x)}</span>
          <small>
            {t(
              selected.includes(x)
                ? "Included"
                : type === "section"
                  ? "Add section"
                  : "Add feature",
            )}
          </small>
        </Choice>
      ))}
    </div>
  );
}
function DomainCheck({
  lang,
  value,
  status,
  updateName,
  updateStatus,
}: {
  lang: Lang;
  value: string;
  status: DomainStatus;
  updateName: (v: string) => void;
  updateStatus: (v: DomainStatus) => void;
}) {
  const t = (s: string) => translate(lang, s);
  const normalize = (raw: string) => {
    try {
      return decodeURIComponent(
        new URL(
          /^https?:\/\//i.test(raw.trim())
            ? raw.trim()
            : `https://${raw.trim()}`,
        ).hostname,
      )
        .toLowerCase()
        .replace(/^www\./, "")
        .replace(/\.$/, "");
    } catch {
      return raw.trim().toLowerCase();
    }
  };
  const check = async () => {
    const domain = normalize(value);
    updateName(domain);
    if (
      !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(
        domain,
      )
    ) {
      updateStatus("invalid");
      return;
    }
    updateStatus("checking");
    try {
      const response = await fetch(
        `https://rdap.org/domain/${encodeURIComponent(domain)}`,
        { headers: { Accept: "application/rdap+json" } },
      );
      updateStatus(
        response.ok
          ? "registered"
          : response.status === 404
            ? "possibly-available"
            : "error",
      );
    } catch {
      updateStatus("error");
    }
  };
  const messages: Record<Exclude<DomainStatus, "idle">, string> = {
    checking: "Checking registration…",
    registered: "This domain is already registered.",
    "possibly-available": "No registration found — it may be available.",
    invalid: "Enter a valid domain, for example yourbrand.com.",
    error: "The check could not be completed. Please try again.",
  };
  return (
    <div className="domain-check">
      <label>
        {t("Preferred domain name")}
        <div className="domain-field">
          <input
            value={value}
            onChange={(e) => {
              updateName(e.target.value);
              updateStatus("idle");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void check();
              }
            }}
            placeholder="yourbrand.com"
            inputMode="url"
            autoCapitalize="none"
            spellCheck={false}
          />
          <button
            type="button"
            className="outline"
            onClick={() => void check()}
            disabled={status === "checking"}
          >
            {t(status === "checking" ? "Checking…" : "Check domain")}
          </button>
        </div>
      </label>
      {status !== "idle" ? (
        <p className={`domain-result ${status}`} role="status">
          {t(messages[status])}
        </p>
      ) : null}
      <small>
        {t(
          "Availability is indicative. Confirm availability and price with a domain registrar.",
        )}
      </small>
    </div>
  );
}
function Review({
  lang,
  project,
  pictures,
  copy,
  download,
  sendOrder,
  orderStatus,
  orderMessage,
}: {
  lang: Lang;
  project: Project;
  pictures: Picture[];
  copy: () => void;
  download: () => void;
  sendOrder: () => void | Promise<void>;
  orderStatus: OrderStatus;
  orderMessage: string;
}) {
  const t = (s: string) => translate(lang, s);
  return (
    <div className="review">
      <div
        className="review-hero"
        style={{
          backgroundImage: pictures[0]
            ? `linear-gradient(90deg,var(--c1),transparent),url(${pictures[0].url})`
            : undefined,
        }}
      >
        <small>{project.businessType || t("Business")}</small>
        <h2>
          {project.headline ||
            project.businessName ||
            t("Your BonsAI is ready.")}
        </h2>
        <p>
          {project.subheadline ||
            t("Review the direction and take the specification with you.")}
        </p>
        <button>{project.cta || "Contact us"}</button>
      </div>
      <div className="review-spec">
        <Spec label={t("Order type")} value={project.projectKind} />
        <Spec
          label={t("Estimated delivery")}
          value={deliveryEstimate(project.projectKind, project.features.length)}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Domain")}
          value={project.domainName}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Style")}
          value={project.style}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Colors")}
          value={project.palette}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Typography")}
          value={project.font}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Sections")}
          value={`${project.sections.length}`}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Features")}
          value={`${project.features.length}`}
        />
        <Spec
          empty={t("Not chosen yet")}
          label={t("Pictures")}
          value={`${pictures.length}`}
        />
      </div>
      <div className="review-actions">
        <button className="primary" onClick={copy}>
          <Copy /> {t("Copy specification")}
        </button>
        <button className="outline" onClick={download}>
          <Download /> {t("Download")}
        </button>
        <button
          className="order-button"
          onClick={() => void sendOrder()}
          disabled={orderStatus === "sending"}
        >
          {t(orderStatus === "sending" ? "Sending order…" : "Send order to BonsAi Studio")}{" "}
          <ArrowRight />
        </button>
      </div>
      <p className="order-note">
        {t(
          "This sends the complete brief, delivery estimate, and exact order date and time directly to studio@itbonsai.pl.",
        )}
      </p>
      {orderMessage ? (
        <p className={`order-status ${orderStatus}`} role="status">
          {t(orderMessage)}
        </p>
      ) : null}
    </div>
  );
}
function Spec({
  label,
  value,
  empty = "Not chosen yet",
}: {
  label: string;
  value: string;
  empty?: string;
}) {
  return (
    <div>
      <span>{label}</span>
      <b>{value || empty}</b>
    </div>
  );
}
function Help({ lang }: { lang: Lang }) {
  const t = (s: string) => translate(lang, s);
  return (
    <>
      <Brand />
      <span className="kicker">{t("Workshop help")}</span>
      <h2>{t("We are here while you grow.")}</h2>
      <p>
        {t(
          "You do not need design terminology. Choose what feels right and BonsAi Studio will translate it into a professional website direction.",
        )}
      </p>
      <div className="contact-list">
        <a href="mailto:studio@itbonsai.pl">studio@itbonsai.pl</a>
        <a href="tel:+48501476124">+48 501 476 124</a>
        <a href="https://wa.me/48501476124" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <span>Gdańsk · Polska</span>
      </div>
      <a
        className="primary"
        href="https://itbonsai.pl"
        target="_blank"
        rel="noreferrer"
      >
        {t("Visit itbonsai.pl")} <ChevronRight />
      </a>
    </>
  );
}
function Summary({
  lang,
  project,
  growth,
  pictures,
  copy,
  download,
  reset,
}: {
  lang: Lang;
  project: Project;
  growth: number;
  pictures: Picture[];
  copy: () => void;
  download: () => void;
  reset: () => void;
}) {
  const t = (s: string) => translate(lang, s);
  return (
    <>
      <span className="kicker">{t("Your living specification")}</span>
      <h2>{t("My BonsAI")}</h2>
      <div className="summary-growth">
        <span>{t("Growth")}</span>
        <b>{Math.round(growth * 100)}%</b>
        <i>
          <i style={{ width: `${growth * 100}%` }} />
        </i>
      </div>
      <Spec
        empty={t("Not chosen yet")}
        label={t("Business")}
        value={project.businessName}
      />
      <Spec
        empty={t("Not chosen yet")}
        label={t("Domain")}
        value={project.domainName}
      />
      <Spec
        empty={t("Not chosen yet")}
        label={t("Style")}
        value={project.style}
      />
      <Spec
        empty={t("Not chosen yet")}
        label="Palette"
        value={project.palette}
      />
      <Spec
        empty={t("Not chosen yet")}
        label={t("Typography")}
        value={project.font}
      />
      <Spec
        empty={t("Not chosen yet")}
        label={t("Structure")}
        value={`${project.sections.length}`}
      />
      <Spec
        empty={t("Not chosen yet")}
        label={t("Functions")}
        value={`${project.features.length}`}
      />
      <Spec
        empty={t("Not chosen yet")}
        label={t("Pictures")}
        value={`${pictures.length}`}
      />
      <div className="drawer-actions">
        <button className="primary" onClick={copy}>
          <Copy /> {t("Copy specification")}
        </button>
        <button className="outline" onClick={download}>
          <Download /> {t("Download")}
        </button>
        <button className="text-danger" onClick={reset}>
          <RotateCcw /> {t("Start again")}
        </button>
      </div>
    </>
  );
}

