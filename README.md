
# AI Finance Platform

![AI Finance Platform](https://img.shields.io/badge/Status-In%20Development-yellow)  
A modern fintech application built to help users manage their financial transactions with ease. The platform allows users to add, edit, and track transactions, categorize expenses, and set up recurring transactions, all within a clean and intuitive UI.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview
The AI Finance Platform is a web application designed to simplify personal finance management. It provides users with tools to create and manage transactions, categorize expenses and income, and set up recurring transactions. The application is built using Next.js, Tailwind CSS, and various modern libraries to ensure a fast, responsive, and user-friendly experience.

This project was developed from scratch, starting with setting up the Next.js framework, integrating UI components with ShadCN UI, and implementing form validation with React Hook Form and Zod. The transaction form is a key feature, allowing users to input financial data seamlessly.

## Features
- **Add Transactions**: Create new transactions with details like type (expense/income), amount, account, category, date, and description.
- **Edit Transactions**: Update existing transactions with ease.
- **Recurring Transactions**: Set up recurring schedules (daily, weekly, monthly, yearly) for transactions.
- **Form Validation**: Robust validation using Zod and React Hook Form to ensure accurate data entry.
- **Responsive Design**: A clean, responsive UI that works on both desktop and mobile devices.
- **Account Management**: Select from existing accounts or create new ones directly from the transaction form.
- **Category Filtering**: Filter categories based on transaction type (expense or income).

## Technologies Used
- **Next.js**: React framework for server-side rendering and static site generation.
- **React Hook Form**: Form handling and validation.
- **Zod**: Schema validation for form data.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ShadCN UI**: Component library for building the UI (e.g., Select, Popover, Calendar, Button).
- **Lucide React**: Icon library for UI elements (e.g., CalendarIcon, Loader2).
- **Date-fns**: Date formatting and manipulation.
- **Sonner**: Toast notifications for user feedback.
- **React**: Core library for building the UI.
- **Node.js**: Runtime environment for running the app.

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher) or **yarn**
- **Git** (for cloning the repository)

## Installation
Follow these steps to set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/ai-finance-platform.git
   cd ai-finance-platform
   ```


3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add any necessary environment variables (e.g., API keys, database URLs). For now, the project doesn’t require any specific environment variables, but you can add them as needed.



## Usage
1. **Access the App**:
   Open your browser and navigate to `http://localhost:3000`.

2. **Add a Transaction**:
   - Navigate to the "Add Transaction" page (e.g., `/transaction/add`).
   - Fill in the form with details like type, amount, account, category, date, and description.
   - Optionally, enable recurring transactions and set an interval.
   - Click "Create Transaction" to save.

3. **Edit a Transaction**:
   - Navigate to an existing transaction (e.g., `/transaction/edit?edit=transactionId`).
   - Update the details and click "Update Transaction".

4. **Manage Accounts**:
   - While adding a transaction, select an account from the dropdown or click "Create Account" to add a new one.

## Project Structure
Here’s an overview of the project’s directory structure:
```
ai-finance-platform/
├── app/
│   ├── (main)/
│   │   ├── transaction/
│   │   │   ├── _components/
│   │   │   │   ├── transaction-form.jsx  # Transaction form component
│   │   │   │   └── recipt-scanner.jsx    # Receipt scanner (commented out)
│   │   │   └── page.jsx                  # Transaction page
│   ├── lib/
│   │   ├── schema.js                     # Zod schemas for validation
│   │   └── utils.js                      # Utility functions (e.g., cn for classNames)
│   └── actions/
│       └── transaction.js                # Server actions for creating/updating transactions
├── components/
│   ├── ui/                               # ShadCN UI components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   ├── popover.jsx
│   │   ├── calendar.jsx
│   │   └── switch.jsx
│   └── create-account-drawer.jsx         # Drawer for creating new accounts
├── hooks/
│   └── use-fetch.js                      # Custom hook for fetching data
├── public/                               # Static assets
├── styles/                               # Global styles (if any)
├── .env.local                            # Environment variables
├── package.json                          # Dependencies and scripts
└── README.md                             # Project documentation
```

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of your changes.

Please ensure your code follows the project’s coding style and includes appropriate tests (if applicable).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---


### Additional Notes
- **License File**: The README mentions a `LICENSE` file. If you want to use the MIT License, create a `LICENSE` file in the root directory with the following content:
  MIT License

  Copyright (c) 2025 Your Name

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
