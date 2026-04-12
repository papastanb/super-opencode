# Contributing to Super OpenCode

## Bienvenue !

Merci de votre intérêt pour Super OpenCode. Ce document vous guidera pour contribuer au projet.

## Code de Conduite

En contribuant, vous acceptez de respecter le [Code de Conduite](CODE_OF_CONDUCT.md) (à créer si nécessaire).

## Comment Contribuer

### Signaler des Bugs

1. Vérifiez si le bug n'existe pas déjà dans les [Issues](https://github.com/papastanb/super-opencode/issues)
2. Créez une issue avec le template suivant :
```markdown
## Bug Description
Description claire du bug.

## Steps to Reproduce
1. ...
2. ...

## Expected Behavior
Ce qui devrait se passer.

## Environment
- OS: 
- Bun version:
- OpenCode version:
```

### Proposer des Features

1. Créez une issue avec le标签 `enhancement`
2. Décrivez la feature proposée
3. Expliquez pourquoi elle serait utile

### Pull Requests

1. Fork le projet
2. Créez une branche : `git checkout -b feature/ma-feature`
3. Faites vos changements
4. Ajoutez des tests si pertinent
5. Vérifiez que tout passe : `bun run check && bun test`
6. Committez avec des messages clairs
7. Poussez et créez une PR

## Standards de Code

### Style

- **TypeScript** : Suivre les conventions du projet
- **YAML** : Validateur strict pour les configs
- **Markdown** : Limiter les lignes à 100 caractères

### Conventions de Commit

Utilisez [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
git commit -m "feat: ajout nouvelle commande sc-feature"
git commit -m "fix: correction du bug dans sc-pm"
git commit -m "docs: mise à jour README"
git commit -m "test: ajout tests pour plugin"
```

### Types de Commit

| Type | Description |
|------|-------------|
| feat | Nouvelle fonctionnalité |
| fix | Correction de bug |
| docs | Documentation |
| style | Formatage (sans changement de logique) |
| refactor | Refactoring |
| test | Tests |
| chore | Maintenance |

## Processus de Review

1. Les PRs doivent passer les checks CI
2. Les agents de review (Qodo, Devin, CodeRabbit) analyseront automatiquement
3. Au moins une approbation requise avant merge

## Tests

```bash
# Lancer tous les tests
bun test

# Lancer avec coverage
bun test --coverage

# Vérifier la structure
bun run check
```

## Documentation

- Mettre à jour la documentation pour les changements d'API
- Ajouter des exemples si pertinent
- Vérifier les liens

## Questions ?

- Ouvrez une issue avec le标签 `question`
- Utilisez les discussions GitHub

## Merci !

Votre contribution est appréciée ! 🚀