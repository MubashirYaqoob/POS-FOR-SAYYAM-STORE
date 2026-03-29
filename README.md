💻 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** Vanilla CSS / [Tailwind CSS](https://tailwindcss.com/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Database:** SQLite
* **Language:** TypeScript

## 🛠️ Local Development

Follow these steps to run the application locally on your machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sayyam-store-pos.git
   cd sayyam-store-pos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   *(Ensure your `.env` file has the correct database URL, e.g., `DATABASE_URL="file:./dev.db"`)*
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## 🔒 License & Copyright

Copyright © 2026 Mubashir Yaqoob / Sayyam Store. All rights reserved.

This is a **closed-source** project. You may not copy, modify, distribute, or use this software for any commercial or non-commercial purposes without explicit permission from the author.
