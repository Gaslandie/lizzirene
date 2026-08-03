-- 003_masquer_produits_sans_image
-- Retire temporairement du catalogue public les fiches encore sans photo.
-- La condition sur image_url évite de masquer un produit dont la boutique
-- aurait déjà ajouté une image depuis l'administration.

UPDATE products
SET status = 'draft',
    featured_home = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'poussa',
  'simoda',
  'lill-skate',
  'miss-fati',
  'carino',
  'la-vida',
  'choco-coeur',
  'peluches-cadeaux'
)
AND status = 'active'
AND (image_url IS NULL OR image_url = '');
