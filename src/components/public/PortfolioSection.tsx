import React, { useState } from 'react';
import { useProjects, useMedia } from '../../hooks/useBkaapDatabase';
import { Project, Media } from '../../types/bkaap';
import ProjectModal from './ProjectModal';

const PortfolioSection: React.FC = () => {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'todos' | 'em_andamento' | 'concluido' | 'planejamento'>('todos');

  const filteredProjects = filter === 'todos' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const getStatusLabel = (status: string) => {
    const labels = {
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      planejamento: 'Planejamento'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      em_andamento: 'bg-blue-100 text-blue-800',
      concluido: 'bg-green-100 text-green-800',
      planejamento: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando portfólio...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nosso <span className="text-green-600">Portfólio</span>
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça alguns dos nossos projetos realizados com excelência e dedicação
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter('todos')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'todos'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('em_andamento')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'em_andamento'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Em Andamento
            </button>
            <button
              onClick={() => setFilter('concluido')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'concluido'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Concluídos
            </button>
            <button
              onClick={() => setFilter('planejamento')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'planejamento'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Planejamento
            </button>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum projeto encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                >
                  {/* Project Image Placeholder */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                      <div className="text-center text-white">
                        <div className="text-5xl mb-2">🏗️</div>
                        <p className="text-sm font-medium">Clique para ver detalhes</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {project.nome_obra}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{project.localizacao}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📏</span>
                        <span>{project.metragem.toLocaleString('pt-BR')} m²</span>
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-3">
                      {project.descricao}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                        Ver mais detalhes →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default PortfolioSection;
