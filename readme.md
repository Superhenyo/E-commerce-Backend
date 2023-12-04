<!-- NOTE: modify this file based on your project specifications-->

## E-COMMERCE API DOCUMENTATION

***INSTALLATION COMMAND:***

```npm install```

***TEST ACCOUNTS:***
- Regular User:
     - email: henyo@mail.com
     - pwd: admin12345
- Admin User:
    - email: admin@mail.com
    - pwd: admin12345
    

***ROUTES:***
- User registration (POST)
	- http://localhost:4000/users/register
    - auth header required: NO
    - request body: 
        - firstName (string)
        - lastName (string)
        - email (string)
        - password (string)

- Check if Email exist (POST)
	- http://localhost:4000/users/checkEmail
    - auth header required: NO
    - request body: 
        - email (string)
    
- User Log In (POST)
	- http://localhost:4000/users/login
    - auth header required: NO
    - request body: 
        - email (string)
        - password (string)

- Check User Details (Admin only) (POST)
	- http://localhost:4000/users/:params(userId)/userdetails
    - auth header required: YES
    - request body: none

- Create Order (POST)
	- http://localhost:4000/users/checkout
    - auth header required: yes
    - request body: 
        - productId (string)
        - quantity (number)
        
- Create Order (Admin only) (PUT)
	- http://localhost:4000/users/createAdmin
    - auth header required: yes
    - request body: 
        - id (string)
        - isAdmin (boolean)

- Retrieve All Orders (Admin only) (GET)
	- http://localhost:4000/users/allOrders
    - auth header required: yes
    - request body: none

- Add to Cart (POST)
	- http://localhost:4000/users/cart/addToCart
    - auth header required: yes
    - request body: 
       - productId (String)
       - quantity (String)

- Update Cart (PUT)
    - http://localhost:4000/users/cart/changeQuantity
    - auth header required: yes
    - request body: 
       - productId (String)
       - quantity (String)

- Delete Cart (DELETE)
    - http://localhost:4000/users/removeFromCart/:params(productId)
    - auth header required: yes
    - request body: none

- Update Cart (GET)
    - http://localhost:4000/users/cart/getCartTotals
    - auth header required: yes
    - request body: none

- Create Product (Admin only) (POST)
	- http://localhost:4000/products/create
    - auth header required: YES
    - request body: 
        - name (string)
        - description (string)
        - price (number)
        - quantity (number)

- Retrieve all products (Admin only) (GET)
	- http://localhost:4000/products/all
    - auth header required: YES
    - request body: none

- Retrieve all active products (GET)
	- http://localhost:4000/products/active
    - auth header required: NO
	- request body: none

- Retrieve One Product (GET)
    - http://localhost:4000/products/:params(productId)
    - auth header required: NO
	- request body: none

- Update Product (ADMIN only) (PUT)
    - http://localhost:4000/products/:params(productId)
    - auth header required: yes
	- request body: 
        - name (string)
        - description (string)
        - price (number)
        - quantity (number)

- Archive Product (ADMIN only) (PUT)
    - http://localhost:4000/products/:params(productId)/archive
    - auth header required: yes
	- request body: none

- Archive Product (ADMIN only) (PUT)
    - http://localhost:4000/products/:params(productId)/activate
    - auth header required: yes
	- request body: none
    
    