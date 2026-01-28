
import { CanvasData, SectionMetadata } from './types';

export const CANVAS_SECTIONS: SectionMetadata[] = [
  {
    id: 'tam',
    title: 'Total Addressable Market',
    icon: '🌍',
    description: 'Estimated total market size and opportunity',
    subtext: 'What is the total size of the market opportunity?'
  },
  {
    id: 'hypothesis',
    title: 'Hypothesis',
    icon: '🧪',
    description: 'The primary assumption you are testing',
    subtext: 'What is the core belief that must be true for this to work?'
  },
  {
    id: 'problems',
    title: 'Problems',
    icon: '❓',
    description: 'List your top three problems',
    subtext: 'List your top three problems'
  },
  {
    id: 'alternatives',
    title: 'Existing Alternatives',
    icon: '🔄',
    description: 'How are these problems solved today?',
    subtext: 'Existing alternatives'
  },
  {
    id: 'solution',
    title: 'Solution',
    icon: '💡',
    description: 'List your top three features',
    subtext: 'List your top three features'
  },
  {
    id: 'metrics',
    title: 'Key Metrics',
    icon: '📊',
    description: 'Key activities you measure',
    subtext: 'Key activities you measure'
  },
  {
    id: 'uvp',
    title: 'Unique Value Proposition',
    icon: '💎',
    description: 'Single, clear, and compelling message that states why you are different and worth buying',
    subtext: 'Single clear and compelling message that states why you are different and worth buying'
  },
  {
    id: 'concept',
    title: 'High-Level Concept',
    icon: '🔭',
    description: 'List your X for Y analogy. Example: YouTube = Flickr for videos',
    subtext: 'List your X for Y analogy. Example: YouTube = Flickr for videos'
  },
  {
    id: 'advantage',
    title: 'Unfair Advantage',
    icon: '🚀',
    description: 'Something that cannot be easily copied or bought',
    subtext: "Can't be easily occupied, copied or bought"
  },
  {
    id: 'channels',
    title: 'Channels',
    icon: '📢',
    description: 'Path to customers',
    subtext: 'Path to customers'
  },
  {
    id: 'segments',
    title: 'Customer Segments',
    icon: '👥',
    description: 'Target customers',
    subtext: 'Target customers'
  },
  {
    id: 'adopters',
    title: 'Early Adopters',
    icon: '🎯',
    description: 'Characteristics of your ideal customers',
    subtext: 'List the characters of your ideal customers'
  },
  {
    id: 'costs',
    title: 'Cost Structure',
    icon: '💰',
    description: 'List your fixed and variable costs',
    subtext: 'List your fixed and variable costs, customer acquisition costs, distribution costs, technology costs, people costs, etc.'
  },
  {
    id: 'revenue',
    title: 'Revenue Streams',
    icon: '📈',
    description: 'Sources of revenue and margins',
    subtext: 'Source of revenue, revenue model, lifetime value, revenue, gross margin'
  }
];

export const INITIAL_CANVAS_DATA: CanvasData = {
  projectName: 'My Startup Name',
  designedBy: 'Your Name',
  date: new Date().toISOString().split('T')[0],
  version: '1.0',
  tam: '',
  hypothesis: '',
  problems: '',
  alternatives: '',
  solution: '',
  metrics: '',
  uvp: '',
  concept: '',
  advantage: '',
  channels: '',
  segments: '',
  adopters: '',
  costs: '',
  revenue: ''
};
