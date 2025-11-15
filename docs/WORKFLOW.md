# 🚀 Team Workflow & Conventions

## Indice

- [Git Commit Conventions](#git-commit-conventions)
- [Git Branch Conventions](#git-branch-conventions)
- [Git History Strategy](#git-history-strategy)
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

| Type       | Descrizione                             | Esempio                                                  |
| ---------- | --------------------------------------- | -------------------------------------------------------- |
| `feat`     | Nuova feature                           | `feat(calendar): add weekly heatmap visualization`       |
| `fix`      | Bug fix                                 | `fix(mcp): correct timezone handling in calendar events` |
| `docs`     | Solo documentazione                     | `docs(readme): add MCP server setup instructions`        |
| `style`    | Formattazione, semicolon, etc.          | `style(dashboard): format component with prettier`       |
| `refactor` | Refactoring senza cambiare funzionalità | `refactor(ai-engine): extract pattern detection logic`   |
| `perf`     | Miglioramento performance               | `perf(db): add index on timestamp column`                |
| `test`     | Aggiunta o modifica test                | `test(calendar): add unit tests for time parsing`        |
| `chore`    | Build, dipendenze, config               | `chore(deps): update Claude SDK to v2.1.0`               |
| `ci`       | CI/CD changes                           | `ci(github): add automated testing workflow`             |

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

Utilizziamo le branch create dal ticket sul nostro github project

### Naming Convention

```
<ticket-number>-<type>---<short-description>
```

✅ Esempi buoni

```
6-docs---team-workflow-conventions
```

### Branch Types

| Type       | Uso                       | Esempio                           |
| ---------- | ------------------------- | --------------------------------- |
| `feature`  | Nuove feature             | `45-feat---calendar-integration`  |
| `bugfix`   | Fix di bug                | `78-bugfix---timezone-parsing`    |
| `hotfix`   | Fix urgenti in produzione | `99-hotfix---critical-data-loss`  |
| `refactor` | Refactoring               | `12-refactor---extract-mcp-logic` |
| `docs`     | Solo documentazione       | `24-docs---update-setup-guide`    |
| `test`     | Aggiunta/modifica test    | `34-test---add-calendar-tests`    |
| `chore`    | Maintenance, dipendenze   | `45-chore---upgrade-dependencies` |

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

git checkout master
git pull
git checkout feat-branch
git rebase master
git push origin feat-branch
si apre la pr

sei in feat-branch
git pull origin main --rebase
git push origin main

# Git History Strategy

## Perché Semi-Linear?

Adottiamo una **semi-linear git history** per mantenere una cronologia pulita e tracciabile. Questo approccio combina i vantaggi di:

- ✅ **Linearità**: facile da seguire e capire
- ✅ **Tracciabilità**: ogni feature ha un merge commit identificabile
- ✅ **Reversibilità**: semplice fare revert di intere feature

## Confronto Strategie

<table>
<tr>
<td width="50%">

**❌ Non Linear** (da evitare)

```
* ─── * ─── * ─── * ─── *
 \     \     \    /     /
  \     \    * ─ *     /
   \     \ /   \      /
    * ─ * * ─── * ─ *
```

Problemi:

- Storia caotica e difficile da seguire
- Merge commit multipli e disordinati
- Difficile fare revert

</td>
<td width="50%">

**✅ Semi Linear** (nostro standard)

```
* ─── * ─── * ─── * (dev)
 \   / \   / \   /
  * *   * *   * *
```

Vantaggi:

- Storia lineare e pulita
- Un merge commit per feature
- Facile identificare e revertire feature

</td>
</tr>
</table>

## Workflow

### 1. Crea branch da develop

```bash
git checkout develop
git pull origin develop
git checkout -b 23-feat---ai-chat-interface
```

> 💡 **Tip**: Usa nomi di branch descrittivi seguendo il pattern `<issue>-<tipo>---<descrizione>`

### 2. Lavora e committa

```bash
git add .
git commit -m "feat(4): add message input component"
```

> 📝 Segui [Conventional Commits](https://www.conventionalcommits.org/) per i messaggi

### 3. Mantieni il branch aggiornato (Rebase)

Prima di creare la PR, assicurati che il tuo branch sia aggiornato:

**Opzione A - Rebase esplicito:**

```bash
git checkout develop
git pull
git checkout 23-feat---ai-chat-interface
git rebase develop
```

**Opzione B - Pull con rebase:**

```bash
git pull origin develop --rebase
```

> ⚠️ **Attenzione**: Il rebase riscrive la storia. Usa `--force-with-lease` per il push

### 4. Push e crea Pull Request

```bash
git push origin 23-feat---ai-chat-interface --force-with-lease
```

Poi vai su GitHub e:

1. Crea Pull Request verso `develop`
2. Seleziona **"merge"** quando approvi la PR

---

## Risoluzione Conflitti durante Rebase

Se incontri conflitti durante il rebase:

```bash
# 1. Risolvi i conflitti nei file
# 2. Aggiungi i file risolti
git add <file-risolti>

# 3. Continua il rebase
git rebase --continue

# Se vuoi annullare
git rebase --abort
```

## Comandi Utili

```bash
# Visualizza la storia in formato grafico
git log --graph --oneline --all

# Controlla lo stato del rebase
git status

# Vedi le differenze prima di committare
git diff
```

---

## Best Practices

1. 🔄 **Rebase frequentemente** da develop per evitare conflitti grossi
2. 💾 **Committa spesso** localmente, poi pulisci con `git rebase -i` prima della PR
3. 🚫 **Mai rebase di branch condivisi** o già pushati su develop/main
4. ✅ **Usa `--force-with-lease`** invece di `-f` per evitare di sovrascrivere lavoro altrui
5. 📖 **Scrivi messaggi di commit chiari** seguendo Conventional Commits

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
