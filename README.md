# Auth Backend Project

This is an authentication backend built with **Node.js**, **Express**, and **PostgreSQL**. It provides robust authentication features including JWT-based authentication, refresh tokens, and additional security measures like two-factor authentication (2FA). This project uses **Sequelize** as the ORM for database management.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)

---

## Features

- User authentication using **JWT** and refresh tokens.
- Two-factor authentication (2FA) support using **Speakeasy**.
- Password hashing with **bcrypt**.
- Integration with **Resend** for email services.
- Secure environment configuration with **dotenv**.
- QR Code generation for 2FA using **QRCode**.

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version >= 16)
- **PostgreSQL** (version >= 12)
- **npm** or **yarn**
- **TypeScript** globally installed (optional)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MuhammedFayazTS/AUTH-BACKEND.git