// Señal — franja de datos de la cabecera. Lee los JSON del sitio (los escribe la Action)
// y muestra el último IPC y el salario nodocente real. Si algo falla, la franja queda con lo que haya.
(() => {
  const el = document.getElementById('ticker');
  if (!el) return;
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const etq = ym => `${MES[+ym.slice(5) - 1]}-${ym.slice(2, 4)}`;
  const nf = (v, d = 1) => v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const get = u => fetch(u, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null);
  Promise.all([get('data/historia.json'), get('data/universidades.json')]).then(([h, u]) => {
    const items = [];
    const fecha = (u && u.actualizado) || (h && h.actualizado);
    if (fecha) { const [a, m, d] = fecha.slice(0, 10).split('-'); items.push(`<span><i class="punto"></i>datos al ${+d}-${MES[+m - 1]}-${a}</span>`); }
    const hs = h && h.serie && h.serie[h.serie.length - 1];
    const us = u && u.salario && u.salario.serie[u.salario.serie.length - 1];
    // el IPC más reciente: el de la serie larga o, si la API del INDEC se atrasó, el del informe
    if (us && (!hs || us.mes > hs.fecha) && us.ipc_mes != null) items.push(`<span>IPC ${etq(us.mes)} <b>${nf(us.ipc_mes)}%</b></span>`);
    else if (hs) items.push(`<span>IPC ${etq(hs.fecha)} <b>${nf(hs.mensual)}%</b></span>`);
    if (hs) items.push(`<span>interanual ${etq(hs.fecha)} <b>${nf(hs.interanual)}%</b></span>`);
    if (h && h.gobiernos) { const g = h.gobiernos[h.gobiernos.length - 1]; if (g && g.promedio_anual != null) items.push(`<span>promedio anual ${g.corto} <b>${nf(g.promedio_anual)}%</b></span>`); }
    if (u && u.salario) { const k = u.salario.kpis; items.push(`<span>salario nodocente real <b class="neg">${k.perdida > 0 ? '+' : '−'}${nf(Math.abs(k.perdida))}%</b></span>`); }
    items.push('<span>fuente <b>INDEC</b></span>');
    el.innerHTML = `<div class="ticker-in">${items.join('')}</div>`;
  });
})();
