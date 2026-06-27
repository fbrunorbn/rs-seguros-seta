import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="legal-page">
      <Link to="/" className="back-link">Voltar para o site</Link>
      <h1>Política de Privacidade</h1>
      <p>
        Este canal de atendimento coleta dados para que Rafael Silva / RS Seguros possa entrar em contato sobre sua cotação relacionada à SETA Proteção Veicular.
      </p>

      <h2>Dados coletados</h2>
      <p>
        Podemos coletar nome, WhatsApp, cidade, tipo de veículo, placa opcional, mensagem e informações necessárias para entender sua solicitação de cotação.
      </p>

      <h2>Finalidade</h2>
      <p>
        Os dados são usados exclusivamente para contato por WhatsApp ou telefone sobre cotação de proteção veicular, rastreamento, assistência e benefícios relacionados.
      </p>

      <h2>Atendimento</h2>
      <p>
        O atendimento é realizado por Rafael Silva / RS Seguros como canal de atendimento relacionado à SETA Proteção Veicular.
      </p>

      <h2>Compartilhamento</h2>
      <p>
        Seus dados não são vendidos. Eles podem ser usados apenas para viabilizar o atendimento solicitado e a análise da cotação.
      </p>

      <h2>Remoção de dados</h2>
      <p>
        Você pode solicitar a remoção dos seus dados pelo WhatsApp (88) 9.9261-2577.
      </p>

      <h2>Segurança</h2>
      <p>
        Mantemos linguagem clara, consentimento obrigatório no formulário e uso limitado dos dados à finalidade informada.
      </p>
    </div>
  );
}
