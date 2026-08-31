import React, { useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { ArrowRight } from "lucide-react";
import "./prototype.css";

type Slide = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  position: string;
  accent: string;
};

const slides: Slide[] = [
  {
    id: "01",
    title: "Stillness by Design",
    category: "Japanese Minimal",
    description: "Calm, intentional, timeless. Every decision shapes the tree.",
    image: "/bonsai-hero-foreground-v2.png",
    position: "center",
    accent: "#e8c27b",
  },
  {
    id: "02",
    title: "Architecture of Shadow",
    category: "Style Grove",
    description: "Precision in form, structural harmony with nature and light.",
    image: "/garden-central.png",
    position: "center",
    accent: "#c49143",
  },
  {
    id: "03",
    title: "A Retreat in Balance",
    category: "Sections Path",
    description: "Choose sections by looking at rhythm, space and visual confidence.",
    image: "/concepts/sections-path.png",
    position: "center",
    accent: "#f0dfbd",
  },
  {
    id: "04",
    title: "Quiet Motion",
    category: "Effects Pond",
    description: "Subtle transitions, soft reveals and cinematic focus without noise.",
    image: "/concepts/effects-shrine.png",
    position: "center",
    accent: "#d9b36b",
  },
  {
    id: "05",
    title: "Rooted in Content",
    category: "Content Garden",
    description: "Logo, images, words and offer details gathered into one clear brief.",
    image: "/concepts/content-garden.png",
    position: "center",
    accent: "#b7d29d",
  },
];

const navItems = ["Style", "Sections", "Effects", "Features"];

function BonsaiGarden() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  const theme = useMemo(
    () => ({ "--accent": slide.accent, "--position": slide.position }) as React.CSSProperties,
    [slide.accent, slide.position],
  );

  const previous = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <main className="studio-hero" style={theme}>
      <div className="slide-media" key={slide.id}>
        <img src={slide.image} alt={slide.title} />
        <div className="slide-grade" />
      </div>

      <nav className="studio-nav" aria-label="Bonsai Garden navigation">
        <a href="/prototype" className="studio-brand">
          Bonsai Studio
        </a>
        <div>
          {navItems.map((item) => (
            <a href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </div>
        <button>My Bonsai</button>
      </nav>

      <section className="studio-copy" aria-label="Selected Bonsai direction">
        <span>
          {slide.id} / 0{slides.length} — {slide.category}
        </span>
        <h1>{slide.title}</h1>
        <p>{slide.description}</p>
        <a href="#enter">
          Enter the Garden <ArrowRight />
        </a>
      </section>

      <section className="quiet-carousel" aria-label="Choose design direction">
        <button onClick={previous} aria-label="Previous slide">
          Prev
        </button>
        <span>
          {slide.id} / 0{slides.length}
        </span>
        <button onClick={next} aria-label="Next slide">
          Next
        </button>
      </section>

      <div className="slide-dots" aria-label="Slide selector">
        {slides.map((item, index) => (
          <button
            key={item.id}
            className={index === currentIndex ? "active" : ""}
            onClick={() => goTo(index)}
            aria-label={`Show ${item.title}`}
          >
            <span>{item.id}</span>
          </button>
        ))}
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BonsaiGarden />
  </React.StrictMode>,
);
