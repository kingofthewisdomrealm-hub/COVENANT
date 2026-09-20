/**
 * Styles for the assistant, scoped under .cva so nothing leaks into the
 * marketing site. Same tokens as the visual models (navy / sand / stone).
 */
export const assistantStyles = `
.cva{ --navy:#0c1120; --navy-2:#12182b; --navy-3:#1c2438; --line:rgba(212,188,150,0.18); --sand:#c4a574; --sand-light:#d4bc96; --spark:#7dd3fc; --outside:#f0a1c8; --go:#8fd3a8; --stop:#f08a8a; --stone:#f3f0ea; --stone-muted:#a79e8f; --stone-faint:#655d51; --mono:"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  position:fixed; inset:0; z-index:90; background:var(--navy); color:var(--stone); font-family:var(--font-sans), system-ui, sans-serif; overflow:hidden; }
.cva *{ box-sizing:border-box; }
.cva ::selection{ background:var(--sand); color:var(--navy); }
.cva .cva-scene{ position:absolute; inset:0; width:100%; height:100%; display:block; z-index:0; background:#0c1120; }
.cva .cva-panel{ position:absolute; left:18px; top:18px; bottom:18px; width:min(440px, calc(100% - 36px)); z-index:3; display:flex; flex-direction:column; background:linear-gradient(180deg, rgba(28,36,56,0.82), rgba(12,17,32,0.78)); border:1px solid var(--line); border-radius:16px; backdrop-filter:blur(10px); box-shadow:0 30px 60px -24px rgba(0,0,0,.75); overflow:hidden; }
.cva .cva-head{ padding:.9rem 1rem .7rem; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; gap:.6rem; }
.cva .cva-head h1{ font-family:var(--font-display), Georgia, serif; font-weight:600; font-size:1.15rem; margin:0; line-height:1.1; }
.cva .cva-head .sub{ font-family:var(--mono); font-size:.62rem; letter-spacing:.18em; text-transform:uppercase; color:var(--stone-faint); margin-top:.25rem; }
.cva .cva-head .sub b{ color:var(--sand); font-weight:600; }
.cva .btns{ display:flex; gap:.35rem; flex:0 0 auto; }
.cva .btns button{ font:inherit; font-family:var(--mono); font-size:.64rem; letter-spacing:.14em; text-transform:uppercase; color:var(--sand); background:none; border:1px solid var(--line); border-radius:100px; padding:.4rem .7rem; cursor:pointer; white-space:nowrap; }
.cva .btns button.on{ background:var(--sand); color:var(--navy); }
.cva .btns .b-models{ color:var(--spark); } .cva .btns .b-models.on{ background:var(--spark); }
.cva .btns .b-load{ color:var(--stone-muted); } .cva .btns .b-load.on{ background:var(--stone-muted); }
.cva .cva-ctx{ display:flex; gap:.35rem; flex-wrap:wrap; padding:.55rem 1rem; border-bottom:1px solid var(--line); min-height:2.3rem; align-items:center; }
.cva .cva-ctx .k{ font-family:var(--mono); font-size:.58rem; letter-spacing:.16em; text-transform:uppercase; color:var(--stone-faint); margin-right:.2rem; }
.cva .cchip{ font-family:var(--mono); font-size:.62rem; color:var(--stone); border:1px solid rgba(125,211,252,.55); background:rgba(12,17,32,.7); border-radius:6px; padding:.14rem .42rem; white-space:nowrap; max-width:180px; overflow:hidden; text-overflow:ellipsis; }
.cva .cchip.tool{ border-color:rgba(240,161,200,.7); } .cva .cchip.goal{ border-color:rgba(196,165,116,.8); } .cva .cchip.done{ border-color:rgba(143,211,168,.8); }
.cva .cva-log{ flex:1; overflow-y:auto; padding:.9rem 1rem; display:flex; flex-direction:column; gap:.65rem; }
.cva .msg{ max-width:96%; font-size:.95rem; line-height:1.5; padding:.6rem .8rem; border-radius:12px; white-space:pre-wrap; word-wrap:break-word; }
.cva .msg.user{ align-self:flex-end; background:rgba(196,165,116,.16); border:1px solid rgba(196,165,116,.35); border-bottom-right-radius:4px; }
.cva .msg.bot{ align-self:flex-start; background:rgba(12,17,32,.6); border:1px solid var(--line); border-bottom-left-radius:4px; }
.cva .msg.bot.thinking{ color:var(--stone-muted); font-style:italic; }
.cva .msg.bot b{ color:var(--sand-light); }
.cva .act{ align-self:flex-start; font-family:var(--mono); font-size:.64rem; color:var(--stone-muted); display:flex; align-items:center; gap:.45rem; padding:.1rem .2rem; }
.cva .act i{ width:7px; height:7px; border-radius:50%; background:var(--outside); box-shadow:0 0 8px var(--outside); flex:0 0 auto; }
.cva .act.ok i{ background:var(--go); box-shadow:0 0 8px var(--go); } .cva .act.err i{ background:var(--stop); box-shadow:0 0 8px var(--stop); }
.cva .gate{ align-self:stretch; border:1px solid rgba(143,211,168,.6); background:rgba(143,211,168,.08); border-radius:12px; padding:.7rem .8rem; }
.cva .gate .t{ font-family:var(--mono); font-size:.62rem; letter-spacing:.18em; text-transform:uppercase; color:var(--go); margin-bottom:.35rem; }
.cva .gate .body{ font-size:.92rem; line-height:1.45; } .cva .gate .body b{ color:var(--stone); } .cva .gate .k{ color:var(--stone-muted); }
.cva .gate .row{ display:flex; gap:.5rem; margin-top:.6rem; }
.cva .gate button{ font:inherit; font-family:var(--mono); font-size:.66rem; letter-spacing:.12em; text-transform:uppercase; border-radius:100px; padding:.42rem .8rem; cursor:pointer; border:1px solid var(--line); background:none; color:var(--stone-muted); }
.cva .gate button.yes{ background:var(--go); color:var(--navy); border-color:var(--go); }
.cva .gate.decided{ opacity:.6; }
.cva .card{ align-self:stretch; border:1px solid rgba(125,211,252,.45); background:rgba(12,17,32,.7); border-radius:12px; padding:.7rem .8rem; font-size:.88rem; line-height:1.45; }
.cva .card .t{ font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; text-transform:uppercase; color:var(--spark); margin-bottom:.35rem; display:flex; justify-content:space-between; gap:.5rem; }
.cva .card .t .band{ color:var(--sand); } .cva .card .t .band.likely{ color:var(--stop); } .cva .card .t .band.possible{ color:var(--sand); } .cva .card .t .band.low{ color:var(--go); }
.cva .card h3{ font-family:var(--font-display), Georgia, serif; font-weight:600; font-size:1rem; margin:0 0 .3rem; color:var(--stone); }
.cva .card .meter{ height:6px; border-radius:3px; background:rgba(243,240,234,.08); overflow:hidden; margin:.4rem 0 .5rem; }
.cva .card .meter i{ display:block; height:100%; background:linear-gradient(90deg, var(--go), var(--sand), var(--stop)); transition:width .9s ease; }
.cva .card ul{ margin:.3rem 0 0; padding-left:1.1rem; } .cva .card li{ margin:.12rem 0; }
.cva .card .row{ display:flex; flex-wrap:wrap; gap:.3rem; margin:.3rem 0; }
.cva .card .pill{ font-family:var(--mono); font-size:.6rem; color:var(--stone); border:1px solid rgba(212,188,150,.4); border-radius:6px; padding:.1rem .4rem; }
.cva .card .fine{ font-size:.72rem; color:var(--stone-faint); margin-top:.5rem; line-height:1.35; }
.cva .card .k{ color:var(--stone-muted); }
.cva .card a{ color:var(--spark); }
.cva .prog{ border-top:1px dashed rgba(212,188,150,.14); padding:.4rem 0; } .cva .prog b{ color:var(--stone); }
.cva .prog .m{ font-family:var(--mono); font-size:.6rem; color:var(--stone-muted); } .cva .prog .st{ color:var(--go); } .cva .prog .st.off{ color:var(--stone-faint); }
.cva .cva-note{ margin:0 1rem .6rem; font-size:.8rem; color:var(--stop); }
.cva .cva-hint{ font-family:var(--mono); font-size:.6rem; color:var(--stone-faint); padding:0 1rem .6rem; letter-spacing:.04em; }
.cva .cva-hint button{ font:inherit; color:var(--sand); background:none; border:0; border-bottom:1px dotted var(--sand); padding:0; cursor:pointer; }
.cva .cva-compose{ border-top:1px solid var(--line); padding:.7rem .8rem; display:flex; gap:.5rem; align-items:flex-end; }
.cva .cva-compose textarea{ flex:1; resize:none; font:inherit; font-size:.95rem; color:var(--stone); background:rgba(12,17,32,.7); border:1px solid var(--line); border-radius:10px; padding:.55rem .7rem; min-height:44px; max-height:140px; outline:none; }
.cva .cva-compose textarea:focus{ border-color:rgba(125,211,252,.6); }
.cva .cva-compose button{ font:inherit; font-family:var(--mono); font-size:.66rem; letter-spacing:.14em; text-transform:uppercase; border-radius:100px; padding:.7rem .9rem; cursor:pointer; border:0; }
.cva .cva-compose .send{ background:var(--sand); color:var(--navy); } .cva .cva-compose .send:disabled{ opacity:.45; cursor:default; }
.cva .cva-compose .stop{ background:none; border:1px solid var(--stop); color:var(--stop); }
.cva .cva-drawer{ position:absolute; right:18px; top:18px; z-index:3; width:min(380px, calc(100% - 36px)); max-height:calc(100% - 36px); overflow:auto; background:linear-gradient(180deg, rgba(28,36,56,0.86), rgba(12,17,32,0.82)); border:1px solid var(--line); border-radius:16px; padding:.9rem 1rem; backdrop-filter:blur(10px); }
.cva .cva-drawer.wide{ width:min(440px, calc(100% - 36px)); }
.cva .cva-drawer h2{ font-family:var(--font-display), Georgia, serif; font-weight:600; font-size:1rem; margin:0 0 .2rem; }
.cva .cva-drawer .sub{ font-family:var(--mono); font-size:.6rem; letter-spacing:.16em; text-transform:uppercase; color:var(--stone-faint); margin-bottom:.6rem; }
.cva .cva-drawer p{ font-size:.86rem; line-height:1.45; color:var(--stone-muted); margin:.3rem 0 .5rem; } .cva .cva-drawer p b{ color:var(--stone); }
.cva .cva-drawer .empty{ color:var(--stone-muted); font-size:.88rem; }
.cva .lead{ border-top:1px dashed rgba(212,188,150,.14); padding:.5rem 0; font-size:.88rem; line-height:1.4; }
.cva .lead b{ color:var(--stone); } .cva .lead .m{ font-family:var(--mono); font-size:.62rem; color:var(--stone-muted); } .cva .lead .why{ color:var(--stone-muted); font-size:.82rem; }
.cva .badge{ display:inline-block; font-family:var(--mono); font-size:.58rem; letter-spacing:.14em; text-transform:uppercase; color:var(--outside); border:1px solid rgba(240,161,200,.5); border-radius:6px; padding:.1rem .4rem; margin-left:.4rem; }
.cva .grp{ font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; text-transform:uppercase; color:var(--sand); margin:.7rem 0 .2rem; }
.cva .mcard{ border-top:1px dashed rgba(212,188,150,.14); padding:.5rem 0; font-size:.86rem; line-height:1.4; display:flex; gap:.6rem; align-items:flex-start; }
.cva .mcard .ic{ flex:0 0 34px; height:34px; border-radius:8px; border:1px solid rgba(125,211,252,.5); display:flex; align-items:center; justify-content:center; font-family:var(--mono); font-size:.62rem; color:var(--spark); background:rgba(125,211,252,.08); }
.cva .mcard.tool .ic{ border-color:rgba(240,161,200,.6); color:var(--outside); background:rgba(240,161,200,.08); }
.cva .mcard b{ color:var(--stone); display:block; } .cva .mcard .what{ color:var(--stone-muted); font-size:.8rem; }
.cva .mcard .act2{ margin-top:.25rem; display:flex; gap:.6rem; font-family:var(--mono); font-size:.6rem; letter-spacing:.06em; }
.cva .mcard .act2 a, .cva .mcard .act2 button{ font:inherit; color:var(--spark); background:none; border:0; padding:0; text-decoration:none; border-bottom:1px dotted rgba(125,211,252,.5); cursor:pointer; }
.cva .mcard.tool .act2 button{ color:var(--outside); border-color:rgba(240,161,200,.5); }
.cva .paste{ width:100%; min-height:130px; resize:vertical; font:inherit; font-family:var(--mono); font-size:.72rem; color:var(--stone); background:rgba(12,17,32,.7); border:1px solid var(--line); border-radius:10px; padding:.5rem .6rem; outline:none; }
.cva .paste:focus{ border-color:rgba(125,211,252,.6); }
.cva .preview{ font-family:var(--mono); font-size:.66rem; color:var(--stone-muted); margin:.5rem 0; line-height:1.5; } .cva .preview b{ color:var(--go); } .cva .preview .bad{ color:var(--stop); }
.cva .cva-drawer .row{ display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; }
.cva .cva-drawer label{ font-size:.8rem; color:var(--stone-muted); display:flex; align-items:center; gap:.35rem; }
.cva .cva-drawer .go{ font:inherit; font-family:var(--mono); font-size:.66rem; letter-spacing:.12em; text-transform:uppercase; border-radius:100px; padding:.5rem .9rem; cursor:pointer; border:0; background:var(--go); color:var(--navy); }
.cva .cva-drawer .go:disabled{ opacity:.4; cursor:default; }
.cva .cva-lap{ position:absolute; right:18px; bottom:16px; z-index:2; font-family:var(--mono); font-size:.66rem; letter-spacing:.2em; text-transform:uppercase; color:var(--sand); opacity:.85; pointer-events:none; text-align:right; line-height:1.6; }
.cva .cva-lap span{ color:var(--stone-faint); display:block; letter-spacing:.1em; }
@media (max-width:720px){ .cva .cva-panel{ width:calc(100% - 36px); } }
`
