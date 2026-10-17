export const metadata = {
  title: 'Política de Privacidade — EM Soluções Digitais',
  description: 'Política de privacidade do assistente virtual WhatsApp da EM Soluções Digitais.',
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 mb-10">EM Soluções Digitais | Design &amp; Web Design — Última atualização: abril de 2025</p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Informações que coletamos</h2>
          <p className="text-gray-600 leading-relaxed">
            Ao interagir com nosso assistente virtual pelo WhatsApp, podemos coletar as seguintes informações fornecidas voluntariamente por você: nome completo, endereço de e-mail, número de telefone e descrição do serviço de interesse. Essas informações são coletadas exclusivamente para fins de atendimento comercial.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Como usamos suas informações</h2>
          <p className="text-gray-600 leading-relaxed">
            As informações coletadas são utilizadas para: responder às suas dúvidas e solicitações, entrar em contato para apresentar orçamentos e propostas comerciais, e melhorar a qualidade do nosso atendimento. Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins de marketing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Armazenamento de dados</h2>
          <p className="text-gray-600 leading-relaxed">
            Seus dados são armazenados em servidores seguros e protegidos. O histórico de conversas é mantido para contexto do atendimento e pode ser excluído mediante solicitação. Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Plataformas de terceiros</h2>
          <p className="text-gray-600 leading-relaxed">
            Nosso assistente opera por meio da plataforma WhatsApp Business (Meta) e utiliza a API de inteligência artificial da Anthropic para processamento de mensagens. Cada plataforma possui sua própria política de privacidade, às quais este serviço também está sujeito.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Seus direitos</h2>
          <p className="text-gray-600 leading-relaxed">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você tem direito a: acessar os dados que temos sobre você, solicitar a correção de dados incorretos, solicitar a exclusão dos seus dados e revogar o consentimento a qualquer momento. Para exercer esses direitos, entre em contato pelo e-mail <a href="mailto:estevao.marques@gmail.com" className="text-blue-600 hover:underline">estevao.marques@gmail.com</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Contato</h2>
          <p className="text-gray-600 leading-relaxed">
            Em caso de dúvidas sobre esta política, entre em contato:
          </p>
          <ul className="mt-3 text-gray-600 space-y-1">
            <li><strong>Empresa:</strong> EM Soluções Digitais</li>
            <li><strong>E-mail:</strong> <a href="mailto:estevao.marques@gmail.com" className="text-blue-600 hover:underline">estevao.marques@gmail.com</a></li>
            <li><strong>WhatsApp:</strong> +55 61 9566-4986</li>
          </ul>
        </section>

        <p className="text-sm text-gray-400 mt-12 border-t pt-6">
          Esta política pode ser atualizada periodicamente. Recomendamos consultar esta página regularmente.
        </p>
      </div>
    </main>
  )
}
