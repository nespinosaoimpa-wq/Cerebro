import React, { useState, useEffect } from 'react';
import { MOCK_FINANCIAL_TRANSACTIONS, MOCK_BANK_ACCOUNTS, MOCK_SHELL_COMPANIES } from '../constants';
import { FinancialTransaction, BankAccount, ShellCompany } from '../types';
import { useGlobalState } from '../components/GlobalState';
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";

interface PitufeoAlert {
  origin: string;
  destination: string;
  date: string;
  count: number;
  totalUSD: number;
  totalARS: number;
  transactions: string[];
}

export const FinancialAnalysisView: React.FC = () => {
  const { settings, addNotification } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'transactions' | 'pitufeo' | 'accounts' | 'companies'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlag, setSelectedFlag] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  // Core Data States (Initialized with mock data)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_FINANCIAL_TRANSACTIONS);
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [companies, setCompanies] = useState<ShellCompany[]>(MOCK_SHELL_COMPANIES);

  // Raw Statement Input / Upload
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pitufeoAlerts, setPitufeoAlerts] = useState<PitufeoAlert[]>([]);

  // Function to run the dynamic Pitufeo (Smurfing) detection algorithm
  const runPitufeoDetection = (txList: FinancialTransaction[]) => {
    // Group transactions by Sender -> Receiver + Day
    const groups: Record<string, FinancialTransaction[]> = {};
    txList.forEach(tx => {
      const day = tx.date.split(' ')[0] || tx.date;
      const key = `${tx.originEntity}->${tx.destinationEntity}_${day}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });

    const alerts: PitufeoAlert[] = [];
    const updatedTxList = txList.map(tx => ({ ...tx }));

    Object.keys(groups).forEach(key => {
      const groupTxs = groups[key];
      // Pitufeo rule: 3 or more transactions between same entities on the same day
      if (groupTxs.length >= 3) {
        const first = groupTxs[0];
        const [route, day] = key.split('_');
        const [origin, destination] = route.split('->');
        const totalUSD = groupTxs.reduce((sum, t) => sum + t.amountUSD, 0);
        const totalARS = groupTxs.reduce((sum, t) => sum + t.amountARS, 0);

        alerts.push({
          origin,
          destination,
          date: day,
          count: groupTxs.length,
          totalUSD,
          totalARS,
          transactions: groupTxs.map(t => t.id)
        });

        // Set suspicious flag and high risk score for these transactions
        groupTxs.forEach(gt => {
          const match = updatedTxList.find(t => t.id === gt.id);
          if (match) {
            match.suspiciousFlag = 'Estructuración (Smurfing)';
            match.riskScore = Math.max(match.riskScore, 92);
          }
        });
      }
    });

    setPitufeoAlerts(alerts);
    return updatedTxList;
  };

  // Run detection on component load or data change
  useEffect(() => {
    const updated = runPitufeoDetection(transactions);
    // Only update if flags changed to avoid infinite loops
    const hasChanges = updated.some((tx, idx) => tx.suspiciousFlag !== transactions[idx]?.suspiciousFlag);
    if (hasChanges) {
      setTransactions(updated);
    }
  }, [transactions]);

  // AI Document Statement Parser
  const handleParseDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsLoading(true);
    addNotification('info', 'Procesando extracto financiero con Inteligencia Artificial...');

    const apiKey = settings.geminiApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      setTimeout(() => {
        addNotification('warning', 'Clave API no disponible. Cargando simulación de importación.');
        
        // Mock parsed transactions from a sample document
        const newMockTxs: FinancialTransaction[] = [
          {
            id: 'TX-901',
            date: '2026-07-28 09:15',
            originEntity: 'Ramón "Monchi" Cantero',
            originAccount: 'CVU 0000003100092837482910',
            destinationEntity: 'Inmobiliaria Los Horneros S.A.',
            destinationAccount: 'CBU 0110023410009837462512',
            amountUSD: 4500,
            amountARS: 5400000,
            channel: 'Transferencia Bancaria',
            riskScore: 65
          },
          {
            id: 'TX-902',
            date: '2026-07-29 14:02',
            originEntity: 'Ariel Cantero',
            originAccount: 'Billetera Lemon @ariel.lq',
            destinationEntity: 'Juan Pérez',
            destinationAccount: 'CVU 0000003100091122334455',
            amountUSD: 850,
            amountARS: 1020000,
            channel: 'Cripto',
            riskScore: 40
          },
          // Pitufeo pattern for Ariel Cantero -> Juan Pérez (3 tx on 2026-07-29)
          {
            id: 'TX-903',
            date: '2026-07-29 14:15',
            originEntity: 'Ariel Cantero',
            originAccount: 'Billetera Lemon @ariel.lq',
            destinationEntity: 'Juan Pérez',
            destinationAccount: 'CVU 0000003100091122334455',
            amountUSD: 900,
            amountARS: 1080000,
            channel: 'Cripto',
            riskScore: 45
          },
          {
            id: 'TX-904',
            date: '2026-07-29 14:30',
            originEntity: 'Ariel Cantero',
            originAccount: 'Billetera Lemon @ariel.lq',
            destinationEntity: 'Juan Pérez',
            destinationAccount: 'CVU 0000003100091122334455',
            amountUSD: 920,
            amountARS: 1104000,
            channel: 'Cripto',
            riskScore: 45
          }
        ];

        const newMockAccounts: BankAccount[] = [
          {
            id: 'ACC-88',
            bankName: 'Lemon Cash',
            holderName: 'Ariel Cantero',
            holderCuit: '20-33445566-9',
            cbuCvu: 'Billetera Lemon @ariel.lq',
            status: 'Bajo Vigilancia',
            balanceUSD: 12500
          },
          {
            id: 'ACC-89',
            bankName: 'MercadoPago',
            holderName: 'Juan Pérez',
            holderCuit: '20-41009988-5',
            cbuCvu: 'CVU 0000003100091122334455',
            status: 'Activa',
            balanceUSD: 3100
          }
        ];

        // Merge into states
        setTransactions(prev => {
          const combined = [...newMockTxs, ...prev];
          // Deduplicate
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          return unique;
        });
        setAccounts(prev => [...newMockAccounts, ...prev].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i));

        addNotification('success', 'Extracto importado con éxito: 4 transacciones vinculadas detectadas.');
        setIsLoading(false);
        setRawText('');
      }, 2000);
      return;
    }

    try {
      const ai = new GoogleGenAI(apiKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Sos un Analista de Inteligencia Financiera. Tu objetivo es procesar el siguiente extracto bancario, cripto o de billetera virtual, y estructurar la información de transacciones y cuentas en formato JSON para investigación judicial.
        
        Extracto a procesar:
        "${rawText}"
        
        Devolver únicamente un objeto JSON puro (sin formato markdown adicional), respetando la siguiente estructura de datos:
        {
          "transactions": [
            {
              "id": "código_transacción_único",
              "date": "YYYY-MM-DD HH:MM",
              "originEntity": "Nombre del titular emisor",
              "originAccount": "CBU/CVU/Alias/Billetera emisora",
              "destinationEntity": "Nombre del titular receptor",
              "destinationAccount": "CBU/CVU/Alias/Billetera receptora",
              "amountUSD": monto_en_dólares (número),
              "amountARS": monto_en_pesos_argentinos (número),
              "channel": "Transferencia Bancaria" | "MercadoPago" | "Cripto" | "Efectivo",
              "riskScore": score_de_riesgo_estimado (número de 0 a 100)
            }
          ],
          "accounts": [
            {
              "id": "código_interno_cuenta",
              "bankName": "Nombre del Banco/Plataforma (ej: MercadoPago, Lemon Cash, Banco Galicia)",
              "holderName": "Nombre del titular",
              "holderCuit": "CUIT/CUIL del titular si figura o estimado",
              "cbuCvu": "CBU/CVU/Alias de la cuenta",
              "status": "Activa" | "Bajo Vigilancia",
              "balanceUSD": saldo_aproximado_si_figura (o 0)
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.transactions) {
          setTransactions(prev => {
            const combined = [...parsed.transactions, ...prev];
            return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          });
        }
        if (parsed.accounts) {
          setAccounts(prev => {
            const combined = [...parsed.accounts, ...prev];
            return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          });
        }
        addNotification('success', `Procesamiento de documento exitoso: ${parsed.transactions?.length || 0} transacciones mapeadas.`);
        setRawText('');
      } else {
        addNotification('error', 'La IA no pudo estructurar los datos del extracto.');
      }
    } catch (err) {
      console.error(err);
      addNotification('error', 'Error al procesar el extracto con la IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.originEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.destinationEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.channel.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFlag = selectedFlag === 'all' || tx.suspiciousFlag === selectedFlag;

    return matchesSearch && matchesFlag;
  });

  const totalVolumeUSD = transactions.reduce((acc, tx) => acc + tx.amountUSD, 0);
  const totalVolumeARS = transactions.reduce((acc, tx) => acc + tx.amountARS, 0);
  const highRiskCount = transactions.filter(tx => tx.riskScore > 85).length;

  return (
    <div className="h-full flex flex-col bg-nexus-950 text-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-nexus-800 bg-nexus-900/60 backdrop-blur flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nexus-accent">account_balance</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Análisis Económico & Forense Patrimonial</h1>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-medium">
              UIF / Prevención de Lavado
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Módulo inteligente de importación de extractos, vinculación automática de cuentas/billeteras y detección de patrones de Estructuración (Pitufeo).
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-nexus-950 p-1 rounded-lg border border-nexus-800 text-xs font-medium self-start">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'transactions' ? 'bg-nexus-accent text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            Transacciones ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('pitufeo')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 relative ${
              activeTab === 'pitufeo' ? 'bg-nexus-accent text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Alertas de Pitufeo ({pitufeoAlerts.length})
            {pitufeoAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'accounts' ? 'bg-nexus-accent text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            Cuentas y Billeteras ({accounts.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'companies' ? 'bg-nexus-accent text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            Sociedades Pantalla ({companies.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="px-6 py-3 bg-nexus-900/30 border-b border-nexus-800 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-nexus-900/60 p-3 rounded-lg border border-nexus-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Volumen Total Analizado</div>
            <div className="text-base font-bold text-white">${totalVolumeUSD.toLocaleString()} USD</div>
            <div className="text-[10px] text-gray-500">(${totalVolumeARS.toLocaleString()} ARS)</div>
          </div>
        </div>

        <div className="bg-nexus-900/60 p-3 rounded-lg border border-nexus-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Transacciones de Alto Riesgo</div>
            <div className="text-base font-bold text-red-400">{highRiskCount} Alertas</div>
            <div className="text-[10px] text-gray-500">Score &gt; 85%</div>
          </div>
        </div>

        <div className="bg-nexus-900/60 p-3 rounded-lg border border-nexus-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Billeteras y Cuentas Activas</div>
            <div className="text-base font-bold text-white">{accounts.length} Registradas</div>
            <div className="text-[10px] text-emerald-400">Vinculadas a sospechosos</div>
          </div>
        </div>

        <div className="bg-nexus-900/60 p-3 rounded-lg border border-nexus-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="material-symbols-outlined text-[20px]">business_center</span>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Patrones de Fraccionamiento</div>
            <div className="text-base font-bold text-amber-400">{pitufeoAlerts.length} Casos Detectados</div>
            <div className="text-[10px] text-gray-500">Alertas de Pitufeo activas</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT PANEL: Upload / Paste Document Statement */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-nexus-800 bg-nexus-900/40 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-shrink-0">
          <div className="glass-panel border border-nexus-800 rounded-xl p-5 bg-nexus-950/40">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-nexus-accent text-lg">upload_file</span>
              Importar Extracto Bancario
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Pegá el texto de un reporte financiero, extracto bancario, de MercadoPago o Lemon, o transferencias de criptomonedas. La IA procesará montos, fechas, CBU y titulares.
            </p>

            <form onSubmit={handleParseDocument} className="space-y-4">
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Ej: Transferencia recibida el 29/07 a las 14:15 por valor de $1.080.000 ARS de Ariel Cantero (CVU @ariel.lq) hacia Juan Pérez (CBU 00000031...)"
                rows={7}
                className="w-full bg-nexus-950 border border-nexus-800 rounded p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent resize-none leading-relaxed"
              />
              <button
                type="submit"
                disabled={isLoading || !rawText.trim()}
                className="w-full py-2.5 bg-nexus-accent hover:bg-blue-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Analizando Documento...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Procesar con IA
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-4 bg-nexus-900/60 rounded-lg border border-nexus-800 text-xs text-gray-400 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500 text-sm">security_update_warning</span>
              ¿Qué es el Pitufeo (Smurfing)?
            </h4>
            <p className="leading-relaxed">
              Consiste en fraccionar una gran suma de dinero en múltiples transacciones de menor valor, ejecutadas en plazos cortos de tiempo hacia los mismos destinatarios, buscando evadir los controles y reportes de la Unidad de Información Financiera (UIF).
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Data Views */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          
          {/* TAB 1: Transactions list */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-nexus-900/50 p-3 rounded-lg border border-nexus-800">
                <div className="relative flex-1 w-full">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
                  <input
                    type="text"
                    placeholder="Buscar por titular, CBU o canal..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-md pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-nexus-accent"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedFlag}
                    onChange={e => setSelectedFlag(e.target.value)}
                    className="bg-nexus-950 border border-nexus-800 rounded-md px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-nexus-accent"
                  >
                    <option value="all">Todas las Banderas de Riesgo</option>
                    <option value="Estructuración (Smurfing)">Estructuración (Smurfing) / Pitufeo</option>
                    <option value="Incremento Injustificado">Incremento Injustificado</option>
                    <option value="Triangulación Offshore">Triangulación Offshore</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-nexus-900/40 rounded-lg border border-nexus-800 overflow-hidden">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-nexus-900/80 text-gray-400 uppercase text-[10px] font-semibold border-b border-nexus-800">
                    <tr>
                      <th className="px-4 py-3">Fecha & ID</th>
                      <th className="px-4 py-3">Origen (Emisor)</th>
                      <th className="px-4 py-3">Destino (Receptor)</th>
                      <th className="px-4 py-3 text-right">Monto (USD / ARS)</th>
                      <th className="px-4 py-3">Canal</th>
                      <th className="px-4 py-3">Indicador de Alerta</th>
                      <th className="px-4 py-3 text-center">Score Riesgo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nexus-800/60">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(tx => (
                        <tr 
                          key={tx.id} 
                          onClick={() => setSelectedTransaction(tx)}
                          className="hover:bg-nexus-800/40 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3 font-mono">
                            <div className="font-semibold text-white">{tx.id}</div>
                            <div className="text-[10px] text-gray-500">{tx.date}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-200">{tx.originEntity}</div>
                            <div className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">{tx.originAccount}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-200">{tx.destinationEntity}</div>
                            <div className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">{tx.destinationAccount}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                            <div>${tx.amountUSD.toLocaleString()} USD</div>
                            <div className="text-[10px] text-gray-400">${tx.amountARS.toLocaleString()} ARS</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-nexus-800 text-gray-300 text-[10px]">
                              {tx.channel}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {tx.suspiciousFlag && (
                              <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-medium flex items-center gap-1 w-max">
                                <span className="material-symbols-outlined text-[12px]">warning</span>
                                {tx.suspiciousFlag}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-mono">
                            <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                              tx.riskScore > 90 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {tx.riskScore}%
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No se encontraron transacciones con los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Pitufeo Alerts */}
          {activeTab === 'pitufeo' && (
            <div className="space-y-6">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300 flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5">crisis_alert</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Detección Algorítmica de Estructuración Activa</h4>
                  <p className="leading-relaxed">
                    El sistema ha agrupado las transacciones e identificado las siguientes parejas de origen y destino que realizaron más de 3 transferencias consecutivas el mismo día por valores fraccionados.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pitufeoAlerts.length > 0 ? (
                  pitufeoAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-nexus-900/60 border border-red-500/20 rounded-xl p-5 space-y-4 relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-full filter blur-xl transform translate-x-8 -translate-y-8"></div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                            ALERTA PITUFEO
                          </span>
                          <p className="text-xs text-gray-500 mt-2 font-mono">Fecha del Patrón: {alert.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-white">{alert.count} Transacciones</span>
                          <p className="text-[10px] text-red-400">Fraccionadas consecutivas</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-nexus-950/60 p-3 rounded border border-nexus-800">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase block font-semibold">Emisor</span>
                          <strong className="text-xs text-white block">{alert.origin}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase block font-semibold">Receptor</span>
                          <strong className="text-xs text-white block">{alert.destination}</strong>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2 border-t border-nexus-800 font-mono">
                        <span className="text-gray-400">Volumen Acumulado en el día:</span>
                        <span className="text-emerald-400 font-bold">${alert.totalUSD.toLocaleString()} USD (${alert.totalARS.toLocaleString()} ARS)</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2 text-nexus-850">check_circle</span>
                    <p className="text-sm">No se detectaron alertas de pitufeo en el conjunto de transacciones cargado.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Accounts Per Individual */}
          {activeTab === 'accounts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {accounts.map(account => (
                <div key={account.id} className="bg-nexus-900/50 p-4 rounded-lg border border-nexus-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-nexus-accent font-mono">{account.bankName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      account.status === 'Embargada' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      account.status === 'Bajo Vigilancia' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{account.holderName}</h3>
                    <p className="text-xs text-gray-400 font-mono">CUIT: {account.holderCuit}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">CBU/CVU: {account.cbuCvu}</p>
                  </div>
                  <div className="pt-2 border-t border-nexus-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400">Saldo Declarado:</span>
                    <span className="text-emerald-400 font-bold">${account.balanceUSD.toLocaleString()} USD</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Shell Companies */}
          {activeTab === 'companies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map(company => (
                <div key={company.id} className="bg-nexus-900/50 p-5 rounded-lg border border-nexus-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{company.companyName}</h3>
                      <p className="text-xs text-gray-400 font-mono">CUIT: {company.cuit} • Reg: {company.registrationDate}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold">
                      Riesgo {company.riskRating}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1 bg-nexus-950/60 p-3 rounded border border-nexus-800">
                    <p><span className="text-gray-500">Actividad:</span> {company.activity}</p>
                    <p><span className="text-gray-500">Domicilio Legal:</span> {company.legalAddress}</p>
                    <p><span className="text-gray-500">Presunto Testaferro:</span> <strong className="text-amber-400">{company.suspectedFrontman}</strong></p>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className="text-gray-400">Movimiento Acumulado:</span>
                    <span className="text-emerald-400 font-mono font-bold">${company.totalMovementUSD.toLocaleString()} USD</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Transaction Detail Modal Dialog */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexus-900 border border-nexus-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nexus-accent">analytics</span>
                <h3 className="text-base font-bold text-white">Detalle de Operación Financiera</h3>
              </div>
              <button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between bg-nexus-950 p-3 rounded border border-nexus-800">
                <div>
                  <span className="text-gray-500">ID Operación:</span>
                  <div className="font-mono font-bold text-white">{selectedTransaction.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Fecha / Hora:</span>
                  <div className="font-mono text-gray-300">{selectedTransaction.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-nexus-950 p-3 rounded border border-nexus-800">
                  <span className="text-gray-500 block mb-1">Entidad Origen (Emisor)</span>
                  <div className="font-bold text-white">{selectedTransaction.originEntity}</div>
                  <div className="font-mono text-[10px] text-gray-400 mt-0.5 truncate">{selectedTransaction.originAccount}</div>
                </div>

                <div className="bg-nexus-950 p-3 rounded border border-nexus-800">
                  <span className="text-gray-500 block mb-1">Entidad Destino (Receptor)</span>
                  <div className="font-bold text-white">{selectedTransaction.destinationEntity}</div>
                  <div className="font-mono text-[10px] text-gray-400 mt-0.5 truncate">{selectedTransaction.destinationAccount}</div>
                </div>
              </div>

              <div className="bg-nexus-950 p-3 rounded border border-nexus-800 flex justify-between items-center">
                <div>
                  <span className="text-gray-500">Monto Transferido</span>
                  <div className="text-base font-mono font-bold text-emerald-400">${selectedTransaction.amountUSD.toLocaleString()} USD</div>
                  <div className="text-[10px] text-gray-400">${selectedTransaction.amountARS.toLocaleString()} ARS</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-nexus-800 text-gray-200 font-mono text-[11px]">
                  {selectedTransaction.channel}
                </span>
              </div>

              {selectedTransaction.suspiciousFlag && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300">
                  <div className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Alerta de Inteligencia Financiera
                  </div>
                  <p className="mt-1 text-[11px] text-red-200/90 leading-relaxed">
                    Se detectó patrón de: <strong>{selectedTransaction.suspiciousFlag}</strong>. Varias transferencias consecutivas del mismo emisor al receptor en un lapso corto de tiempo. Se aconseja elevar Reporte de Operación Sospechosa (ROS) ante la UIF.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-nexus-800">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
