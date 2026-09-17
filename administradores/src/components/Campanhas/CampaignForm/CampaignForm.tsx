import { useState } from 'react';
import type { FormEvent } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import type { Campaign, CampaignFormData } from '../../../types/campaign';
import { formatDateBR, getTodayISO } from '../../../utils/date';

interface CampaignFormProps {
  /** Campanha sendo editada. Ausente = modo de criação. */
  campaign?: Campaign;
  onSubmit: (data: CampaignFormData) => void;
  onCancel: () => void;
  /** Exibido enquanto o envio (criação/edição) está em andamento. */
  submitting?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  endDate?: string;
}

const inputClassName =
  'w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500';

function CampaignForm({ campaign, onSubmit, onCancel, submitting = false }: CampaignFormProps) {
  const modoEdicao = Boolean(campaign);

  const [title, setTitle] = useState(campaign?.title ?? '');
  const [description, setDescription] = useState(campaign?.description ?? '');
  const [publishedAt, setPublishedAt] = useState(campaign?.publishedAt ?? getTodayISO());
  const [endDate, setEndDate] = useState(campaign?.endDate ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  // A data de disponibilização só pode ser editada na criação, ou na
  // edição enquanto a campanha ainda não foi ao ar ("agendada"). Depois
  // de publicada, vira somente leitura para preservar o histórico.
  const podeEditarPublicacao = !modoEdicao || campaign?.status === 'agendada';

  function validar(): FormErrors {
    const novosErros: FormErrors = {};

    if (!title.trim()) novosErros.title = 'Título é obrigatório.';
    if (!description.trim()) novosErros.description = 'Descrição é obrigatória.';
    if (!endDate) novosErros.endDate = 'Data de encerramento é obrigatória.';
    else if (endDate < publishedAt) {
      novosErros.endDate = 'A data de encerramento não pode ser anterior à data de disponibilização.';
    }

    return novosErros;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const novosErros = validar();
    setErrors(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    onSubmit({ title, description, publishedAt, endDate });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-10">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {modoEdicao ? 'Editar campanha' : 'Criar campanha'}
            </h2>
            <p className="text-sm text-gray-500">
              {modoEdicao ? 'Atualize os dados da campanha' : 'Preencha os dados da nova campanha'}
            </p>
          </div>

          <button
            type="button"
            aria-label="Fechar"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseOutlined />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
          <div className="flex-1 overflow-y-auto px-6">
            <p className="text-sm font-semibold text-emerald-600">Dados</p>

            <div className="mt-3 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Título</label>
                <input
                  className={`${inputClassName} ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da campanha"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Descrição</label>
                <textarea
                  className={`${inputClassName} min-h-[96px] resize-none ${
                    errors.description ? 'border-red-400' : 'border-gray-300'
                  }`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite a descrição da campanha"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Disponibilizar em</label>

                  {podeEditarPublicacao ? (
                    <>
                      <input
                        type="date"
                        className={`${inputClassName} border-gray-300`}
                        value={publishedAt}
                        min={getTodayISO()}
                        onChange={(e) => setPublishedAt(e.target.value)}
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Hoje = publica imediatamente. Data futura = campanha fica "Agendada" até lá.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-gray-500">{formatDateBR(publishedAt)}</p>
                      <p className="text-xs text-gray-400">Campanha já publicada — data não pode mais ser alterada.</p>
                    </>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Data de encerramento</label>
                  <input
                    type="date"
                    className={`${inputClassName} ${errors.endDate ? 'border-red-400' : 'border-gray-300'}`}
                    value={endDate}
                    min={publishedAt}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-6 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
            >
              {submitting
                ? 'Salvando...'
                : modoEdicao
                  ? 'Salvar alterações'
                  : 'Salvar campanha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CampaignForm;
