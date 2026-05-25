import { useEffect, useRef, useState } from "react";

interface Suggestion {
  label: string;
  lat: number;
  lng: number;
}

interface AddressSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}

// NYC Planning Labs GeoSearch — free, no API key, excellent NYC address data
async function searchNYC(query: string): Promise<Suggestion[]> {
  if (query.trim().length < 3) return [];
  try {
    const resp = await fetch(
      `https://geosearch.planninglabs.nyc/v2/search?text=${encodeURIComponent(query)}&size=6`,
      { headers: { Accept: "application/json" } }
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.features || []).map((f: any) => ({
      label: f.properties.label as string,
      lng: f.geometry.coordinates[0] as number,
      lat: f.geometry.coordinates[1] as number,
    }));
  } catch {
    return [];
  }
}

export default function AddressSearch({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing an address…",
  style,
  autoFocus,
}: AddressSearchProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (raw: string) => {
    onChange(raw);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (raw.trim().length < 3) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchNYC(raw);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 300);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.label);
    onSelect(s.label, s.lat, s.lng);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={style}
      />
      {loading && (
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "#9ca3af" }}>
          …
        </div>
      )}
      {open && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "white",
            border: "2px solid #e5e7eb",
            borderRadius: 10,
            zIndex: 300,
            maxHeight: 220,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: 500,
                color: "#374151",
                borderBottom: i < suggestions.length - 1 ? "1px solid #f3f4f6" : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
