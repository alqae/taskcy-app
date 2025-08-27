# 📝 Taskcy App

Taskcy Web is a simple and complementary task management app.

## 🚀 Requirements

- [Node.js](https://nodejs.org/) (recommended version in `.nvmrc`)
- [Yarn](https://yarnpkg.com/)

## 📦 Installation

Clone this repository and install dependencies:

```bash
yarn install
````

## ⚙️ Environment setup

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Update the `.env` file with your own environment variables.

## ▶️ Available scripts

In the project directory you can run:

* **Start in development:**

```bash
yarn dev
```

* **Build for production:**

```bash
yarn build
```

* **Preview the production build:**

```bash
yarn preview
```

## 🛠️ Main technologies

* React
* Vite
* Yarn

## 📁 Project Structure

Dentro de la carpeta `src` se encuentran las siguientes carpetas y archivos principales:

- `assets/` — Recursos estáticos como imágenes, fuentes, etc.
- `components/` — Componentes reutilizables organizados en:
  - `atoms/`
  - `layouts/`
  - `molecules/`
  - `organisms/`
  - `templates/`
- `context/` — Contextos para manejo de estado global.
- `hooks/` — Hooks personalizados de React.
- `pages/` — Páginas principales de la aplicación.
- `types/` — Definiciones de tipos TypeScript.
- `wrappers/` — Componentes envoltorios para funcionalidades adicionales.
