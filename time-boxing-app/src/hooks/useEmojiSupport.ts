import { useEffect, useState } from "react";

/**
 * Detects whether a given emoji is likely supported/rendered with a distinct glyph.
 * Heuristic: measure canvas width of the emoji vs width of a fallback token ("[]").
 * If widths are identical, we assume the emoji isn't rendered (common on systems without emoji fonts).
 */
export function useEmojiSupport(emoji: string): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setSupported(false);
        return;
      }
      ctx.font = '16px system-ui, sans-serif';
      const control = ctx.measureText('[]').width;
      const target = ctx.measureText(emoji).width;
      // Some unsupported emojis return roughly the same width as generic chars
      if (!target || target === control) {
        setSupported(false);
      }
    } catch {
      setSupported(false);
    }
  }, [emoji]);

  return supported;
}

export default useEmojiSupport;