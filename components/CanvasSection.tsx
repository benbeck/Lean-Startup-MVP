
import React, { useRef, useEffect } from 'react';
import { SectionMetadata } from '../types.ts';

interface CanvasSectionProps {
  metadata: SectionMetadata;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isPrinting?: boolean;
}

// Helper to turn text URLs into clickable links
const renderTextWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#0055FF] underline hover:text-blue-800 transition-colors break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const CanvasSection: React.FC<CanvasSectionProps> = ({ 
  metadata, 
  value, 
  onChange, 
  className = "",
  isPrinting = false
}) => {
  const hasValue = value.trim().length > 0;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && !isPrinting) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, isPrinting]);

  return (
    <div 
      className={`flex flex-col border border-slate-200 transition-all duration-300 ${className} 
        ${hasValue ? 'bg-white border-blue-100 shadow-sm' : 'bg-white border-dashed'} 
        ${isPrinting ? 'mb-8 border-slate-300 shadow-none break-inside-avoid' : 'rounded-2xl hover:border-blue-300'}
      `}
      style={isPrinting ? { height: 'auto', display: 'block', overflow: 'visible', pageBreakInside: 'avoid' } : {}}
    >
      <div className={`p-5 flex flex-col border-b border-slate-50 transition-colors duration-200 ${hasValue ? 'bg-blue-50/30' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{metadata.icon}</span>
          <h3 className="font-bold text-[14px] text-[#0055FF] uppercase tracking-tight">{metadata.title}</h3>
        </div>
        {metadata.subtext && (
          <p className="text-[12px] text-slate-400 mt-1 font-medium leading-snug">
            {metadata.subtext}
          </p>
        )}
      </div>

      <div className="relative flex-1" style={isPrinting ? { height: 'auto', display: 'block' } : {}}>
        {isPrinting ? (
          <div className="p-6 text-[14px] text-slate-800 whitespace-pre-wrap leading-relaxed">
            {hasValue ? renderTextWithLinks(value) : <span className="text-slate-300 italic">No entry provided.</span>}
          </div>
        ) : (
          <div className="relative group">
            <textarea
              ref={textareaRef}
              className={`w-full p-6 resize-none overflow-hidden focus:outline-none text-[15px] text-slate-700 transition-all duration-200 leading-relaxed placeholder:text-slate-300 
                bg-transparent focus:ring-0
              `}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Type ${metadata.title.toLowerCase()} here...`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasSection;
