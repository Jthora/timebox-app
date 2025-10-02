import { useEffect, useState } from "react";

const FONT_CHECK_STRING = '16px "Apple Color Emoji", "Segoe UI Emoji", system-ui, sans-serif';
const FALLBACK_TEXT = "[]";

export function useEmojiSupport(emoji: string): boolean {
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    let probeNodes: HTMLElement[] = [];

    const updateSupport = (value: boolean) => {
      if (!isCancelled) {
        setSupported(value);
      }
    };

    const measureWithFallback = () => {
      try {
        const container = document.createElement('div');
        container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;white-space:nowrap;';

        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = emoji;
        const fallbackSpan = document.createElement('span');
        fallbackSpan.textContent = FALLBACK_TEXT;

        container.appendChild(emojiSpan);
        container.appendChild(fallbackSpan);
        document.body.appendChild(container);
        probeNodes = [emojiSpan, fallbackSpan, container];

        const emojiWidth = emojiSpan.getBoundingClientRect().width;
        const fallbackWidth = fallbackSpan.getBoundingClientRect().width;

        if (!emojiWidth && !fallbackWidth) {
          // If the environment can't measure widths (e.g. jsdom), default to false
          updateSupport(false);
          return;
        }

        updateSupport(emojiWidth !== fallbackWidth || emojiWidth > 0);
      } catch {
        updateSupport(false);
      }
    };

    const runDetection = async () => {
      if (typeof document === 'undefined') {
        updateSupport(false);
        return;
      }

      const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fontSet && typeof fontSet.check === 'function') {
        try {
          const ready = fontSet.ready instanceof Promise ? fontSet.ready : Promise.resolve();
          await ready;
          updateSupport(fontSet.check(FONT_CHECK_STRING, emoji));
          return;
        } catch {
          // fall through to DOM measurement
        }
      }

      measureWithFallback();
    };

    runDetection();

    return () => {
      isCancelled = true;
      probeNodes.forEach((node) => {
        if (node.parentNode) {
          node.parentNode.removeChild(node as Node);
        }
      });
    };
  }, [emoji]);

  return supported;
}

export default useEmojiSupport;