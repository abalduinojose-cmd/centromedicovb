/** Gráficos leves em SVG/CSS para o Painel Gerencial (sem dependências). */

/** Barras verticais. dados: [{ rotulo, valor }] */
export function BarrasVerticais({ dados, cor = '#1C2B92', formato = (v) => v }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div className="flex h-40 items-end gap-2">
      {dados.map((d, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-1" title={`${d.rotulo}: ${formato(d.valor)}`}>
          <span className="text-[9px] font-semibold text-text-dark/60 opacity-0 transition-opacity group-hover:opacity-100">
            {formato(d.valor)}
          </span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${Math.max((d.valor / max) * 100, d.valor > 0 ? 4 : 1)}%`, background: cor, opacity: d.valor > 0 ? 1 : 0.15 }}
          />
          <span className="text-[9px] text-text-dark/45">{d.rotulo}</span>
        </div>
      ))}
    </div>
  );
}

/** Barras horizontais ranqueadas. dados: [{ rotulo, valor, detalhe? }] */
export function BarrasHorizontais({ dados, cor = '#E60B18', formato = (v) => v }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div className="space-y-2.5">
      {dados.length === 0 && <p className="py-4 text-center text-xs text-text-dark/40">Sem dados no período.</p>}
      {dados.map((d, i) => (
        <div key={i}>
          <div className="mb-0.5 flex items-baseline justify-between gap-2 text-[11px]">
            <span className="truncate font-medium text-text-dark/75">{d.rotulo}</span>
            <span className="shrink-0 font-display font-bold text-navy">{formato(d.valor)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-support">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.valor / max) * 100}%`, background: cor }} />
          </div>
          {d.detalhe && <p className="mt-0.5 text-[9.5px] text-text-dark/40">{d.detalhe}</p>}
        </div>
      ))}
    </div>
  );
}

/** Rosca com legenda. dados: [{ rotulo, valor, cor }] */
export function Donut({ dados, centro }) {
  const total = dados.reduce((s, d) => s + d.valor, 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let acumulado = 0;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 110 110" className="h-32 w-32 shrink-0" role="img" aria-label="Distribuição">
        <circle cx="55" cy="55" r={R} fill="none" stroke="#F1F3F9" strokeWidth="14" />
        {total > 0 &&
          dados.filter((d) => d.valor > 0).map((d, i) => {
            const frac = d.valor / total;
            const el = (
              <circle
                key={i}
                cx="55" cy="55" r={R} fill="none"
                stroke={d.cor} strokeWidth="14"
                strokeDasharray={`${frac * C} ${C}`}
                strokeDashoffset={-acumulado * C}
                transform="rotate(-90 55 55)"
                strokeLinecap="butt"
              />
            );
            acumulado += frac;
            return el;
          })}
        <text x="55" y="52" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1C2B92" fontFamily="Poppins, sans-serif">
          {total}
        </text>
        <text x="55" y="66" textAnchor="middle" fontSize="7.5" fill="#7A8294">
          {centro}
        </text>
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {dados.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-[11px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: d.cor }} />
            <span className="truncate text-text-dark/70">{d.rotulo}</span>
            <span className="ml-auto font-display font-bold text-navy">{d.valor}</span>
            <span className="w-9 text-right text-text-dark/40">{total ? Math.round((d.valor / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Área/linha simples. dados: [{ rotulo, valor }] */
export function Area({ dados, cor = '#16A34A', formato = (v) => v }) {
  const W = 300, H = 90, PAD = 4;
  const max = Math.max(...dados.map((d) => d.valor), 1);
  const passo = (W - PAD * 2) / Math.max(dados.length - 1, 1);
  const pts = dados.map((d, i) => [PAD + i * passo, H - PAD - (d.valor / max) * (H - PAD * 2)]);
  const linha = pts.map((p) => p.join(',')).join(' ');
  const areaPath = `${PAD},${H - PAD} ${linha} ${PAD + (dados.length - 1) * passo},${H - PAD}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Evolução">
        <polygon points={areaPath} fill={cor} opacity="0.12" />
        <polyline points={linha} fill="none" stroke={cor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#fff" stroke={cor} strokeWidth="2">
            <title>{`${dados[i].rotulo}: ${formato(dados[i].valor)}`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between px-1 text-[9px] text-text-dark/45">
        {dados.map((d, i) => <span key={i}>{d.rotulo}</span>)}
      </div>
    </div>
  );
}
