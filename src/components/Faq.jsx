import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

// Liste de questions repliables. Même rendu sur l'accueil et sur la page
// contact — seules les questions passées en `questions` changent.
function Faq({ questions, premiereOuverte = true }) {
  return (
    <div className="faq-list">
      {questions.map((item, i) => (
        <Reveal key={item.q} delay={i * 70}>
          <details className="faq-item" open={premiereOuverte && i === 0}>
            <summary>
              {item.q}
              <Icon name="chevron" size={18} />
            </summary>
            <p>{item.r}</p>
          </details>
        </Reveal>
      ))}
    </div>
  )
}

export default Faq
