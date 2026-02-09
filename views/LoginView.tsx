
import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';

export const LoginView: React.FC = () => {
  const { login } = useGlobalState();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'creds' | 'mfa'>('creds');
  const [credentials, setCredentials] = useState({ id: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Check
    setTimeout(() => {
      setIsLoading(false);
      setStep('mfa');
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('google');
    }, 1500);
  };

  const handleMFA = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login('credentials');
    }, 1000);
  };

  return (
    <div className="h-screen w-full bg-nexus-950 flex relative overflow-hidden items-center justify-center bg-grid">
      <div className="relative z-10 w-full max-w-sm">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-nexus-accent rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50 mb-4">
              <span className="material-symbols-outlined text-white text-2xl">neurology</span>
           </div>
           <h1 className="text-2xl font-bold text-white tracking-tight">Cerebro<span className="text-nexus-accent">AC</span></h1>
           <p className="text-sm text-gray-500 font-medium">Plataforma Unificada de Inteligencia</p>
        </div>

        {/* Login Card */}
        <div className="bg-nexus-900 border border-nexus-700/50 shadow-2xl rounded-xl overflow-hidden p-8">
          
          {step === 'creds' ? (
            <div className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-400">ID de Operador / Correo</label>
                  <input 
                    type="text" 
                    value={credentials.id}
                    onChange={e => setCredentials({...credentials, id: e.target.value})}
                    className="block w-full px-4 py-2.5 bg-nexus-950 border border-nexus-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent transition-colors"
                    placeholder="nombre.apellido@intel.gov"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-400">Contraseña</label>
                  <input 
                    type="password" 
                    value={credentials.password}
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    className="block w-full px-4 py-2.5 bg-nexus-950 border border-nexus-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent transition-colors"
                    placeholder="••••••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-nexus-accent hover:bg-nexus-accentHover transition-all shadow-lg disabled:opacity-70"
                >
                  {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-nexus-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-nexus-900 text-gray-500 text-xs">O continuar con</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg font-medium text-sm text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google Workspace
              </button>
            </div>
          ) : (
            <form onSubmit={handleMFA} className="space-y-6">
              <div className="text-center">
                 <span className="material-symbols-outlined text-4xl text-nexus-success mb-2">lock</span>
                 <h3 className="text-white font-medium">Verificación de Identidad</h3>
                 <p className="text-xs text-gray-500 mt-1">Ingrese el código de su llave de seguridad física o aplicación autenticadora.</p>
              </div>

              <div className="flex justify-center gap-2">
                 {[1,2,3,4,5,6].map((_, i) => (
                    <input key={i} type="text" maxLength={1} className="w-10 h-12 text-center text-xl bg-nexus-950 border border-nexus-700 rounded-md text-white focus:border-nexus-accent focus:outline-none" />
                 ))}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-nexus-success hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-70"
              >
                {isLoading ? 'Autenticando...' : 'Verificar Acceso'}
              </button>
              
              <button type="button" onClick={() => setStep('creds')} className="w-full text-xs text-gray-500 hover:text-white">Volver</button>
            </form>
          )}
        </div>
        
        <div className="mt-8 text-center space-y-2">
           <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
              Acceso Seguro SSL/TLS 1.3
           </p>
           <div className="flex justify-center gap-4 text-xs text-nexus-accent">
              <a href="#" className="hover:underline">Soporte</a>
              <a href="#" className="hover:underline">Políticas de Privacidad</a>
              <a href="#" className="hover:underline">Estado del Sistema</a>
           </div>
        </div>
      </div>
    </div>
  );
};
