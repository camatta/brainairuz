export type Oportunidade = {
    data: Date;
    mes: string;
    ano: string;
    suspect: string;
    origem: string;
    fonte: string;
    responsavel: string;
    primeiro_contato: Date;
    status: string;
    reuniao_agendada: Date;
    sla_atendimento: number;
    percentual_fit: string;
    perfil_cliente: string;
    etapa: string;
    produto: string;
    detalhes_produto: string;
    valor_proposta: number;
    motivo_perda: string;
    valor_vendido: number;
    markup: number;
    mrr: number;
    data_aceite: Date;
    ciclo_venda: number;
    mes_encerramento: string;
  }