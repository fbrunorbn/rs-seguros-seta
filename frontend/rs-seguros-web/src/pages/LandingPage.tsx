import { zodResolver } from '@hookform/resolvers/zod';
import {
  BellRing,
  Car,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Handshake,
  Leaf,
  MapPin,
  MessageCircle,
  Navigation,
  Radar,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { createLead } from '../services/leadService';

const BRAND_NAME = 'SETA Proteção Veicular';
const CONSULTANT_NAME = 'Rafael Silva';
const CONSULTANT_LABEL = 'Atendimento Rafael Silva';
const WHATSAPP_DISPLAY = '(88) 9.9261-2577';
const WHATSAPP_NUMBER = '5588992612577';
const SETA_SITE_URL = 'https://www.setaprotecaoveicular.com.br/';
const INSTAGRAM_URL = '#';
const LOGO_URL = '/seta-logo.png';

const schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo.'),
  whatsapp: z.string().min(10, 'Informe um WhatsApp válido.'),
  cidade: z.string().min(2, 'Informe sua cidade.'),
  tipoVeiculo: z.string().min(1, 'Escolha o tipo de veículo.'),
  placaVeiculo: z.string().optional(),
  mensagem: z.string().optional(),
  consentimentoLgpd: z.literal(true, {
    error: 'Autorize o contato para solicitar sua cotação.',
  }),
});

type FormData = z.infer<typeof schema>;

type IconCard = {
  title: string;
  text?: string;
  icon: LucideIcon;
};

const choiceCards: IconCard[] = [
  { title: 'Monitoramento 24 horas', text: 'Acompanhamento e suporte para seu veículo todos os dias.', icon: Radar },
  { title: 'Recuperação em caso de roubo', text: 'Equipe preparada para agir rapidamente em situações de furto ou roubo.', icon: Navigation },
  { title: 'Segurança e proteção', text: 'Mais tranquilidade para dirigir no dia a dia.', icon: ShieldCheck },
  { title: 'Instalação profissional', text: 'Processo simples, discreto e sem complicação.', icon: Gauge },
  { title: 'Cobertura em todo o Brasil', text: 'Suporte nacional conforme plano e disponibilidade.', icon: MapPin },
  { title: 'Atendimento humanizado', text: 'Contato direto com consultor para tirar dúvidas e solicitar cotação.', icon: Handshake },
];

const coverageCards: IconCard[] = [
  { title: 'Furto e roubo', icon: ShieldCheck },
  { title: 'Colisão', icon: Car },
  { title: 'Incêndio', icon: Flame },
  { title: 'Fenômenos naturais', icon: Leaf },
  { title: 'Perda total', icon: CheckCircle2 },
  { title: 'Vidros', icon: Car },
  { title: 'Terceiros', icon: Handshake },
  { title: 'Rastreamento completo', icon: Radar },
  { title: 'Assistência 24h', icon: Clock3 },
];

const faqs = [
  ['A cotação é gratuita?', 'Sim. A cotação é gratuita e sem compromisso.'],
  ['Como funciona a proteção veicular?', 'Você solicita a cotação, recebe atendimento, entende as opções e escolhe o plano mais adequado.'],
  ['O que cobre a proteção da SETA?', 'As coberturas podem incluir roubo, furto, colisão, assistência e rastreamento, conforme plano e análise.'],
  ['Como funciona a instalação do rastreador?', 'A instalação é orientada no atendimento e depende da disponibilidade do plano contratado.'],
  ['Quais veículos podem ser protegidos?', 'Carros, motos, caminhonetes, táxi/app e outros veículos podem ser avaliados.'],
  ['Tem assistência 24h?', 'Há planos com assistência 24h, conforme condições e disponibilidade.'],
  ['Qual o prazo para ativação da proteção?', 'O prazo é informado durante o atendimento, após análise e adesão.'],
  ['Meus dados estão seguros?', 'Seus dados são usados para contato sobre a cotação e não são vendidos.'],
];

const testimonials = [
  'Atendimento rápido e explicação clara. Consegui entender as opções e proteger meu veículo com mais tranquilidade.',
  'Gostei da praticidade no atendimento pelo WhatsApp e da clareza nas informações.',
  'A cotação foi simples e recebi orientação para escolher a melhor opção.',
];

