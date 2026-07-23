import { ImageResponse } from "next/og";

/**
 * Gedeelde generator voor de social-share-afbeelding (OpenGraph + Twitter).
 * On-brand, zonder externe assets, zodat elke gedeelde link er verzorgd
 * uitziet. Geen verzonnen claims; alleen de propositie en de onderwerpen.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const CHIPS = [
  "Energiebesparingsplicht",
  "Energielabel C",
  "Netcongestie",
  "Zakelijke batterij",
];

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0e5a4f 0%, #0a4239 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(24,169,120,0.22)",
          }}
        />
        {/* Merkregel */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#18a978",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            🏢
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#ffffff" }}>
            <span>Pand</span>
            <span style={{ color: "#f2bb4a" }}>Plicht</span>
          </div>
        </div>

        {/* Propositie */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: 940,
            }}
          >
            Ken de energie- en verduurzamingsplichten van uw bedrijfspand
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#bceedc", maxWidth: 900 }}>
            Gratis indicatieve check, helder uitgelegd en met officiële bronnen.
          </div>
        </div>

        {/* Onderwerp-chips + domein */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {CHIPS.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 22px",
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#ffffff",
                  fontSize: 26,
                  fontWeight: 600,
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#f2bb4a" }} />
                {c}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#ffffff" }}>
            pandplicht.nl
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
