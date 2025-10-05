# WineInventory

WineInventory is a comprehensive inventory management solution designed specifically for wine store owners, distributors, and suppliers in the wine and spirits industry.

## Project Overview

This project is a front-end application of WineInventory, a specialized inventory management system that provides detailed product care guidelines, smart stock tracking, and streamlined purchasing processes for wines, spirits, and related products.
## Features

### Core Functionality
- **Product Care Guidelines**: Detailed storage, handling, and preservation instructions for wines and spirits
- **Smart Stock Tracking**: Real-time inventory management for wines, spirits, and beers
- **Supplier Integration**: Built-in purchasing system for direct ordering from suppliers
- **Warehouse Management**: Multi-warehouse support with zone-based organization
- **Reporting System**: Comprehensive analytics and reporting capabilities

### Technical Features
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for warehouses, products, reports, and user management
- **Domain-Driven Design (DDD)**: Architecture based on DDD principles for maintainable and scalable code
- **Internationalization (i18n)**: Multi-language support with ngx-translate
- **JSON Server Integration**: RESTful API integration with JSON Server for data persistence
- **Responsive Navigation**: In-app navigation system with lazy loading
- **Environment Configuration**: Multiple environment support (development, production)

## Documentation

The documentation is available in the `docs/` folder and includes:

- **User Stories**: Available in `docs/user-stories.md`
- **Software Architecture**: C4 Model documentation available in `docs/software-architecture.dsl`

## Technology Stack

This project was generated using **Angular CLI** version 19.2.11 and includes the following dependencies:

### Core Framework
- **Angular 19**: Modern Angular framework with standalone components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming with observables

### UI/UX Libraries
- **Angular Material**: Material Design component library
- **ngx-translate**: Internationalization framework
- **ngx-translate/http-loader**: HTTP loader for translation files

### Backend & Data
- **JSON Server 0.17.4**: Fake REST API for development and testing
- **In-Memory Data Storage**: JSON-based data persistence

## Getting Started

### Prerequisites

- **Angular Material**
- **ngx-translate**
- **ngx-translate/http-loader**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/StockVin/WineInventory-frontend-application.git
cd wineinventory-front-end-application
```

2. Install dependencies:

#### Install Angular Material
```bash
ng add @angular/material
```

#### Install ngx-translate
```bash
ng add @ngx-translate/core
```

#### Install ngx-translate/http-loader
```bash
ng add @ngx-translate/http-loader
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200/`

## Backend API Setup

### JSON Server Configuration

The application uses JSON Server as a fake REST API for development and testing.

#### Installation
```bash
npm install -g json-server@0.17.4
```

#### Running the API Server

**For Windows:**
```bash
cd server
cmd start.cmd
```
```bash
json-server --watch server/db.json --port 3000 --routes server/routes.json
```

**For macOS/Linux:**
```bash
cd server
sh start.sh
```

```bash
json-server --watch server/db.json --port 3000 --routes server/routes.json
```

#### API Endpoints

The API will be available at `http://localhost:3000/api/v1` with the following resources:

- `http://localhost:3000/api/v1/users` - User management
- `http://localhost:3000/api/v1/reporting` - Reporting system
- `http://localhost:3000/api/v1/careguides` - Care guides
- `http://localhost:3000/api/v1/product` - Product catalog
- `http://localhost:3000/api/v1/warehouses` - Warehouse management
- `http://localhost:3000/api/v1/zones` - Zone management
- `http://localhost:3000/api/v1/purchase-orders` - Purchase orders
- `http://localhost:3000/api/v1/settings` - Settings
- `http://localhost:3000/api/v1/accounts` - Accounts
- `http://localhost:3000/api/v1/catalog` - Catalog
- `http://localhost:3000/api/v1/orders` - Orders
- `http://localhost:3000/api/v1/subscriptionPlans` - Subscription plans
- `http://localhost:3000/api/v1/premiumBenefits` - Premium benefits
- `http://localhost:3000/api/v1/inventory` - Inventory

## Development

### Development Server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you modify any of the source files.

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Building

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests

#### Unit Tests
```bash
ng test
```

#### End-to-End Tests
```bash
ng e2e
```

## Internationalization

The application supports multiple languages using ngx-translate:

- **English (en)**: Primary language
- **Spanish (es)**: Second language


Translation files are located in `public/i18n/`.


## License

This project is licensed under the MIT License - see the LICENSE file for details.
