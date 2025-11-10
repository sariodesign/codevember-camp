# 🚀 Team Workflow & Conventions

## Indice
- [Git Commit Conventions](#git-commit-conventions)
- [Git Branch Conventions](#git-branch-conventions)
- [Code Review Guidelines](#code-review-guidelines)
- [Definition of Done](#definition-of-done)

---

## 📝 Git Commit Conventions

Seguiamo la specifica **Conventional Commits** per mantenere una storia Git chiara e generare changelog automatici.

### Formato
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Descrizione | Esempio |
|------|-------------|---------|
| `feat` | Nuova feature | `feat(calendar): add weekly heatmap visualization` |
| `fix` | Bug fix | `fix(mcp): correct timezone handling in calendar events` |
| `docs` | Solo documentazione | `docs(readme): add MCP server setup instructions` |
| `style` | Formattazione, semicolon, etc. | `style(dashboard): format component with prettier` |
| `refactor` | Refactoring senza cambiare funzionalità | `refactor(ai-engine): extract pattern detection logic` |
| `perf` | Miglioramento performance | `perf(db): add index on timestamp column` |
| `test` | Aggiunta o modifica test | `test(calendar): add unit tests for time parsing` |
| `chore` | Build, dipendenze, config | `chore(deps): update Claude SDK to v2.1.0` |
| `ci` | CI/CD changes | `ci(github): add automated testing workflow` |

💡**TIP:** Possiamo usare la CLI di [Commitizen](https://commitizen-tools.github.io/commitizen/) per la formattazione dei commit


### Scope
Indicare il numero del ticket su github project
```bash
docs(6): team workflow and conventions
```

### Subject
- Usa l'imperativo presente: "add" non "added" o "adds"
- Non capitalizzare la prima lettera
- Non mettere il punto finale
- Massimo 72 caratteri

### Body (opzionale)
- Spiega **cosa** e **perché**, non **come**
- Wrappa a 72 caratteri
- Separato dal subject da una riga vuota

### Footer (opzionale)
- Per breaking changes: `BREAKING CHANGE: <description>`
- Per riferimenti a issue: `Closes #123` o `Refs #456`

### ✅ Esempi Buoni
```bash
feat(2): add productivity heatmap component

Implements a weekly heatmap showing productive hours based on commit frequency.
Uses recharts library for visualization.

Closes #2

---

fix(2): handle missing calendar events gracefully

Previously the app crashed when no events were found.
Now returns empty array and shows appropriate message.

---

refactor(5)!: change pattern detection algorithm

BREAKING CHANGE: The pattern detection API now requires a minimum of 7 days of data instead of 3.
```

### ❌ Esempi Cattivi
```bash
# Troppo vago
fix: bug fix

# Non usa conventional commits
Updated the dashboard

# Troppo lungo nel subject
feat(2): add a new productivity heatmap component that shows when you're most productive based on your commit history and calendar events
```

---

## 🌿 Git Branch Conventions

### Naming Convention
```
<type>/<ticket-number>-<short-description>
```

### Branch Types

| Type | Uso | Esempio |
|------|-----|---------|
| `feature` | Nuove feature | `feature/45-calendar-integration` |
| `bugfix` | Fix di bug | `bugfix/78-timezone-parsing` |
| `hotfix` | Fix urgenti in produzione | `hotfix/99-critical-data-loss` |
| `refactor` | Refactoring | `refactor/12-extract-mcp-logic` |
| `docs` | Solo documentazione | `docs/update-setup-guide` |
| `test` | Aggiunta/modifica test | `test/34-add-calendar-tests` |
| `chore` | Maintenance, dipendenze | `chore/upgrade-dependencies` |

### Branch Principali

```
main (o master)
  ↓
develop
  ↓
feature/*, bugfix/*, etc.
```

- **`main`**: Produzione stabile, sempre deployable
- **`develop`**: Integrazione continua, dove confluiscono tutte le feature
- **`feature/*`**: Branching da `develop`, merge back a `develop`

### Workflow

1. **Crea branch da develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/23-ai-chat-interface
   ```

2. **Lavora e committa**
   ```bash
   git add .
   git commit -m "feat(chat): add message input component"
   ```

3. **Push e crea PR**
   ```bash
   git push origin feature/23-ai-chat-interface
   # Vai su GitHub e crea Pull Request verso develop
   ```

### 📏 Regole

- ✅ Branch name in **lowercase** con **kebab-case**
- ✅ Brevi e descrittivi (max 50 caratteri)
- ✅ Cancella branch dopo merge
- ❌ Mai committare direttamente su `main` o `develop`
- ❌ Mai fare merge senza code review


---

## 👀 Code Review Guidelines

### Checklist per il Reviewer

- [ ] I commit seguono le conventions?
- [ ] La documentazione è aggiornata?
- [ ] Non ci sono secret/credential hardcoded?
- [ ] Le performance sono accettabili?
- [ ] Il codice è leggibile e ben commentato dove necessario?
- [ ] Non ci sono warning o errori di linting?

### Tempo di Review
- PR piccole (<200 righe): **entro 4 ore**
- PR medie (200-500 righe): **entro 1 giorno**
- PR grandi (>500 righe): **da evitare, spezzare in PR più piccole**

### Feedback Style
```markdown
✅ Buono:
"Considera di estrarre questa logica in una funzione separata per migliorare 
la testabilità. Esempio: `extractProductivityPattern(data)`"

❌ Cattivo:
"Questo codice fa schifo, riscrivilo"
```

---

## ✅ Definition of Done

Una feature è considerata "Done" quando:

- [ ] ✅ Codice scritto e funzionante
- [ ] ✅ Documentazione aggiornata (README, commenti, JSDoc)
- [ ] ✅ Code review approvata da almeno 1 team member
- [ ] ✅ CI/CD pipeline passa (linting, tests, build)
- [ ] ✅ Branch mergato in `develop`
- [ ] ✅ Issue/ticket chiuso con riferimento al merge commit

---

## 📚 Risorse

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
---

**Ultimo aggiornamento**: 10 Novembre 2025  
**Team**: AI Productivity Coach Project