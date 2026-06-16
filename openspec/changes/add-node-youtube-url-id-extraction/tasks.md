## 1. Implémentation

- [x] 1.1 Créer `extractYoutubeVideoId(input: string): string` couvrant les formats `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, variantes `m.youtube.com`, et la saisie d'un ID brut
- [x] 1.2 Brancher la normalisation dans `NodeYoutube/Settings.tsx` à la saisie (`onChange`) avant persistance de `content.videoId`
- [x] 1.3 Adapter le texte d'aide du champ (URL complète ou ID acceptés)

## 2. Validation

- [x] 2.1 Vérifier manuellement dans le builder : collage d'une URL `watch?v=`, d'un lien `youtu.be`, d'un lien `shorts`, et saisie d'un ID seul
- [x] 2.2 Vérifier que le player YouTube s'affiche correctement après collage d'URL
