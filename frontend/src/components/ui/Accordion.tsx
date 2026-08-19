import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden transition-colors hover:border-primary/50">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 bg-transparent focus:outline-none"
      >
        <h3 className="font-semibold text-text-primary text-left">{title}</h3>
        <ChevronDown 
          className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 text-text-muted text-sm leading-relaxed border-t border-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
