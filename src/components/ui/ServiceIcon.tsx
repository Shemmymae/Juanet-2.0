import React from 'react';
import {
  Globe,
  Palette,
  Sparkles,
  Cpu,
  GraduationCap,
  BrainCircuit,
  Smartphone,
  Headphones,
  Server,
  TrendingUp,
  ShoppingBag,
  Boxes,
  Layers,
} from 'lucide-react';

interface ServiceIconProps {
  iconKey: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ iconKey, className = 'w-6 h-6' }) => {
  switch (iconKey) {
    case 'Globe':
      return <Globe className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'BrainCircuit':
      return <BrainCircuit className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    default:
      return <Layers className={className} />;
  }
};