export function LandingPage() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setSuccess('');
    setError('');

    const origem = getLeadOrigin();
    const utmMessage = getUtmMessage();
    const message = [data.mensagem?.trim(), utmMessage].filter(Boolean).join('\n');

    try {
      await createLead({
        nome: data.nome,
        whatsapp: data.whatsapp.replace(/\D/g, ''),
        cidade: data.cidade,
        bairro: '',
        tipoVeiculo: data.tipoVeiculo,
        modeloVeiculo: '',
        anoVeiculo: '',
        placaVeiculo: data.placaVeiculo?.trim().toUpperCase() || '',
        interesse: 'Cotação SETA Proteção Veicular',
        mensagem: message,
        origem,
        consentimentoLgpd: data.consentimentoLgpd,
      });

      setSuccess('Cotação solicitada com sucesso! O Rafael entrará em contato pelo WhatsApp.');
      reset();
    } catch {
      setError('Não foi possível enviar sua cotação agora. Confira os dados e tente novamente.');
    }
  }

  function scrollToQuote() {
    document.getElementById('cotacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openWhatsapp() {
    const text = encodeURIComponent('Olá, Rafael! Quero fazer uma cotação da SETA Proteção Veicular.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="site-shell">
      <div className="top-bar">
        <span>Indique & Ganhe</span>
        <span>Atendimento: {WHATSAPP_DISPLAY}</span>
      </div>

      <header className="site-header">
        <a href="#topo" className="brand" aria-label={BRAND_NAME}>
          {!logoFailed && <img src={LOGO_URL} alt={BRAND_NAME} onError={() => setLogoFailed(true)} />}
          {logoFailed && <span>{BRAND_NAME}</span>}
        </a>
        <nav className="site-nav" aria-label="Navegação principal">
          <a href="#topo">Início</a>
          <a href="#beneficios">Benefícios</a>
          <a href="#como-funciona">Como Funciona</a>
          <a href="#coberturas">Coberturas</a>
          <a href="#rastreamento">Rastreamento</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="primary-button small" onClick={scrollToQuote}>Solicitar Cotação</button>
      </header>

      <main id="topo">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">{CONSULTANT_LABEL} | Consultor de proteção veicular SETA</p>
            <h1>Proteção veicular 24h em todo o Ceará</h1>
            <h2>com atendimento no Vale do Jaguaribe</h2>
            <p>
              Solicite sua cotação da {BRAND_NAME} com atendimento direto do {CONSULTANT_NAME}.
            </p>
            <p className="hero-support">
              Rastreamento inteligente, assistência 24h, suporte humanizado e proteção para carro, moto e outros veículos.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToQuote}>Solicitar cotação</button>
              <a className="secondary-button" href="#beneficios">Ver benefícios</a>
            </div>
            <div className="trust-row">
              <span>Cotação gratuita</span>
              <span>Atendimento humano</span>
              <span>Sem compromisso</span>
              <span>Proteção 24h</span>
            </div>
          </div>

          <aside className="quote-card" id="cotacao">
            <p className="eyebrow">Cotação gratuita</p>
            <h3>Solicite sua cotação da SETA Proteção Veicular</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Nome completo<input {...register('nome')} placeholder="Seu nome completo" /></label>
              {errors.nome && <small>{errors.nome.message}</small>}
              <label>WhatsApp<input {...register('whatsapp')} placeholder="(88) 9.9999-9999" /></label>
              {errors.whatsapp && <small>{errors.whatsapp.message}</small>}
              <label>Cidade<input {...register('cidade')} placeholder="Limoeiro do Norte" /></label>
              {errors.cidade && <small>{errors.cidade.message}</small>}
              <div className="form-grid">
                <label>Tipo de veículo
                  <select {...register('tipoVeiculo')} defaultValue="">
                    <option value="" disabled>Selecione</option>
                    <option>Carro</option>
                    <option>Moto</option>
                    <option>Caminhonete</option>
                    <option>Táxi/App</option>
                    <option>Outro</option>
                  </select>
                </label>
                <label>Placa do veículo, opcional<input {...register('placaVeiculo')} placeholder="ABC1D23" /></label>
              </div>
              {errors.tipoVeiculo && <small>{errors.tipoVeiculo.message}</small>}
              <label>Mensagem, opcional<textarea {...register('mensagem')} placeholder="Conte rapidamente o que você precisa" /></label>
              <label className="checkbox-row">
                <input type="checkbox" {...register('consentimentoLgpd')} />
                <span>Autorizo o contato por WhatsApp ou telefone para receber informações sobre minha cotação de proteção veicular.</span>
              </label>
              {errors.consentimentoLgpd && <small>{errors.consentimentoLgpd.message}</small>}
              <button className="primary-button full" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Solicitar minha cotação'}
              </button>
              <Link className="privacy-link" to="/politica-de-privacidade">Política de Privacidade</Link>
              {success && (
                <div className="success-box">
                  <p>{success}</p>
                  <button type="button" className="secondary-button full" onClick={openWhatsapp}>
                    <MessageCircle size={18} /> Chamar no WhatsApp agora
                  </button>
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
            </form>
          </aside>
        </section>

        <section className="content-band light-band" id="beneficios">
          <div className="section-heading">
            <p className="eyebrow">Tecnologia, suporte e tranquilidade</p>
            <h2>Por que escolher a SETA?</h2>
            <p>Proteção veicular com tecnologia, atendimento humanizado e suporte para você dirigir com mais tranquilidade.</p>
          </div>
          <div className="benefit-grid">
            {choiceCards.map(({ title, text, icon: Icon }) => (
              <article className="benefit-card" key={title}>
                <Icon size={25} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" id="como-funciona">
          <div>
            <p className="eyebrow">Como funciona</p>
            <h2>Da cotação ao atendimento em poucos passos</h2>
          </div>
          <ol className="steps">
            <li><strong>Solicite sua cotação</strong><span>Preencha seus dados e informe o tipo de veículo.</span></li>
            <li><strong>Receba atendimento</strong><span>O Rafael entra em contato pelo WhatsApp para entender sua necessidade.</span></li>
            <li><strong>Escolha sua proteção</strong><span>Você recebe as informações e escolhe a melhor opção para seu veículo.</span></li>
            <li><strong>Dirija protegido</strong><span>Após a adesão, você conta com suporte e proteção conforme o plano contratado.</span></li>
          </ol>
        </section>

        <section className="content-band" id="coberturas">
          <div className="section-heading">
            <p className="eyebrow">Coberturas</p>
            <h2>Proteção completa</h2>
            <p>Conheça algumas coberturas e benefícios disponíveis.</p>
          </div>
          <div className="coverage-grid">
            {coverageCards.map(({ title, icon: Icon }) => (
              <article className="coverage-card" key={title}>
                <Icon size={22} />
                <span>{title}</span>
              </article>
            ))}
          </div>
          <p className="note">Benefícios e coberturas podem variar conforme plano, análise e disponibilidade.</p>
        </section>

        <section className="split-section light-band" id="rastreamento">
          <div>
            <p className="eyebrow">Rastreamento inteligente</p>
            <h2>Mais controle e segurança para seu veículo</h2>
            <p>Acompanhe seu veículo com tecnologia, alertas e suporte para ter mais controle e segurança.</p>
            <p className="note">Recursos sujeitos à disponibilidade do plano.</p>
          </div>
          <ul className="feature-list">
            <li><Smartphone size={20} /> Histórico de trajetos</li>
            <li><BellRing size={20} /> Alertas de uso</li>
            <li><ShieldCheck size={20} /> Suporte em caso de ocorrência</li>
            <li><CheckCircle2 size={20} /> Plataforma simples e intuitiva</li>
            <li><Clock3 size={20} /> Ativação rápida</li>
          </ul>
        </section>

        <section className="content-band light-band">
          <div className="section-heading">
            <p className="eyebrow">Prova social</p>
            <h2>O que dizem os associados</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((text) => (
              <article className="testimonial-card" key={text}>
                <p>"{text}"</p>
                <strong>Associado SETA</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band">
          <div className="section-heading">
            <p className="eyebrow">Sobre</p>
            <h2>SETA Proteção Veicular</h2>
            <p>
              A SETA Proteção Veicular oferece soluções de proteção e rastreamento para quem busca segurança, suporte e tranquilidade no dia a dia.
            </p>
            <p>
              Neste canal, você conta com atendimento do Rafael Silva para solicitar sua cotação e tirar dúvidas de forma simples pelo WhatsApp.
            </p>
          </div>
          <div className="seal-grid">
            <span>+6 mil pessoas protegendo seus veículos</span>
            <span>Atendimento 24h</span>
            <span>Foco no Ceará</span>
            <span>Tecnologia de rastreamento</span>
          </div>
        </section>

        <section className="faq-section light-band" id="faq">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Dúvidas frequentes</h2>
          </div>
          <div className="faq-grid">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <h2>Pronto para proteger seu veículo?</h2>
          <p>Preencha seus dados e receba atendimento do Rafael Silva pelo WhatsApp.</p>
          <button className="primary-button" onClick={scrollToQuote}>Solicitar cotação agora</button>
        </section>
      </main>

      <button className="mobile-sticky-cta" onClick={scrollToQuote}>Solicitar cotação</button>
      <button className="floating-whatsapp" onClick={openWhatsapp} aria-label="Abrir WhatsApp">
        <MessageCircle size={24} />
      </button>

      <footer className="site-footer">
        <strong>{BRAND_NAME}</strong>
        <span>Atendimento Rafael Silva / RS Seguros</span>
        <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
        <span>Ceará | Vale do Jaguaribe</span>
        <Link to="/politica-de-privacidade">Política de Privacidade</Link>
        <a href={SETA_SITE_URL} target="_blank" rel="noreferrer">Site da SETA</a>
        <a href={INSTAGRAM_URL}>Instagram</a>
      </footer>
    </div>
  );
}

function getLeadOrigin() {
  const params = new URLSearchParams(window.location.search);
  const explicitOrigin = params.get('origem')?.trim();
  const source = params.get('utm_source')?.trim();
  const medium = params.get('utm_medium')?.trim();
  const campaign = params.get('utm_campaign')?.trim();

  if (explicitOrigin) return explicitOrigin;

  const utmParts = [source, medium, campaign].filter(Boolean);
  return utmParts.length > 0 ? utmParts.join('/') : 'site';
}

function getUtmMessage() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  if (!source && !medium && !campaign) return '';

  return `Origem da campanha: ${[source, medium, campaign].filter(Boolean).join('/')}`;
}
