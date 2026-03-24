import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
 
const FIIS = [
  { ticker: "KNCR11", peso: 16.67, valor: 1667, dyMensal: 1.12, cota: 104.55 },
  { ticker: "XPML11", peso: 13.33, valor: 1333, dyMensal: 0.84, cota: 109.83 },
  { ticker: "MCRE11", peso: 13.33, valor: 1333, dyMensal: 1.14, cota: 9.63 },
  { ticker: "BTHF11", peso: 13.33, valor: 1333, dyMensal: 1.08, cota: 9.38 },
  { ticker: "VILG11", peso: 6.67, valor: 667, dyMensal: 0.83, cota: 99.27 },
  { ticker: "VGIA11", peso: 3.33, valor: 333, dyMensal: 1.47, cota: 9.90 },
  { ticker: "MCCI11", peso: 16.67, valor: 1667, dyMensal: 1.00, cota: 95.49 },
  { ticker: "BTLG11", peso: 13.33, valor: 1333, dyMensal: 0.81, cota: 103.09 },
  { ticker: "SNAG11", peso: 3.33, valor: 333, dyMensal: 1.00, cota: 10.20 },
];
 
const ACOES = [
  { ticker: "ITUB4", peso: 18, valor: 1800, dyAnual: 7.3, cota: 43.00 },
  { ticker: "ITSA4", peso: 15, valor: 1500, dyAnual: 7.9, cota: 13.99 },
  { ticker: "BBSE3", peso: 15, valor: 1500, dyAnual: 13.0, cota: 34.88 },
  { ticker: "PETR4", peso: 13, valor: 1300, dyAnual: 7.1, cota: 45.58 },
  { ticker: "CPLE3", peso: 13, valor: 1300, dyAnual: 8.7, cota: 14.17 },
  { ticker: "TAEE11", peso: 12, valor: 1200, dyAnual: 10.5, cota: 43.14 },
  { ticker: "CMIG4", peso: 9, valor: 900, dyAnual: 9.8, cota: 10.50 },
  { ticker: "CURY3", peso: 5, valor: 500, dyAnual: 12.0, cota: 36.49 },
];
 
const APORTE_MENSAL = 3000;
const APORTE_FII = 1500;
const APORTE_ACAO = 1500;
const INICIAL_FII = 10000;
const INICIAL_ACAO = 10000;
 
const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtK = (v) => {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  return `R$ ${(v / 1000).toFixed(1)}k`;
};
const pct = (v) => `${v.toFixed(2)}%`;
 
function simulate(anos) {
  const fiiDyMensal = FIIS.reduce((s, f) => s + (f.peso / 100) * f.dyMensal, 0) / 100;
  const acaoDyAnual = ACOES.reduce((s, a) => s + (a.peso / 100) * a.dyAnual, 0) / 100;
  const acaoDyMensal = Math.pow(1 + acaoDyAnual, 1 / 12) - 1;
 
  const totalMeses = anos * 12;
  const data = [];
 
  let fiiPat = INICIAL_FII;
  let acaoPat = INICIAL_ACAO;
  let fiiDivAcum = 0;
  let acaoDivAcum = 0;
  let totalAportado = INICIAL_FII + INICIAL_ACAO;
 
  data.push({
    ano: 0, mes: 0,
    fiiPat: INICIAL_FII, acaoPat: INICIAL_ACAO, total: INICIAL_FII + INICIAL_ACAO,
    fiiDivAno: 0, acaoDivAno: 0, divAnoTotal: 0,
    fiiDivAcum: 0, acaoDivAcum: 0, divAcumTotal: 0,
    totalAportado,
    ganhoLiquido: 0,
  });
 
  let fiiDivAnoCorrente = 0;
  let acaoDivAnoCorrente = 0;
 
  for (let m = 1; m <= totalMeses; m++) {
    // 1. Aporte mensal
    fiiPat += APORTE_FII;
    acaoPat += APORTE_ACAO;
    totalAportado += APORTE_MENSAL;
 
    // 2. Dividendos do mês
    const fiiDiv = fiiPat * fiiDyMensal;
    const acaoDiv = acaoPat * acaoDyMensal;
 
    // 3. Reinvestimento
    fiiPat += fiiDiv;
    acaoPat += acaoDiv;
 
    fiiDivAcum += fiiDiv;
    acaoDivAcum += acaoDiv;
    fiiDivAnoCorrente += fiiDiv;
    acaoDivAnoCorrente += acaoDiv;
 
    // Snapshot anual
    if (m % 12 === 0) {
      const ano = m / 12;
      data.push({
        ano,
        mes: m,
        fiiPat: Math.round(fiiPat * 100) / 100,
        acaoPat: Math.round(acaoPat * 100) / 100,
        total: Math.round((fiiPat + acaoPat) * 100) / 100,
        fiiDivAno: Math.round(fiiDivAnoCorrente * 100) / 100,
        acaoDivAno: Math.round(acaoDivAnoCorrente * 100) / 100,
        divAnoTotal: Math.round((fiiDivAnoCorrente + acaoDivAnoCorrente) * 100) / 100,
        fiiDivAcum: Math.round(fiiDivAcum * 100) / 100,
        acaoDivAcum: Math.round(acaoDivAcum * 100) / 100,
        divAcumTotal: Math.round((fiiDivAcum + acaoDivAcum) * 100) / 100,
        totalAportado,
        ganhoLiquido: Math.round((fiiPat + acaoPat - totalAportado) * 100) / 100,
      });
      fiiDivAnoCorrente = 0;
      acaoDivAnoCorrente = 0;
    }
  }
 
  const fiiDyAnual = (Math.pow(1 + fiiDyMensal, 12) - 1) * 100;
  const acaoDyAnualPct = acaoDyAnual * 100;
  return { data, fiiDyMensal: fiiDyMensal * 100, fiiDyAnual, acaoDyAnualPct, acaoDyMensalPct: acaoDyMensal * 100 };
}
 
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,10,16,0.96)", border: "1px solid rgba(212,175,55,0.25)",
      borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#e8e0d0",
      backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <div style={{ fontWeight: 700, color: "#d4af37", marginBottom: 8, fontSize: 14 }}>Ano {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 3 }}>
          <span style={{ color: p.color, fontSize: 12 }}>{p.name}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};
 
