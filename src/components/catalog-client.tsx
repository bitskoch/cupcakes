"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { ProformaSidebar } from "@/components/proforma-sidebar";
import type { CategoryDTO } from "@/types";

// Componente Carrusel integrado
function HeroCarousel() {
  const slides = [
    {
      img: "https://scontent.faqp1-1.fna.fbcdn.net/v/t39.30808-6/575171801_1832906677604218_6560138089749481019_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeF2G93qMpmrJBhzQ_KBIgeJCyRET08jSxILJERPTyNLEnecMAXNX3PS-WefafN8sO-2EwtUxxPoPYUQOPOavGz_&_nc_ohc=q52fXTfySZ4Q7kNvwFotRdW&_nc_oc=Adpm_wwnk074BQWPn8FhP6pUUpLb7B3MQrBwYrFsLLTY0dYQO1WMRNfPvw7i6f8eznGvaW1kMXId2e5XSiwsIl3D&_nc_zt=23&_nc_ht=scontent.faqp1-1.fna&_nc_gid=_Pp8RIxz5tqA1RWwhC6BAQ&_nc_ss=7b2a8&oh=00_AQFQbrel7_z2msjmPIabcqNl1rj0MEzZCXftIJBhHYO9Ng&oe=6A8D0E82",
      text: ["BOCADITOS MÁS SOLICITADOS"],
    },
    {
      img: "https://scontent.faqp1-1.fna.fbcdn.net/v/t39.30808-6/538532780_1774678446760375_5623235912720404268_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFzbyJYSuANyXsif9CYPbDegO9SF1Sin7iA71IXVKKfuEbKKTZX3Mw_3pYWqHwjkUU210I_KRcKltsngOJBYKi1&_nc_ohc=hf7jM4gp9KYQ7kNvwFfk-m5&_nc_oc=AdowKLDQaRx7LOeyZyE5Z95KDqnNozE3HuRaYmTN8dEKQeWzI0c6ctWJPTXHVWGJwl5pHdZYalxIIe24Ll2nS8xM&_nc_zt=23&_nc_ht=scontent.faqp1-1.fna&_nc_gid=iXH5tEmbQo_g2306UNrJ9w&_nc_ss=7b2a8&oh=00_AQHwbougghiiv32JFSzk-xo99TPH410OaviDpmIrSKoIvA&oe=6A8CDF4B",
      text: ["SILENCE SPEAKS", "THROUGH FORM"],
    },
    {
      img: "https://scontent.faqp3-1.fna.fbcdn.net/v/t39.30808-6/486378922_1641677863393768_4148504548128592069_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1542&ctp=s2048x1542&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH7m-xl7NYy4pC4TRAdMNupJLVvlsgnH8AktW-WyCcfwA10iIHEJDlpUFXpArJlHwge8gIpz1NrjNRPIb6y71Qz&_nc_ohc=jeNqMuFZfccQ7kNvwGKonTg&_nc_oc=AdqOpuuPeH41R_z2sk_-84h0URR3fSYh6-q1t76TqzlxsnuFGT1J3HH3NVAd4Sv6YOXtRfOTCkPD3Im847mt-JUH&_nc_zt=23&_nc_ht=scontent.faqp3-1.fna&_nc_gid=Nnp-1SdiGmUp-pb3Be2Qew&_nc_ss=7b2a8&oh=00_AQH9LQkvvL7zI37MdCRoxBC0jBf8ZgvEXvF09OHSRqEmbQ&oe=6A8CE30E",
      text: ["ESSENCE BEYOND", "PERCEPTION"],
    },
    {
      img: "https://scontent.faqp1-1.fna.fbcdn.net/v/t39.30808-6/607179365_1886610962233789_1776281329196418208_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFFifkKw-usdSN66LOR5L-nRJuYjL6D0PJEm5iMvoPQ8qepGfHKkeANDA92DwevAl_mEvFcBxdX8jmO9rB2Up3t&_nc_ohc=qlg9oPo8nmoQ7kNvwHJZh6o&_nc_oc=AdqKSiG6yue3qYX_7CCoK32A5xqGp2MTEV3V7wGO5VzF0wSqJLjt0e3rdPPrsnpZm0M5EQ1oAkcKqL7hTbdhcs99&_nc_zt=23&_nc_ht=scontent.faqp1-1.fna&_nc_gid=Q_K94WSjzcV_lxppdKdM-w&_nc_ss=7b2a8&oh=00_AQHwnNtMNnRqZ5m3RIBXOjZM0pbAbxBwg8zxBZ8o_8LvaA&oe=6A8CEE46",
      text: ["TRUTH IN", "EMPTINESS"],
    },
    {
      img: "https://scontent.faqp1-1.fna.fbcdn.net/v/t39.30808-6/744598089_2060455634849320_3521571872725354145_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGfHwx6LOF8e3UYmMx0iJHVDdqTyv1nGc8N2pPK_WcZzzNPSRbHK6_1een51IcynsvZEiOOCo9uSuaaZg_d0cU4&_nc_ohc=72ufpj7tFPcQ7kNvwHVFP6Z&_nc_oc=AdpOKEwqmwsAADN9pItjvsp8HJb3HSC8sMsQkuL8Zvr-xhfEc-Gsg1XCOWOr87VTLQNuedbUCCz6eK2aKVjTAOxQ&_nc_zt=23&_nc_ht=scontent.faqp1-1.fna&_nc_gid=bp4IKmkahYAjPECSYuy9Rg&_nc_ss=7b2a8&oh=00_AQFWAXceCuG1jblcJ2F01b5v5xxuoQEeeD5iZa6CJWMU4g&oe=6A8D0423",
      text: ["SURRENDER TO", "THE VOID"],
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl h-[300px] sm:h-[400px] md:h-[500px] w-full">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.img}
            alt={`Slide ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            {slide.text.map((t, j) => (
              <span
                key={j}
                className={cn(
                  "font-bold text-center",
                  j === 0
                    ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                    : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        aria-label="Anterior"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        aria-label="Siguiente"
      >
        →
      </button>

      {/* Contador de diapositivas */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
        0{current + 1} / 0{slides.length}
      </div>

      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
              i === current
                ? "bg-white w-4 sm:w-6"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Ir a diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function CatalogClient({ categories }: { categories: CategoryDTO[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");

  const current = categories.find((c) => c.id === activeCategory);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      {/* Carrusel */}
      <HeroCarousel />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="mb-4 text-2xl font-bold text-pink-700">Nuestros Productos</h1>

          {/* Tabs de categoría */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 rounded-full border border-border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors whitespace-nowrap",
                  cat.id === activeCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent hover:bg-accent"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          {current && current.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {current.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no hay productos en esta categoría.
            </p>
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:h-fit">
          <ProformaSidebar />
        </div>
      </div>
    </div>
  );
}