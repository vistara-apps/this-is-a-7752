import React from 'react';

const EnvironmentSelector = ({ environments, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {environments.map((env) => {
        const isSelected = selected === env.id;
        const Icon = env.icon;
        
        return (
          <div 
            key={env.id}
            onClick={() => onSelect(env.id)}
            className={`
              relative p-3 rounded-md cursor-pointer transition-all duration-200
              ${isSelected 
                ? 'bg-accent/10 border border-accent' 
                : 'bg-dark-bg border border-dark-border hover:border-dark-text-secondary'
              }
            `}
          >
            <div className="flex items-start">
              {Icon && (
                <div className={`
                  p-2 rounded-md mr-3
                  ${isSelected ? 'bg-accent/20 text-accent' : 'bg-dark-border text-dark-text-secondary'}
                `}>
                  <Icon size={18} />
                </div>
              )}
              
              <div className="flex-1">
                <div className={`text-sm font-medium ${isSelected ? 'text-accent' : 'text-dark-text'}`}>
                  {env.name}
                </div>
                <div className="text-xs text-dark-text-secondary mt-1">
                  {env.description}
                </div>
              </div>
              
              <div className={`
                w-5 h-5 rounded-full border flex items-center justify-center
                ${isSelected 
                  ? 'border-accent bg-accent' 
                  : 'border-dark-text-secondary bg-transparent'
                }
              `}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
            
            {/* Accessibility-friendly hidden input */}
            <input
              type="radio"
              name="environment"
              value={env.id}
              checked={isSelected}
              onChange={() => onSelect(env.id)}
              className="sr-only"
              aria-label={`Select ${env.name} environment`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EnvironmentSelector;
