export default function Footer() {
  return (
    <footer className="relative mt-20 pb-10 pt-20 border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between z-10 relative">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase">
            CineSync
          </span>
        </div>
        
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} CineSync AI. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0 text-sm text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">API</a>
        </div>
      </div>
    </footer>
  );
}
