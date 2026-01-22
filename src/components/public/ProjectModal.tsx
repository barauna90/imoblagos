import React, { useState, useEffect } from 'react';
import { Project } from '../../types/bkaap';
import { useMedia } from '../../hooks/useBkaapDatabase';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { media, loading } = useMedia(project.id);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{project.nome_obra}</h2>
            <p className="text-gray-600 mt-1">📍 {project.localizacao}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl text-gray-600">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Gallery */}
          {loading ? (
            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando mídia...</p>
              </div>
            </div>
          ) : media.length > 0 ? (
            <div className="mb-6">
              {/* Main Media Display */}
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-4">
                {media[selectedMediaIndex].tipo === 'foto' ? (
                  <img
                    src={media[selectedMediaIndex].url}
                    alt={media[selectedMediaIndex].titulo || project.nome_obra}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={media[selectedMediaIndex].url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnails */}
              {media.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {media.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMediaIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedMediaIndex === index
                          ? 'border-green-600 scale-105'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {item.tipo === 'foto' ? (
                        <img
                          src={item.thumbnail_url || item.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-2xl">▶️</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-gray-600">Nenhuma mídia disponível</p>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Informações do Projeto</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metragem:</span>
                  <span className="font-semibold text-gray-900">{project.metragem.toLocaleString('pt-BR')} m²</span>
                </div>
                {project.data_inicio && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de Início:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(project.data_inicio).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {project.data_conclusao && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de Conclusão:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(project.data_conclusao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Localização</h3>
              <p className="text-gray-700 mb-4">{project.localizacao}</p>
              <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🗺️</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Descrição do Projeto</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {project.descricao}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
