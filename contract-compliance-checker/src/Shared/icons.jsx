// src/shared/Icons.jsx
import PropTypes from 'prop-types';

const ICON_MAP = {
  // Navigation & Actions
  plus: '+',
  minus: '−',
  close: '×',
  back: '←',
  forward: '→',
  up: '↑',
  down: '↓',
  share: '↗',
  send: '➤',
  refresh: '↻',
  
  // UI Elements
  menu: '☰',
  more: '⋮',
  settings: '⚙',
  search: '🔍',
  
  // Status & Notifications
  success: '✓',
  error: '⚠',
  info: 'ⓘ',
  help: '?',
  
  // Content & Files
  file: '📄',
  doc: '📑',
  folder: '📁',
  image: '🖼',
  upload: '↑',
  download: '↓',
  
  // Communication
  message: '💬',
  email: '✉',
  phone: '📞',
  
  // Media Controls
  play: '▶',
  pause: '⏸',
  stop: '⏹',
  
  // Common Actions
  edit: '✎',
  delete: '🗑',
  favorite: '★',
  unfavorite: '☆',
  
  // Time & Calendar
  time: '⏱',
  calendar: '📅',
  clock: '⏰',
  
  // Misc
  link: '🔗',
  lock: '🔒',
  unlock: '🔓',
  book: '📚',
  user: '👤',
  home: '🏠'
};

export const Icon = ({ label, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
    xl: 'w-8 h-8 text-lg'
  };

  return (
    <span 
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      aria-label={label}
      role="img"
    >
      {ICON_MAP[label] || ''}
    </span>
  );
};

Icon.propTypes = {
  label: PropTypes.oneOf(Object.keys(ICON_MAP)).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
};

Icon.defaultProps = {
  size: 'md',
  className: ''
};

export const IconButton = ({ 
  children, 
  className = '', 
  size = 'md', 
  variant = 'default',
  onClick,
  disabled,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'flex items-center gap-2 transition-colors duration-200';
  
  const variantClasses = {
    default: 'hover:bg-gray-800',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    ghost: 'hover:bg-gray-800/10',
    outline: 'border border-gray-700 hover:bg-gray-800'
  };
  
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2',
    lg: 'p-3 text-lg',
    xl: 'p-4 text-xl'
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...props} 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['default', 'primary', 'ghost', 'outline']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

IconButton.defaultProps = {
  className: '',
  size: 'md',
  variant: 'default',
  disabled: false,
  type: 'button',
  onClick: () => {}
};

export default{ Icon, IconButton };
