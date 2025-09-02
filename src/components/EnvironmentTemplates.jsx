import React from 'react';
import { Code, Cpu, Database, Image } from 'lucide-react';

const EnvironmentTemplates = () => {
  const templates = [
    {
      id: '1',
      name: 'PyTorch Deep Learning',
      description: 'Complete PyTorch setup with CUDA support, Jupyter notebooks, and common ML libraries',
      icon: Code,
      frameworks: ['PyTorch 2.0', 'CUDA 11.8', 'Jupyter', 'NumPy', 'Pandas'],
      category: 'Machine Learning',
      popularity: 95,
    },
    {
      id: '2',
      name: 'TensorFlow AI Studio',
      description: 'TensorFlow environment with TensorBoard, Keras, and GPU acceleration',
      icon: Cpu,
      frameworks: ['TensorFlow 2.13', 'Keras', 'TensorBoard', 'Scikit-learn'],
      category: 'Machine Learning',
      popularity: 88,
    },
    {
      id: '3',
      name: 'Blender Rendering',
      description: 'Optimized Blender setup for GPU rendering with Cycles and OptiX',
      icon: Image,
      frameworks: ['Blender 4.0', 'Cycles', 'OptiX', 'CUDA'],
      category: 'Rendering',
      popularity: 72,
    },
    {
      id: '4',
      name: 'Data Science Suite',
      description: 'Complete data analysis environment with popular Python libraries',
      icon: Database,
      frameworks: ['Python 3.11', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      category: 'Data Science',
      popularity: 81,
    },
  ];

  const getIconColor = (category) => {
    switch (category) {
      case 'Machine Learning':
        return 'text-blue-400';
      case 'Rendering':
        return 'text-purple-400';
      case 'Data Science':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-dark-text mb-2">Environment Templates</h2>
        <p className="text-dark-text-secondary">
          Pre-configured environments ready for your projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div key={template.id} className="card p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 bg-opacity-20 rounded-lg ${getIconColor(template.category).replace('text-', 'bg-')}`}>
                  <Icon size={24} className={getIconColor(template.category)} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-text">{template.name}</h3>
                  <p className="text-sm text-dark-text-secondary mt-1">{template.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-dark-text mb-2">Included Frameworks:</p>
                <div className="flex flex-wrap gap-2">
                  {template.frameworks.map((framework, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-dark-border text-dark-text text-xs rounded"
                    >
                      {framework}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">Popularity</span>
                  <span className="text-dark-text">{template.popularity}%</span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${template.popularity}%` }}
                  />
                </div>
              </div>

              <button className="w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors">
                Use Template
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnvironmentTemplates;