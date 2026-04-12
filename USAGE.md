# Guide d'Utilisation

## Démarrage

### Lancer OpenCode

```bash
opencode
```

### Obtenir de l'Aide

```bash
/sc-help
```

Affiche la liste de toutes les commandes disponibles avec leurs descriptions.

## Commandes Essentielles

### Gestion de Projet

```bash
/sc-pm          # Afficher le contexte de gestion de projet
/sc-save        # Sauvegarder l'état de la session actuelle
/sc-load        # Charger une session sauvegardée
/sc-reflect     # Réflexion sur l'avancement du travail
```

### Workflow de Développement

```bash
/sc-brainstorm  # Brainstorming pour idées nouvelles
/sc-design      # Conception d'une fonctionnalité
/sc-implement   # Implémentation de code
/sc-analyze     # Analyse de code existant
/sc-troubleshoot # Dépannage et résolution de bugs
```

### Qualité et Tests

```bash
/sc-test       # Générer et exécuter des tests
/sc-document   # Créer de la documentation
/sc-improve    # Améliorer le code existant
/sc-cleanup    # Nettoyer le code (dead code, imports inutiles)
```

### Recherche et Analyse

```bash
/sc-research   # Recherche approfondie sur un sujet
/sc-estimate   # Estimer le temps de développement
/sc-explain    # Expliquer du code ou des concepts
```

### Opérations Spéciales

```bash
/sc-git        # Opérations Git intelligentes
/sc-build      # Build du projet
/sc-spawn      # Décomposition de tâche complexe
/sc-business-panel # Panel d'experts business
```

## Patterns d'Utilisation

### Session de Travail Typique

1. **Démarrage**
   ```bash
   opencode
   /sc-pm          # Restaurer le contexte
   ```

2. **Tâche de Développement**
   ```bash
   /sc-design "implémenter feature X"
   /sc-implement "feature X"
   /sc-test "feature X"
   ```

3. **Sauvegarde**
   ```bash
   /sc-save       # Sauvegarder avant de quitter
   ```

### Utilisation des Agents

Chaque commande utilise un agent spécialisé. Vous pouvez aussi invoquer des agents directement :

```bash
/sc-agent system-architect   # Consulter l'architecte système
/sc-agent security-engineer  # Consulter l'expert sécurité
```

### Utilisation des Skills

某些 commandes chargent automatiquement des skills :

```bash
# Charge sc-orchestration automatiquement
/sc-task "tâche complexe"
/sc-build "projet"

# Charge sc-introspection automatiquement
/sc-troubleshoot "bug"
/sc-analyze "code complexe"
```

## Persistance et Sessions

### Sauvegarder une Session

```bash
/sc-save
```

Cela sauvegardera dans Serena :
- Contexte actuel (pm_context)
- Plan en cours (current_plan)
- Prochaines actions (next_actions)

### Reprendre une Session

```bash
/sc-load
```

Restaure le contexte depuis Serena.

### Réflexion

```bash
/sc-reflect
```

Analyse la tâche en cours et documente les décisions.

## Tips et Astuces

### Sélection d'Outil Automatique

```bash
/sc-select-tool "opération complexe"
```

Analyse automatiquement la meilleure工具 (Serena vs Morph).

### Orchestration de Tâches

Pour les projets complexes :

```bash
/sc-spawn "implémenter fonctionnalité complète"
```

Décompose en sous-tâches deleguables aux autres commandes.

### Recherche Rapide

```bash
/sc-index           # Indexer le projet
/sc-index-repo     # Indexer le repository
```

## Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Commande non reconnue | Utiliser `/sc-help` |
| Contexte perdu | `/sc-load` pour restaurer |
| Session longue | `/sc-save` régulièrement |
| Erreur MCP | Vérifier `opencode mcp list` |

## Bonnes Pratiques

1. **Toujours sauvegarder** avant de quitter (`/sc-save`)
2. **Utiliser `/sc-pm`** au début de chaque session
3. **Décomposer les tâches complexes** avec `/sc-spawn`
4. **Utiliser les agents spécialisés** pour les questions domain-specific
5. **Activer les skills** via les commandes qui les chargent automatiquement