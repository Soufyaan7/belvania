========================================================================
BELVANIA STORE - GUIDE D'AJOUT DES PHOTOS DE PRODUITS
========================================================================

Vous pouvez ajouter vos propres photos très facilement de 2 façons :

------------------------------------------------------------------------
MÉTHODE 1 : Déposer simplement vos photos dans ce dossier (RECOMMANDÉE)
------------------------------------------------------------------------

1. Placez vos photos (format JPG, PNG ou WEBP) directement dans ce dossier :
   c:\belvania-store\public\products\

2. Nommez le fichier avec le "slug" du produit. Par exemple :
   - goodgirl-blush-elixir.jpg
   - libre-eau-de-parfum.jpg
   - l-interdit-rouge.jpg
   - burberry-goddess.jpg
   - nars-insatiable-liquid-blush.jpg
   - etc.

3. Dans le fichier : c:\belvania-store\src\data\products.json
   Remplacez la ligne "images" du produit concerné par :
   "images": [
     "/products/goodgirl-blush-elixir.jpg"
   ]

   Astuce : Vous pouvez mettre plusieurs photos par produit !
   "images": [
     "/products/goodgirl-blush-elixir-1.jpg",
     "/products/goodgirl-blush-elixir-2.jpg"
   ]

------------------------------------------------------------------------
MÉTHODE 2 : Utiliser des liens d'images externes (URL Web)
------------------------------------------------------------------------
Si vos photos sont déjà hébergées en ligne (ex: Google Drive public, Cloudinary, Imgur, ou votre hébergeur), il vous suffit de coller directement le lien dans src/data/products.json :

   "images": [
     "https://mon-site.com/photos/parfum1.jpg"
   ]

========================================================================
LISTE DES SLUGS OFFICIELS DE VOS PRODUITS (POUR NOMMER VOS FICHIERS) :
========================================================================

PARFUMS (10ml) :
- goodgirl-blush-elixir.jpg
- libre-eau-de-parfum.jpg
- l-interdit-rouge.jpg
- burberry-goddess.jpg
- goodgirl-blush.jpg
- libre-intense.jpg
- narciso-for-her-intense.jpg
- prada-paradoxe.jpg
- valentino-donna-born-in-roma.jpg
- narciso-pur-musc.jpg

MAKEUP :
- nars-insatiable-liquid-blush.jpg
- nars-correcteur-mini-radiant-creamy-concealer.jpg
- nars-blush-en-poudre.jpg
- nyx-buttermelt-blush-fard-a-joues-en-poudre.jpg
- nyx-fat-oil-lip-drip-huile-a-levres.jpg
- cc-plus-fond-de-teint-couvrance-totale.jpg
- ysl-make-me-blush-bold-blurring-blush-en-poudre.jpg
- hudabeauty-matte-concealer.jpg
- hudabeauty-blush-filter-liquid-blush.jpg
- hudabeauty-blush-filter-blurring-blushlighters-palette.jpg
========================================================================
