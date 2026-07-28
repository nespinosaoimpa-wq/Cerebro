import React, { useState } from 'react';
import { MOCK_FINANCIAL_TRANSACTIONS, MOCK_BANK_ACCOUNTS, MOCK_SHELL_COMPANIES } from '../constants';
import { FinancialTransaction, BankAccount, ShellCompany } from '../types';

export const FinancialAnalysisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'accounts' | 'companies' | 'sar'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlag, setSelectedFlag] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  const filteredTransactions = MOCK_FINANCIAL_TRANSACTIONS.filter(tx => {
    const matchesSearch = 
      tx.originEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.destinationEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.channel.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFlag = selectedFlag === 'all' || tx.suspiciousFlag === selectedFlag;

    return matchesSearch && matchesFlag;
  });

  const totalVolumeUSD = MOCK_FINANCIAL_TRANSACTIONS.reduce((acc, tx) => acc + tx.amountUSD, 0);
  const totalVolumeARS = MOCK_FINANCIAL_TRANSACTIONS.reduce((acc, tx) => acc + tx.amountARS, 0);
  const highRiskCount = MOCK_FINANCIAL_TRANSACTIONS.filter(tx => tx.riskScore > 85).length;

  return (
    <div className="h-full flex flex-col bg-nexus-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-nexus-800 bg-nexus-900/60 backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nexus-accent">account_balance</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Análisis Financiero & Forense</h1>
            <span className="px-2 py-0.5 text-xs bg-nexus-accent/20 border border-nexus-accent/40 text-nexus-accent rounded-full font-medium">
              Inteligencia Patrimonial
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Rastreo de activos, triangulación offshore, cuentas fachada e indicadores de lavado de activos (ROS).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-nexus-950 p-1 rounded-lg border border-nexus-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'transactions' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            Transacciones ({MOCK_FINANCIAL_TRANSACTIONS.length})
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'accounts' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">credit_card</span>
            Cuentas ({MOCK_BANK_ACCOUNTS.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'companies' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            Empresas Fantasma ({MOCK_SHELL_COMPANIES.length})
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
            <div className="text-[11px] text-gray-400 font-medium">Cuentas Bajo Vigilancia</div>
            <div className="text-base font-bold text-white">{MOCK_BANK_ACCOUNTS.length} Registradas</div>
            <div className="text-[10px] text-emerald-400">1 Embargada</div>
          </div>
        </div>

        <div className="bg-nexus-900/60 p-3 rounded-lg border border-nexus-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="material-symbols-outlined text-[20px]">business_center</span>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Sociedades Pantalla</div>
            <div className="text-base font-bold text-white">{MOCK_SHELL_COMPANIES.length} Identificadas</div>
            <div className="text-[10px] text-amber-400">Testaferros vinculados</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-nexus-900/50 p-3 rounded-lg border border-nexus-800">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Buscar por entidad origen, destino o canal..."
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
                  <option value="Incremento Injustificado">Incremento Injustificado</option>
                  <option value="Triangulación Offshore">Triangulación Offshore</option>
                  <option value="Estructuración (Smurfing)">Estructuración (Smurfing)</option>
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-nexus-900/40 rounded-lg border border-nexus-800 overflow-hidden">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-nexus-900/80 text-gray-400 uppercase text-[10px] font-semibold border-b border-nexus-800">
                  <tr>
                    <th className="px-4 py-3">Fecha & ID</th>
                    <th className="px-4 py-3">Origen (Pagador)</th>
                    <th className="px-4 py-3">Destino (Receptor)</th>
                    <th className="px-4 py-3 text-right">Monto (USD / ARS)</th>
                    <th className="px-4 py-3">Canal</th>
                    <th className="px-4 py-3">Indicador de Riesgo</th>
                    <th className="px-4 py-3 text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nexus-800/60">
                  {filteredTransactions.map(tx => (
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
                        <div className="text-[10px] text-gray-500 font-mono">{tx.originAccount}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-200">{tx.destinationEntity}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{tx.destinationAccount}</div>
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
                          <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-medium flex items-center gap-1 w-max">
                            <span className="material-symbols-outlined text-[12px]">flag</span>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_BANK_ACCOUNTS.map(account => (
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

        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_SHELL_COMPANIES.map(company => (
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
          </div>
        )}
      </div>

      {/* Transaction Detail Drawer Modal */}
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
                  <span className="text-gray-500 block mb-1">Entidad Origen</span>
                  <div className="font-bold text-white">{selectedTransaction.originEntity}</div>
                  <div className="font-mono text-[10px] text-gray-400 mt-0.5">{selectedTransaction.originAccount}</div>
                </div>

                <div className="bg-nexus-950 p-3 rounded border border-nexus-800">
                  <span className="text-gray-500 block mb-1">Entidad Destino</span>
                  <div className="font-bold text-white">{selectedTransaction.destinationEntity}</div>
                  <div className="font-mono text-[10px] text-gray-400 mt-0.5">{selectedTransaction.destinationAccount}</div>
                </div>
              </div>

              <div className="bg-nexus-950 p-3 rounded border border-nexus-800 flex justify-between items-center">
                <div>
                  <span className="text-gray-500">Monto Transferido</span>
                  <div className="text-base font-mono font-bold text-emerald-400">${selectedTransaction.amountUSD.toLocaleString()} USD</div>
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
                  <p className="mt-1 text-[11px] text-red-200/90">
                    Se detectó patrón de: <strong>{selectedTransaction.suspiciousFlag}</strong>. Se recomienda emitir Reporte de Operación Sospechosa (ROS) ante la UIF.
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
