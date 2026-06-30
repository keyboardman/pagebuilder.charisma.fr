## 1. Helper de gestion des modes spacing

- [x] 1.1 Créer `assets/editeur/ManagerNode/Settings/spacingModeHelper.ts` avec les fonctions de détection de mode (`unified` / `per-side`), lecture de valeur unifiée, application shorthand/longhand et nettoyage des propriétés opposées
- [x] 1.2 Implémenter `expandUnifiedToPerSide` et la logique de basculement (unifié → 4 longhands égaux ; par côté → unifié si les 4 côtés sont identiques)
- [x] 1.3 Couvrir les cas limites : shorthand seul, longhands égaux, longhands asymétriques, champs vides

## 2. UI Spacing2Settings

- [x] 2.1 Ajouter un état local `marginMode` et `paddingMode` initialisé via `detectSpacingMode`
- [x] 2.2 Ajouter un bouton toggle (icône lien/délier) à côté des titres `Margin` et `Padding` pour basculer entre les modes
- [x] 2.3 Afficher un champ texte unique en mode unifié ; conserver la grille 2×2 existante en mode par côté
- [x] 2.4 Brancher les `onChange` sur le helper pour persister shorthand ou longhand et nettoyer l'autre forme

## 3. Placeholders thème

- [x] 3.1 En mode unifié, utiliser `useThemeStylePlaceholder(selector, 'margin')` et `'padding'`
- [x] 3.2 Vérifier que les placeholders par côté restent inchangés en mode par côté

## 4. Vérification

- [x] 4.1 Tester manuellement sur `NodeContainer` : saisie margin unifiée `1rem`, bascule vers par côté, saisie asymétrique padding
- [x] 4.2 Vérifier le rendu visuel (style inline appliqué correctement via `styleForView`)
- [x] 4.3 Vérifier qu'un nœud avec styles existants (longhand asymétriques) s'ouvre en mode par côté avec les bonnes valeurs
- [x] 4.4 Lancer la compilation Encore sans erreur