const colors = {
  fii: "#d4af37", acao: "#22c55e", total: "#60a5fa", aporte: "#a78bfa",
  bg: "#0a0a0f", card: "rgba(20,20,28,0.85)", border: "rgba(212,175,55,0.12)",
  text: "#e8e0d0", muted: "#8a8275",
};
 
export default function App() {
  const [anos, setAnos] = useState(10);
  const [tab, setTab] = useState("patrimonio");
 
  const { data, fiiDyMensal, fiiDyAnual, acaoDyAnualPct, acaoDyMensalPct } = useMemo(() => simulate(anos), [anos]);
  const final = data[data.length - 1];
  const chartData = tab === "patrimonio" ? data : data.slice(1);
 
  const kpis = [
    { label: "Patrimônio Total", value: fmt(final.total), sub: `Aportado: ${fmt(final.totalAportado)}`, accent: colors.total },
    { label: "Ganho com Dividendos", value: fmt(final.ganhoLiquido), sub: `+${((final.ganhoLiquido / final.totalAportado) * 100).toFixed(1)}% sobre aportes`, accent: colors.fii },
    { label: "Dividendos Acumulados", value: fmt(final.divAcumTotal), sub: `FIIs: ${fmt(final.fiiDivAcum)} · Ações: ${fmt(final.acaoDivAcum)}`, accent: colors.acao },
    { label: `Renda Passiva Ano ${anos}`, value: fmt(final.divAnoTotal), sub: `≈ ${fmt(final.divAnoTotal / 12)}/mês`, accent: "#f59e0b" },
  ];
 
  const tabs = [
    { id: "patrimonio", label: "Patrimônio" },
    { id: "dividendos", label: "Div./Ano" },
    { id: "acumulado", label: "Div. Acum." },
    { id: "aportes", label: "Aportes vs Ganho" },
  ];
 
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(170deg, ${colors.bg} 0%, #0f0f18 50%, #0a0a12 100%)`,
      color: colors.text, fontFamily: "'Cormorant Garamond', Georgia, serif", padding: "24px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.25); border-radius: 3px; }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: rgba(212,175,55,0.12); outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #b8942e); cursor: pointer; box-shadow: 0 0 16px rgba(212,175,55,0.4); }
      `}</style>
 
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: colors.muted, textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 8 }}>
          Simulação de Carteira · Aportes + Reinvestimento
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.fii, lineHeight: 1.15 }}>
          Dividendos Compostos
        </h1>
        <div style={{ fontSize: 13, color: colors.muted, fontFamily: "DM Sans, sans-serif", marginTop: 8, lineHeight: 1.5 }}>
          R$ 20k inicial + <span style={{ color: colors.aporte, fontWeight: 600 }}>R$ 3.000/mês</span> · 50% FIIs · 50% Ações
        </div>
      </div>
 
      {/* Slider */}
      <div style={{
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: 14, padding: "16px 20px", marginBottom: 18, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", color: colors.muted }}>Horizonte de investimento</span>
          <div>
            <span style={{ fontSize: 28, fontWeight: 700, color: colors.fii }}>{anos}</span>
            <span style={{ fontSize: 14, color: colors.muted, marginLeft: 4 }}>{anos === 1 ? "ano" : "anos"}</span>
          </div>
        </div>
        <input type="range" min={1} max={10} value={anos} onChange={(e) => setAnos(+e.target.value)} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: colors.muted, fontFamily: "DM Sans", marginTop: 4 }}>
          <span>1</span><span>3</span><span>5</span><span>7</span><span>10</span>
        </div>
      </div>
 
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: 12, padding: "14px 14px 12px", backdropFilter: "blur(12px)",
            borderLeft: `3px solid ${kpi.accent}`,
          }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: colors.muted, fontFamily: "DM Sans", marginBottom: 6 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: kpi.accent, lineHeight: 1.2, fontFamily: "DM Sans", fontVariantNumeric: "tabular-nums" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 10, color: colors.muted, fontFamily: "DM Sans", marginTop: 5, lineHeight: 1.4 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>
 
      {/* Aporte total badge */}
      <div style={{
        background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: 10, padding: "10px 16px", marginBottom: 18,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "DM Sans, sans-serif",
      }}>
        <div>
          <div style={{ fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1 }}>Total aportado em {anos} {anos === 1 ? "ano" : "anos"}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: colors.aporte }}>{fmt(final.totalAportado)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1 }}>R$ 20k + {anos * 12}× R$ 3k</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{fmt(INICIAL_FII + INICIAL_ACAO)} + {fmt(anos * 12 * APORTE_MENSAL)}</div>
        </div>
      </div>
 
      {/* Tabs */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "8px 0",
            border: `1px solid ${tab === t.id ? colors.fii : colors.border}`,
            borderRadius: 8,
            background: tab === t.id ? "rgba(212,175,55,0.1)" : "transparent",
            color: tab === t.id ? colors.fii : colors.muted,
            fontSize: 11, fontFamily: "DM Sans", fontWeight: tab === t.id ? 600 : 400,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {t.label}
          </button>
        ))}
      </div>
 
      {/* Chart */}
      <div style={{
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: 14, padding: "16px 6px 8px 0", marginBottom: 18, backdropFilter: "blur(12px)",
      }}>
        <ResponsiveContainer width="100%" height={280}>
          {tab === "patrimonio" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gFii" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.fii} stopOpacity={0.25} /><stop offset="100%" stopColor={colors.fii} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAcao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.acao} stopOpacity={0.25} /><stop offset="100%" stopColor={colors.acao} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="ano" tick={{ fill: colors.muted, fontSize: 11, fontFamily: "DM Sans" }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tickFormatter={fmtK} tick={{ fill: colors.muted, fontSize: 10, fontFamily: "DM Sans" }} tickLine={false} axisLine={false} width={58} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="totalAportado" name="Aportado" stroke={colors.aporte} fill="none" strokeWidth={1.5} strokeDasharray="6 4" dot={false} />
              <Area type="monotone" dataKey="fiiPat" name="FIIs" stroke={colors.fii} fill="url(#gFii)" strokeWidth={2.5} dot={{ r: 3, fill: colors.fii, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="acaoPat" name="Ações" stroke={colors.acao} fill="url(#gAcao)" strokeWidth={2.5} dot={{ r: 3, fill: colors.acao, strokeWidth: 0 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingTop: 8 }} />
            </AreaChart>
          ) : tab === "dividendos" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="ano" tick={{ fill: colors.muted, fontSize: 11, fontFamily: "DM Sans" }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tickFormatter={fmtK} tick={{ fill: colors.muted, fontSize: 10, fontFamily: "DM Sans" }} tickLine={false} axisLine={false} width={58} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fiiDivAno" name="FIIs" stackId="a" fill={colors.fii} radius={[0, 0, 0, 0]} />
              <Bar dataKey="acaoDivAno" name="Ações" stackId="a" fill={colors.acao} radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingTop: 8 }} />
            </BarChart>
          ) : tab === "acumulado" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gAcum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.total} stopOpacity={0.25} /><stop offset="100%" stopColor={colors.total} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="ano" tick={{ fill: colors.muted, fontSize: 11, fontFamily: "DM Sans" }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tickFormatter={fmtK} tick={{ fill: colors.muted, fontSize: 10, fontFamily: "DM Sans" }} tickLine={false} axisLine={false} width={58} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="fiiDivAcum" name="FIIs Acum." stroke={colors.fii} fill="none" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: colors.fii, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="acaoDivAcum" name="Ações Acum." stroke={colors.acao} fill="none" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: colors.acao, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="divAcumTotal" name="Total" stroke={colors.total} fill="url(#gAcum)" strokeWidth={2.5} dot={{ r: 3, fill: colors.total, strokeWidth: 0 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingTop: 8 }} />
            </AreaChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.fii} stopOpacity={0.2} /><stop offset="100%" stopColor={colors.fii} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="ano" tick={{ fill: colors.muted, fontSize: 11, fontFamily: "DM Sans" }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tickFormatter={fmtK} tick={{ fill: colors.muted, fontSize: 10, fontFamily: "DM Sans" }} tickLine={false} axisLine={false} width={58} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="totalAportado" name="Total Aportado" stroke={colors.aporte} fill="rgba(167,139,250,0.08)" strokeWidth={2.5} dot={{ r: 3, fill: colors.aporte, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="total" name="Patrimônio Real" stroke={colors.fii} fill="url(#gTotal)" strokeWidth={2.5} dot={{ r: 3, fill: colors.fii, strokeWidth: 0 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingTop: 8 }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
 
      {/* Year-by-year table */}
      <div style={{
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: 14, padding: 16, marginBottom: 18, backdropFilter: "blur(12px)", overflowX: "auto",
      }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, color: colors.muted, fontFamily: "DM Sans", marginBottom: 14 }}>
          Evolução Ano a Ano
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "DM Sans" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {["Ano", "FIIs", "Ações", "Patrimônio", "Aportado", "Ganho", "Div./Ano"].map((h) => (
                <th key={h} style={{ padding: "8px 4px", textAlign: "right", color: colors.muted, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.filter(d => d.ano > 0).map((d) => (
              <tr key={d.ano} style={{ borderBottom: "1px solid rgba(255,255,255,0.025)" }}>
                <td style={{ padding: "9px 4px", textAlign: "right", fontWeight: 700, color: colors.fii, fontSize: 13 }}>{d.ano}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: colors.fii, fontVariantNumeric: "tabular-nums" }}>{fmt(d.fiiPat)}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: colors.acao, fontVariantNumeric: "tabular-nums" }}>{fmt(d.acaoPat)}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: colors.total, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(d.total)}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: colors.aporte, fontVariantNumeric: "tabular-nums" }}>{fmt(d.totalAportado)}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: d.ganhoLiquido > 0 ? "#4ade80" : "#f87171", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {fmt(d.ganhoLiquido)}
                </td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: "#f59e0b", fontVariantNumeric: "tabular-nums" }}>{fmt(d.divAnoTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Yields + Composition */}
      <div style={{
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: 14, padding: 16, marginBottom: 18, backdropFilter: "blur(12px)",
      }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, color: colors.muted, fontFamily: "DM Sans", marginBottom: 14 }}>
          Yields Ponderados
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: colors.muted, fontFamily: "DM Sans", marginBottom: 2 }}>FIIs (mensal → anual)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.fii }}>{pct(fiiDyMensal)}<span style={{ fontSize: 13, color: colors.muted }}>/m</span></div>
            <div style={{ fontSize: 12, color: colors.muted, fontFamily: "DM Sans" }}>≈ {pct(fiiDyAnual)} a.a. composto</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: colors.muted, fontFamily: "DM Sans", marginBottom: 2 }}>Ações (anual → mensal)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.acao }}>{pct(acaoDyAnualPct)}<span style={{ fontSize: 13, color: colors.muted }}>/a</span></div>
            <div style={{ fontSize: 12, color: colors.muted, fontFamily: "DM Sans" }}>≈ {pct(acaoDyMensalPct)}/m equiv.</div>
          </div>
        </div>
      </div>
 
      {/* Portfolio Composition */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14, backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: colors.muted, fontFamily: "DM Sans", marginBottom: 10 }}>
            FIIs · R$ 10k + R$ 1.500/m
          </div>
          {FIIS.map((f) => (
            <div key={f.ticker} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, fontFamily: "DM Sans" }}>
              <span style={{ color: colors.fii, fontWeight: 600 }}>{f.ticker}</span>
              <span style={{ color: colors.muted }}>{f.peso}% · {pct(f.dyMensal)}/m</span>
            </div>
          ))}
        </div>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14, backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: colors.muted, fontFamily: "DM Sans", marginBottom: 10 }}>
            Ações · R$ 10k + R$ 1.500/m
          </div>
          {ACOES.map((a) => (
            <div key={a.ticker} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, fontFamily: "DM Sans" }}>
              <span style={{ color: colors.acao, fontWeight: 600 }}>{a.ticker}</span>
              <span style={{ color: colors.muted }}>{a.peso}% · {pct(a.dyAnual)}/a</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* Disclaimer */}
      <div style={{
        fontSize: 10, color: "rgba(138,130,117,0.5)", fontFamily: "DM Sans",
        textAlign: "center", lineHeight: 1.6, padding: "0 12px",
      }}>
        Simulação hipotética com DY constante e reinvestimento integral dos dividendos. Aportes de R$ 3.000/mês divididos igualmente entre FIIs e Ações.
        Não considera valorização/desvalorização de cotas, inflação, impostos ou custos de transação. Não constitui recomendação de investimento.
      </div>
    </div>
  );
}