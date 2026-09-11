
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
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md mb-4">
              <span className="material-symbols-outlined text-white text-2xl">neurology</span>
           </div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cerebro<span className="text-blue-600">AC</span></h1>
           <p className="text-sm text-gray-500 font-medium">Sistema de Análisis Criminal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-8">
          
          {step === 'creds' ? (
            <div className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">Correo Electrónico</label>
                  <input 
                    type="text" 
                    value={credentials.id}
                    onChange={e => setCredentials({...credentials, id: e.target.value})}
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                    placeholder="nombre@ejemplo.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">Contraseña</label>
                  <input 
                    type="password" 
                    value={credentials.password}
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                    placeholder="••••••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-400 text-xs">O continuar con</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg font-medium text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google Workspace
              </button>
            </div>
          ) : (
            <form onSubmit={handleMFA} className="space-y-6">
              <div className="text-center">
                 <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                 </div>
                 <h3 className="text-gray-900 font-semibold">Verificación de Identidad</h3>
                 <p className="text-xs text-gray-500 mt-1">Ingrese el código de su aplicación de autenticación.</p>
              </div>

              <div className="flex justify-center gap-2">
                 {[1,2,3,4,5,6].map((_, i) => (
                    <input key={i} type="text" maxLength={1} className="w-10 h-12 text-center text-xl bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100" />
                 ))}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {isLoading ? 'Verificando...' : 'Confirmar'}
              </button>
              
              <button type="button" onClick={() => setStep('creds')} className="w-full text-xs text-gray-400 hover:text-gray-600">Volver</button>
            </form>
          )}
        </div>
        
        <div className="mt-6 text-center space-y-2">
           <p className="text-[11px] text-gray-400">
              Conexión segura SSL/TLS
           </p>
           <div className="flex justify-center gap-4 text-xs text-blue-600">
              <a href="#" className="hover:text-blue-700">Soporte</a>
              <a href="#" className="hover:text-blue-700">Privacidad</a>
           </div>
        </div>
      </div>
    </div>
  );
};
