// Source unique des questions fréquentes. Elles alimentent la page contact,
// la section FAQ de l'accueil et les données structurées `FAQPage` — une
// réponse ne doit donc être corrigée qu'ici.
//
// Règle de rédaction : ne promettre que ce que le site tient déjà. Les
// informations encore inconnues (heure limite pour une livraison le jour
// même, frais par commune) restent volontairement absentes tant que la
// cliente ne les a pas confirmées.
export const QUESTIONS = [
  {
    q: 'Comment passer commande ?',
    r: 'Ajoutez vos articles au panier depuis la boutique, indiquez votre adresse, puis envoyez le récapitulatif sur WhatsApp : nous confirmons la commande et la livraison. Vous pouvez aussi nous appeler ou passer directement à la boutique à Kipé.',
  },
  {
    q: 'Comment se passe le paiement ?',
    r: 'Le paiement se fait à la livraison, en espèces, à la réception de votre commande. Aucun paiement en ligne n’est demandé.',
  },
  {
    q: 'Livrez-vous partout à Conakry ?',
    r: 'Oui, nous livrons dans toutes les communes de Conakry, 7j/7. Les frais de livraison sont confirmés avec vous sur WhatsApp avant l’envoi.',
  },
  {
    q: 'Peut-on personnaliser un bouquet ?',
    r: 'Bien sûr — c’est notre spécialité. Dites-nous l’occasion, vos couleurs et votre budget : nos bouquets démarrent à 300 000 GNF et sont composés selon vos envies.',
  },
  {
    q: 'Décorez-vous les événements ?',
    r: 'Oui : mariages, anniversaires, réceptions et événements d’entreprise. Écrivez-nous sur WhatsApp pour un devis gratuit, nous imaginons le décor avec vous.',
  },
  // Les deux questions suivantes lèvent les doutes d'après-commande — elles
  // ne promettent que ce que le tunnel fait déjà, plus des conseils de
  // fleuriste sans engagement de stock.
  {
    q: 'Que se passe-t-il après l’envoi de ma commande sur WhatsApp ?',
    r: 'Nous vous répondons pour confirmer la disponibilité des articles, les frais de livraison et l’heure de passage — rien n’est préparé ni facturé avant cette confirmation. Vous payez ensuite en espèces, à la réception.',
  },
  {
    q: 'Comment garder mon bouquet frais plus longtemps ?',
    r: 'Changez l’eau du vase tous les deux jours, recoupez les tiges en biseau d’un centimètre, et tenez le bouquet à l’écart du soleil direct et de la climatisation. Retirez les fleurs fanées au fur et à mesure : le reste du bouquet durera plus longtemps.',
  },
]

// L'accueil n'affiche qu'un extrait : les quatre questions qui lèvent le plus
// de doutes avant un premier achat. La page contact les montre toutes.
export const QUESTIONS_ACCUEIL = QUESTIONS.slice(0, 4)
