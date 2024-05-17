# Online store. Full stack application. A training project based on the video https://www.youtube.com/watch?v=H2GCkRF9eko with some changes and additions.

## Backend Technology Stack:
1. Node JS is an environment for JavaScript execution
2. Express is a framework for Node JS applications. It is used to develop business logic for mobile applications and websites.
3. PostgreSQL is a database management system.
4. Sequelize - ORM for relational databases on Node JS.

## Frontend Technology Stack:
1. React JS is a JavaScript library for creating user interfaces
2. React bootstrap graphics
3. Axios requests to the server
4. React-router-dom - navigation
5. Mobx - state management

## Backend

Install PostgreSQL.
Create a database named 'online_store'. Install Node JS.

Go to the 'backend' directory
```
cd backend
```

Installing dependencies
```
npm install
```

Runnung
```
npm run dev
```
The message in the console `Server started on port 4000` indicates the success of the server startup

## Frontend

Go to the 'client' directory
```
cd client
```
Installing
```
npm install
```
Running
```
npm run start
```
If successful, a page will open in the browser.

## Working with the application.
Register a new user. The first user automatically gets the role of an administrator, the next ordinary user.

Admins can fill the database with new products, add goods to the warehouse, edit various properties of goods, change the roles of other users, accompany customer orders. To test the capabilities of the application, you can import the database from the directory 'server/db_files/' by selecting the files 'types.txt ', 'brands.txt ', 'devices.txt ', 'infos.txt ' and by clicking the 'Import Database' button in the 'Admin Panel'.

The user (and the admin too) can view the product catalog. You can choose brands (manufacturer's names), types (for example, TV or refrigerator). You can select one position from the brands and one of the types.

There is a product search bar. The search is conducted by words by product name, brand and type, returning all matches, taking into account the selected brand and type.

You can view various product properties, rate, leave a review about the product, add the product to the cart.

You can edit the quantity of goods in the shopping cart, delete items, and place an order.
An unauthorized user can add products to the shopping cart. Authorization is required for the order. During authorization, the items in the baskets are combined.
