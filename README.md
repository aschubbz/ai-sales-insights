# AI Sales Insights

A RESTful API built with Node.js and Express that:
- Receives a JSON payload of **sales data** (category + amount).
- **Validates** the data extensively (e.g., missing fields, negative or non-numeric amounts).
- **Computes** key sales metrics (total, average, best category, etc.).
- Integrates with a **third-party AI** (like OpenAI) to generate a human-readable summary.
- Includes **unit and integration tests** with **Jest** + **Supertest**.
- Offers a **Docker** setup for easy deployment.

## Features
- **Robust input validation** with descriptive 400 errors for malformed data.
- **Analytics**: total sales, average sale, best category, breakdown per category.
- **AI summary**: an optional call to OpenAI if you supply an `OPENAI_API_KEY`.
- **Tests**: 
  - **Unit tests** for analytics logic (e.g., empty arrays, multiple categories, ties).
  - **Integration tests** for `/sales/insights` (e.g., invalid input, valid input).
- **Docker** container with Node 18 Alpine as the base.

## Getting Started

### Prerequisites
- Node.js (v14+) or Docker
- Optionally, an OpenAI API key (if you want the real AI summary).

### Setup
1. **Clone or download** this repository.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
