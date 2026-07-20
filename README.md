# Winner's Repo

# Restaurant ERP Backend (5-Hour MVP)

## 1. Authentication ⭐⭐⭐⭐⭐

### APIs

* Register User
* Login
* Logout
* Refresh Token
* Get Current User

### Roles

* Owner
* Manager
* Waiter
* Chef
* Cashier

---

# 2. Menu Management ⭐⭐⭐⭐⭐

### APIs

* Create Menu Item
* Get All Menu Items
* Get Single Menu Item
* Update Menu Item
* Delete Menu Item

### Fields

* Name
* Category
* Price
* Description
* Available
* Preparation Time

---

# 3. Table Management ⭐⭐⭐⭐⭐

### APIs

* Create Table
* Get Tables
* Update Table
* Delete Table
* Change Table Status

### Fields

* Table Number
* Capacity
* Status

### Status

* Available
* Occupied
* Reserved
* Cleaning

---

# 4. Order Management ⭐⭐⭐⭐⭐

### APIs

* Create Order
* Get All Orders
* Get Order By ID
* Update Order
* Cancel Order
* Delete Order
* Change Order Status

### Order Types

* Dine-In
* Takeaway
* Delivery

### Order Status

* Pending
* Accepted
* Cooking
* Ready
* Served
* Completed
* Cancelled

### Order Fields

* Table
* Customer Name (Optional)
* Items
* Quantity
* Notes
* Total Amount
* Created By
* Status

---

# 5. Kitchen Management ⭐⭐⭐⭐☆

### APIs

* Get Pending Orders
* Get Cooking Orders
* Mark Cooking
* Mark Ready
* Mark Served

---

# 6. Billing ⭐⭐⭐⭐☆

### APIs

* Generate Bill
* Get Bill
* Mark Paid

### Fields

* Order
* Tax
* Discount
* Grand Total
* Payment Method
* Payment Status

### Payment Methods

* Cash
* UPI
* Card

### Payment Status

* Pending
* Paid

---

# 7. Customer Management ⭐⭐⭐☆☆

### APIs

* Create Customer
* Get Customers
* Update Customer
* Delete Customer

### Fields

* Name
* Phone
* Email
* Address

---

# 8. Dashboard ⭐⭐⭐☆☆

### APIs

* Today's Revenue
* Today's Orders
* Active Tables
* Pending Orders
* Completed Orders
* Popular Menu Items

---

# Suggested Database Collections

## Users

* name
* email
* password
* role

## Menu Categories

* name

## Menu Items

* category
* name
* description
* price
* preparationTime
* available

## Tables

* tableNumber
* capacity
* status

## Orders

* orderNumber
* table
* orderType
* customer
* items
* totalAmount
* status
* notes
* createdBy

## Order Items

* menuItem
* quantity
* price
* subtotal

## Bills

* order
* tax
* discount
* grandTotal
* paymentMethod
* paymentStatus

## Customers

* name
* phone
* email
* address

---

# Development Priority

1. Authentication
2. Menu Management
3. Table Management
4. Order Management
5. Kitchen Management
6. Billing
7. Dashboard
8. Customer Management

---

# Demo Flow

Login → View Tables → Create Order → Add Menu Items → Send to Kitchen → Chef Marks Ready → Generate Bill → Mark Payment Complete
