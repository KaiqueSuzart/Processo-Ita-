import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInvestData } from "@/hooks/useInvestData";
import api from "@/services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OperacoesPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioIdParam = query.get("usuarioId");
  const usuarioId = usuarioIdParam ? parseInt(usuarioIdParam, 10) : NaN;
  const { posicaoGlobal, loading, error } = useInvestData(usuarioId);
  const [nomeUsuario, setNomeUsuario] = React.useState<string>("");
  const [filtroAtivo, setFiltroAtivo] = React.useState("");
  const [filtroTipo, setFiltroTipo] = React.useState("");
  const [filtroDataInicio, setFiltroDataInicio] = React.useState("");
  const [filtroDataFim, setFiltroDataFim] = React.useState("");

  React.useEffect(() => {
    let id = usuarioId;
    if (isNaN(id)) {
      // Tenta recuperar do localStorage
      const storedId = localStorage.getItem('usuarioId');
      if (storedId && !isNaN(Number(storedId))) {
        id = Number(storedId);
        // Redireciona para a mesma página com o usuarioId na URL
        navigate(`${location.pathname}?usuarioId=${id}`, { replace: true });
        return;
      }
      // Se não encontrar, vai para login
      navigate("/");
    } else {
      // Salva no localStorage para persistir entre páginas
      localStorage.setItem('usuarioId', id.toString());
    }
  }, [usuarioId, navigate, location.pathname]);

  // Buscar nome do usuário logado ao carregar
  React.useEffect(() => {
    let id = usuarioId;
    if (!isNaN(id)) {
      api.get(`/invest/usuario/${id}`)
        .then(res => {
          console.log('Resposta usuário:', res.data); // Log para depuração
          if (res.data && res.data.nome) {
            setNomeUsuario(res.data.nome);
            localStorage.setItem('nomeUsuario', res.data.nome);
          }
        })
        .catch(() => setNomeUsuario(""));
    } else {
      // Se não tem id, tenta pegar do localStorage
      const nomeSalvo = localStorage.getItem('nomeUsuario');
      if (nomeSalvo) setNomeUsuario(nomeSalvo);
    }
  }, [usuarioId]);

  // Função para filtrar operações
  const operacoesFiltradas = React.useMemo(() => {
    if (!posicaoGlobal?.operacoes) return [];
    return posicaoGlobal.operacoes.filter(op => {
      const dataOp = new Date(op.data);
      const dataInicio = filtroDataInicio ? new Date(filtroDataInicio) : null;
      const dataFim = filtroDataFim ? new Date(filtroDataFim) : null;
      return (
        (!filtroAtivo || op.ativo.toLowerCase().includes(filtroAtivo.toLowerCase())) &&
        (!filtroTipo || op.tipo === filtroTipo) &&
        (!dataInicio || dataOp >= dataInicio) &&
        (!dataFim || dataOp <= dataFim)
      );
    });
  }, [posicaoGlobal, filtroAtivo, filtroTipo, filtroDataInicio, filtroDataFim]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header/topbar igual ao Dashboard */}
      <header className="fixed top-0 left-0 w-full h-20 bg-[#004080] flex items-center px-10 shadow-lg z-20 justify-between">
        <div className="flex items-center gap-4">
          <img src="/itau.jpg" alt="Logo" className="h-10 w-auto" style={{ background: '#fff', borderRadius: 8, padding: 2 }} />
          <h1 className="text-2xl font-bold text-white font-inter tracking-wide">Operações</h1>
          <nav className="flex gap-8 ml-10">
            <a href={`/dashboard?usuarioId=${usuarioId}`} className="text-white/80 hover:text-white hover:scale-105 transition-transform duration-200">Dashboard</a>
            <a href={`/operacoes?usuarioId=${usuarioId}`} className="text-white underline underline-offset-4">Operações</a>
            <a href={`/posicoes?usuarioId=${usuarioId}`} className="text-white/80 hover:text-white hover:scale-105 transition-transform duration-200">Posições</a>
            <a href={`/cotacoes?usuarioId=${usuarioId}`} className="text-white/80 hover:text-white hover:scale-105 transition-transform duration-200">Cotações</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-lg font-medium">{nomeUsuario || "Usuário"}</span>
          <div className="bg-[#e5e7eb] rounded-full w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" fill="#004080"><circle cx="12" cy="8" r="4"/><ellipse cx="12" cy="18" rx="7" ry="4"/></svg>
          </div>
        </div>
      </header>
      {/* Conteúdo principal centralizado */}
      <main className="pt-28 pb-10 max-w-7xl mx-auto px-4">
        <section className="flex flex-col justify-center items-start py-12 px-8">
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6 w-full">
            <input
              type="text"
              placeholder="Buscar por ativo..."
              value={filtroAtivo}
              onChange={e => setFiltroAtivo(e.target.value)}
              className="border rounded-md px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#004080]"
            />
            <select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="border rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-[#004080]"
            >
              <option value="">Todos os tipos</option>
              <option value="COMPRA">Compra</option>
              <option value="VENDA">Venda</option>
            </select>
            <input
              type="date"
              value={filtroDataInicio}
              onChange={e => setFiltroDataInicio(e.target.value)}
              className="border rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-[#004080]"
              placeholder="Data início"
            />
            <input
              type="date"
              value={filtroDataFim}
              onChange={e => setFiltroDataFim(e.target.value)}
              className="border rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-[#004080]"
              placeholder="Data fim"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-4xl">
            <table className="min-w-full text-base">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#004080]">
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Ativo</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-right">Quantidade</th>
                  <th className="px-4 py-2 text-right">Preço</th>
                  <th className="px-4 py-2 text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-[#004080]">Carregando...</td></tr>
                ) : error ? (
                  <tr><td colSpan={6} className="text-center py-8 text-red-600">Erro ao carregar operações</td></tr>
                ) : operacoesFiltradas.length ? (
                  operacoesFiltradas.map((op, idx) => (
                    <tr key={`${op.id}-${op.data}-${op.tipo}-${idx}`} className="even:bg-gray-100">
                      <td className="px-4 py-2">{new Date(op.data).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-2 font-medium">{op.ativo}</td>
                      <td className="px-4 py-2">{op.tipo}</td>
                      <td className="px-4 py-2 text-right">{parseInt(op.quantidade.toString(), 10)}</td>
                      <td className="px-4 py-2 text-right">{op.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                      <td className="px-4 py-2 text-right">{(op.quantidade * op.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nenhuma operação encontrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
} 