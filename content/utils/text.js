export function simplifyText(text, level = 3) {
  const maxLen = Math.max(60, 180 - level * 20);
  return text
    .split(/([.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.length > maxLen ? s.slice(0, maxLen) + "…" : s)
    .join(" ");
}

export function neutralizeHeadline(text, maxLen = 60) {
  let t = text.replace(/(!|\?|BREAKING|AMAZING|INSANE|SHOCKING)/gi, "").trim();
  if (t.length > maxLen) t = t.slice(0, maxLen) + "…";
  return t;
}

