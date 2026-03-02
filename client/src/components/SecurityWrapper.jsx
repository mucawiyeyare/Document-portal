import React, { useEffect, useState, useRef } from 'react';

// Draws a "SCREENSHOT BLOCKED" black canvas and writes it to the clipboard.
// This means even if the OS captures the screen, pasting shows a warning.
const poisonClipboard = async () => {
  try {
    const w = window.screen.width || 1920;
    const h = window.screen.height || 1080;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Warning text
    ctx.fillStyle = '#ff3333';
    ctx.font = `bold ${Math.round(w / 18)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔒 SCREENSHOT BLOCKED', w / 2, h / 2 - 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.round(w / 36)}px Arial`;
    ctx.fillText('Unauthorized capture of protected documents is prohibited.', w / 2, h / 2 + 20);
    ctx.fillText('This incident has been logged.', w / 2, h / 2 + 70);

    // Write the image to clipboard so paste gives the warning, not the doc
    await new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        } catch (_) { /* ClipboardItem may be unavailable in some contexts */ }
        resolve();
      }, 'image/png');
    });
  } catch (_) { /* Silently fail */ }
};

const SecurityWrapper = ({ children, studentName }) => {
  const [obscured, setObscured] = useState(false);
  const obscuredRef = useRef(false);

  const showBlackout = (durationMs = 2500) => {
    obscuredRef.current = true;
    setObscured(true);
    document.body.classList.add('secure-blurred');
    // Overwrite clipboard with the blocked warning image
    poisonClipboard();
    setTimeout(() => {
      obscuredRef.current = false;
      setObscured(false);
      document.body.classList.remove('secure-blurred');
    }, durationMs);
  };

  useEffect(() => {
    // ── 1. Right-click ────────────────────────────────────────────────────────
    const handleContextMenu = (e) => e.preventDefault();

    // ── 2. keydown: block Ctrl combos, F12, PrintScreen ──────────────────────
    const handleKeyDown = (e) => {
      const key = e.key;

      if (e.keyCode === 44 || key === 'PrintScreen' || key === 'Snapshot') {
        e.preventDefault();
        showBlackout(2500);
        return;
      }

      if (e.keyCode === 123) { e.preventDefault(); return; } // F12

      if (e.ctrlKey || e.metaKey) {
        const k = key.toLowerCase();
        if (['s', 'p', 'c', 'a', 'x', 'u'].includes(k)) { e.preventDefault(); }
        if (e.shiftKey && ['s', 'i', 'j'].includes(k)) { e.preventDefault(); }
      }
    };

    // ── 3. keyup: ALSO intercept PrintScreen on keyup (many browsers only
    //              fire keyup for PrtScn, not keydown) ──────────────────────
    const handleKeyUp = (e) => {
      if (e.keyCode === 44 || e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        // The screenshot may have already been taken — poison the clipboard
        showBlackout(2500);
      }
    };

    // ── 4. Drag blocked ───────────────────────────────────────────────────────
    const handleDragStart = (e) => e.preventDefault();

    // ── 5. Copy blocked — replace clipboard with poison ──────────────────────
    const handleCopy = (e) => {
      e.preventDefault();
      try { e.clipboardData?.setData('text/plain', '🔒 PROTECTED'); } catch (_) {}
    };

    // ── 6. Window blur (Snipping Tool, Alt+Tab, external apps) ───────────────
    //    Win+Shift+S captures WITHOUT stealing focus in modern Windows 11,
    //    but we still black out immediately on any blur.
    const handleBlur = () => {
      document.body.classList.add('secure-blurred');
      setObscured(true);
    };
    const handleFocus = () => {
      document.body.classList.remove('secure-blurred');
      // Delay restoring content so any in-flight screenshot captures the blackout
      setTimeout(() => {
        setObscured(false);
        // Poison clipboard in case a screenshot just happened
        poisonClipboard();
      }, 400);
    };

    // ── 7. Page Visibility API — catches tab switch / minimize ───────────────
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        document.body.classList.add('secure-blurred');
        setObscured(true);
      } else {
        document.body.classList.remove('secure-blurred');
        setTimeout(() => { setObscured(false); poisonClipboard(); }, 400);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true); // capture phase
    document.addEventListener('keyup', handleKeyUp, true);     // capture phase
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.body.classList.remove('secure-blurred');
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* ── Full blackout screen ───────────────────────────────────────── */}
      {obscured && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            userSelect: 'none',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '4rem' }}>🔒</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ff4444' }}>
            Screen Capture Blocked
          </span>
          <span style={{ fontSize: '1rem', color: '#94a3b8', textAlign: 'center', maxWidth: 400 }}>
            Capturing protected documents is not allowed.<br />
            Return to the window to continue reading.
          </span>
        </div>
      )}

      {/* ── Watermark (always on, even in capture attempts) ───────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'hidden',
          opacity: 0.13,
          userSelect: 'none',
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            style={{
              transform: 'rotate(-35deg)',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              margin: '45px 35px',
              whiteSpace: 'nowrap',
            }}
          >
            {studentName} — SECURE COPY
          </div>
        ))}
      </div>

      {/* ── Document content ──────────────────────────────────────────── */}
      <div
        className="no-select"
        style={{
          filter: obscured ? 'blur(60px)' : 'none',
          transition: 'filter 0.05s',
          pointerEvents: obscured ? 'none' : 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SecurityWrapper;
