# Tamm Platform

Tamm is a modern, scalable classifieds and communication platform built with a clean 3-tier architecture. It allows users to post and manage listings, engage in 1-to-1 chat, and receive system or external (Gmail/Tamm) notifications.

---

## 🚀 Features

- 🏷️ **Classified Listings**: Post, search, and filter ads by category, city, place, and more.
- 🧠 **EAV (Entity-Attribute-Value) System**: Flexible handling of custom product attributes per category (e.g., car models, apartment features).
- 📢 **Notification System**:
  - Support for both system and external providers (`Gmail` or `Tamm API`).
  - Individual or bulk messaging with real-time loading progress.
- 💬 **Chat System**:
  - 1-to-1 real-time messaging with SignalR and SQL persistence.
  - Automatic starter message tied to listings: "Is this ad still available?".
  - Messages linked to listing and users.

---

## 🧱 Architecture

### 🔄 CQRS Pattern

The platform uses the **Command Query Responsibility Segregation (CQRS)** pattern to separate read and write operations:

- **Command Handlers** manage creation/update/delete operations via stored procedures or business services.
- **Query Handlers** retrieve data using optimized stored procedures.

This improves scalability and separates responsibilities clearly.

---

### 📦 EAV Structure

- Products and listings have **dynamic attributes** depending on their category.
- Each attribute is defined independently and stored in a structured EAV format.
- Supports multilingual attribute names (Arabic & English).

---

### ⚙️ Backend

- **ASP.NET Core** RESTful APIs
- **gRPC** endpoints for fast internal communication
- Uses **Stored Procedures** for performance and abstraction
- Supports JWT Authentication

---

### 🎨 Frontend

- **React** + **Tailwind CSS**
- Arabic and English language support
- Dark and Light mode toggle
- Fully responsive design
- Smart UX: step-by-step ad posting, dynamic category loading, client-side validation

---

### 🧩 Technologies Used

- ASP.NET Core (.NET 8)
- Entity Framework Core (for limited direct ORM access)
- SQL Server (with over 30 normalized tables)
- SignalR (for real-time chat)
- gRPC (for internal communication between services)
- React.js
- Tailwind CSS

---

## 📊 Database Design

- The platform consists of **30+ normalized tables**, including:
  - Users, Listings, Categories, SubCategories
  - Cities, Places
  - Messages, Connections, Notifications
  - EAV Attributes, Values
  - Reports, Favorites, ListingsImages
  - Stored procedures for all major operations (Insert, Update, Fetch)

---

## 📚 Modules

- **Users Management**: Register, login, profile edit (with nationality, gender, etc.).
- **Listings**: Full CRUD, including multi-image upload and preview.
- **Search Page**: Category and subcategory-based search with infinite scroll.
- **Chat**: WhatsApp-style interface with message status and profile image display.
- **Notifications**: Custom subject and body, individual or bulk send.
- **Admin Tools**: Manage categories, attributes, subcategories dynamically.

---

## 🧠 Smart UX Details

- Step-by-step ad posting: select category → emirate → place → details → upload.
- Auto-load of subcategories and attributes based on selection.
- Ability to add a new place/category directly from the UI if not found.
- Language + theme aware UI.

---

## 📌 Notes

- Built with a **3-tier architecture**:
  - Presentation Layer (React)
  - Business Logic Layer (.NET Services)
  - Data Access Layer (Stored Procedures + ADO.NET)

- Suitable for selling as a white-label solution where branding and data are customizable per client.

---

## 🤝 Contributing

This project is currently under active development by the core team. Future contributions will be welcomed after initial release.

---

## 📬 Contact

For more info or a demo, feel free to reach out.
