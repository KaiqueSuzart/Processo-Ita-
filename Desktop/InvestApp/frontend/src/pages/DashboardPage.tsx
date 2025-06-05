import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useInvestData } from "@/hooks/useInvestData";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Loader2,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, LineChart, Line, YAxis, CartesianGrid, Legend } from "recharts";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function DashboardPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const usuarioIdParam = query.get("usuarioId");
  const usuarioId = usuarioIdParam ? parseInt(usuarioIdParam, 10) : NaN;
  const { totalInvestido, posicaoPorPapel, posicaoGlobal, totalCorretagem, loading, error } = useInvestData(usuarioId);

  React.useEffect(() => {
    if (isNaN(usuarioId)) {
      navigate("/");
    }
  }, [usuarioId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <Loader2 className="animate-spin w-16 h-16 text-[#004080]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-xl text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-[#FF6600] hover:bg-[#e65c00] text-white py-2 px-4 rounded-md transition-colors"
        >
          Voltar ao Login
        </button>
      </div>
    );
  }

  if (totalInvestido.length === 0 && posicaoPorPapel.length === 0 && !posicaoGlobal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-xl text-gray-500">Nenhuma operação encontrada para este usuário.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-[#FF6600] hover:bg-[#e65c00] text-white py-2 px-4 rounded-md transition-colors"
        >
          Voltar ao Login
        </button>
      </div>
    );
  }

  // Dados para gráfico de linha (evolução da carteira)
  const historicoCarteira = posicaoGlobal?.historicoCarteira || [];
  // Dados para gráfico de pizza (distribuição de ativos)
  const distribuicaoAtivos = posicaoGlobal?.distribuicaoAtivos || [];
  const COLORS = ["#004080", "#FF6600", "#0066CC", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header fixo estilizado */}
      <header className="fixed top-0 left-0 w-full h-20 bg-[#004080] flex items-center px-10 shadow-lg z-20 justify-between">
        <div className="flex items-center gap-4">
          <img src="/itau.jpg" alt="Logo" className="h-10 w-auto" style={{ background: '#fff', borderRadius: 8, padding: 2 }} />
          <h1 className="text-2xl font-bold text-white font-inter tracking-wide">Dashboard</h1>
          <nav className="flex gap-8 ml-10">
            <NavLink to={`/dashboard?usuarioId=${usuarioId}`} className={({ isActive }) => isActive ? "text-white underline underline-offset-4" : "text-white/80 hover:text-white hover:scale-105 transition-transform duration-200"}>Dashboard</NavLink>
            <NavLink to={`/operacoes?usuarioId=${usuarioId}`} className={({ isActive }) => isActive ? "text-white underline underline-offset-4" : "text-white/80 hover:text-white hover:scale-105 transition-transform duration-200"}>Operações</NavLink>
            <NavLink to={`/posicoes?usuarioId=${usuarioId}`} className={({ isActive }) => isActive ? "text-white underline underline-offset-4" : "text-white/80 hover:text-white hover:scale-105 transition-transform duration-200"}>Posições</NavLink>
            <NavLink to={`/cotacoes?usuarioId=${usuarioId}`} className={({ isActive }) => isActive ? "text-white underline underline-offset-4" : "text-white/80 hover:text-white hover:scale-105 transition-transform duration-200"}>Cotações</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-lg font-medium">Kaique Suzart</span>
          <div className="bg-[#e5e7eb] rounded-full w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" fill="#004080"><circle cx="12" cy="8" r="4"/><ellipse cx="12" cy="18" rx="7" ry="4"/></svg>
          </div>
        </div>
      </header>

      {/* Conteúdo principal: cards, tabela e gráficos */}
      <div className="pt-28 pb-10 max-w-7xl mx-auto px-4">
        {/* Cards de totais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border-t-4 border-[#004080]">
            <span className="text-gray-500 text-lg mb-2">Carteira Atual</span>
            <span className="text-3xl font-bold text-[#FF6600]">{posicaoGlobal ? posicaoGlobal.valorMercado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-"}</span>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border-t-4 border-[#004080]">
            <span className="text-gray-500 text-lg mb-2">Custo Total</span>
            <span className="text-3xl font-bold text-[#004080]">{posicaoGlobal ? posicaoGlobal.custoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-"}</span>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border-t-4 border-[#FF6600]">
            <span className="text-gray-500 text-lg mb-2">Lucro/Prejuízo</span>
            <span className={`text-3xl font-bold ${posicaoGlobal && posicaoGlobal.pnL >= 0 ? "text-green-600" : "text-red-600"}`}>{posicaoGlobal ? posicaoGlobal.pnL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-"}</span>
          </div>
        </div>
        {/* Grid para tabela e gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Tabela de operações */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-[#004080] mb-4">Operações</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-base">
                <thead>
                  <tr className="bg-[#F5F5F5] text-[#004080]">
                    <th className="px-4 py-2 text-left">Data</th>
                    <th className="px-4 py-2 text-left">Ativo</th>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-right">Quantidade</th>
                    <th className="px-4 py-2 text-right">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {posicaoGlobal?.operacoes?.map((op, idx) => (
                    <tr key={op.id + idx} className="even:bg-gray-100">
                      <td className="px-4 py-2">{new Date(op.data).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-2">{op.ativo}</td>
                      <td className="px-4 py-2">{op.tipo}</td>
                      <td className="px-4 py-2 text-right">{parseInt(op.quantidade.toString(), 10)}</td>
                      <td className="px-4 py-2 text-right">{op.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Gráficos */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-md p-8 flex-1">
              <h3 className="text-xl font-semibold text-[#004080] mb-4">Valor da Carteira ao longo do tempo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicoCarteira} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis tick={{ fill: "#004080" }} width={80} tickFormatter={v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                  <Tooltip formatter={(val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                  <Legend />
                  <Line type="monotone" dataKey="valor" stroke="#004080" strokeWidth={3} dot={false} name="Carteira" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 flex-1" style={{ minHeight: 400, paddingBottom: 80 }}>
              <h3 className="text-xl font-semibold text-[#004080] mb-4">Distribuição de Ativos</h3>
              {distribuicaoAtivos && distribuicaoAtivos.some(a => a.valor > 0) ? (
                <ResponsiveContainer width="100%" height={340}>
                  <PieChart>
                    <Pie 
                      data={distribuicaoAtivos} 
                      dataKey="valor" 
                      nameKey="ativo" 
                      cx="50%" 
                      cy="58%" 
                      outerRadius={120}
                      label={({ cx, cy, midAngle, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius * 1.25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill={COLORS[index % COLORS.length]}
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontWeight={600}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      labelLine={{ length: 30 }}
                      isAnimationActive={false}
                    >
                      {distribuicaoAtivos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center" 
                      wrapperStyle={{ whiteSpace: "normal", width: "100%", textAlign: "center", marginTop: 120 }}
                    />
                    <Tooltip 
                      formatter={(val, name, props) => `${props.payload.ativo}: R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-400 text-center">Sem dados para exibir</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 