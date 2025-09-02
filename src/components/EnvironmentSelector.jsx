import React from 'react';

const EnvironmentSelector = ({ environments, selected, onSelect }) => {
  return (
    <div className="space-y-2">
      {environments.map((env) => (
        <label key={env.id} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="environment"
            value={env.id}
            checked={selected === env.id}
            onChange={() => onSelect(env.id)}
            className="text-accent focus:ring-accent"
          />
          <div>
            <div className="text-sm font-medium text-dark-text">{env.name}</div>
            <div className="text-xs text-dark-text-secondary">{env.description}</div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default EnvironmentSelector;