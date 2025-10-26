import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error){
    return { hasError: true, error };
  }
  componentDidCatch(error, info){
    if (typeof window !== 'undefined' && window?.console) {
      // eslint-disable-next-line no-console
      console.error('UI error captured', error, info);
    }
  }
  render(){
    if (this.state.hasError){
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E3F8FA] text-[#78C3C7] p-6 text-center">
          <div>
            <h1 className="text-xl font-bold mb-2">Ocorreu um erro</h1>
            <p className="mb-4">Tente recarregar a página. Se persistir, limpe o cache do app.</p>
            <button onClick={()=>window.location.reload()} className="px-4 py-2 rounded-xl bg-[#78C3C7] text-white">Recarregar</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

