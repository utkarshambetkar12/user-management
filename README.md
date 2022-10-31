# User Management Website a CRUD Application

This Web App is a CRUD User Management Website - You can Login into the Web App and then Add a New User(CREATE), View a User's Details(READ), Edit a User's Details(UPDATE) and Delete the User (DELETE). This Web App Uses React.js for Frontend and a Combination of Node.js for Server and MySQL for storing data into Database

## Tech Stack 💻

**Client:** [React.js](https://reactjs.org/)

**Server:** [Node.js](https://nodejs.org/en/) + [MySQL](https://www.mysql.com/)

## Features ✨

- Signup, Login/Logout Users 📝

<p align="center">
  <img src="https://user-images.githubusercontent.com/77622315/198928510-f772dfac-2a1e-47a4-be78-6bb469b2f2fc.png" height=420 />
</p>

- Display all Users - Dashboard ✅
<p align="center">
  <img src="https://user-images.githubusercontent.com/77622315/198928866-34a95616-9306-43b4-a794-e870bb03fc5c.png" height=420 />
</p>

- Add a New User - 👤

<p align="center">
  <img src = "https://user-images.githubusercontent.com/77622315/198928981-4a914736-6912-4af0-a5b6-ebc317598d66.png" height=420 />
</p>

- View a User's Details 👀

<p align="center">
  <img src = "https://user-images.githubusercontent.com/77622315/198929379-0070d213-47cb-4436-acd3-414d5731d2bc.png" height=420 />
</p>

- Edit A User's Details ✍🏻

<p align="center">
  <img src = "https://user-images.githubusercontent.com/77622315/198929717-70d72ff6-b8ec-4e1e-9c4b-7714956a9d1a.png" height=420 />
</p>

- Delete a User ❌

<p align="center">
  <img src = "https://user-images.githubusercontent.com/77622315/198929790-11422cc2-128d-41b6-83c8-233762af1de3.png" height=420 />
</p>

## Local Demonstration ⚙️

Step 1 - For Database in MySQL -
          Open MySQL Workbench and CREATE a DATABASE - crudDB and inside crudDB CREATE a Table with the Following DDL Commands
            CREATE TABLE `users` (
            `id` int NOT NULL AUTO_INCREMENT,
            `email_id` varchar(50) NOT NULL,
            `password` varchar(45) NOT NULL,
            `user_name` varchar(50) NOT NULL,
            `mistake_count` int NOT NULL DEFAULT '0',
            `active` int NOT NULL DEFAULT '1',
             PRIMARY KEY (`id`),
             UNIQUE KEY `email_id_UNIQUE` (`email_id`)
            )
         
          Also add a test user into table with the following commands -
          INSERT INTO crudDB.users (id, email_id, password, user_name) VALUES (1, "Test@123.com", "test123", "Test User")
          
Step 2 - For Server(backend) -
         
         In VS Code - Open the backend Directory go to app.js and then change the database values to match your database values
         Then on Terminal -
           cd backend - go to backend directory
           npm install - install all the dependencies
           npm run devStart - this will launch the server on localhost:3001 along with Nodemon
           
Step 3 - For Client(frontend) -
         On Terminal -
          cd frontend - go to the frontend directory
          npm install - install all the dependencies
          npm run start - this will launch the website on localhost:3000


## Where to find me? 👦🏻

[Linkedin](https://www.linkedin.com/in/utkarshambetkar/)
[Twitter](https://twitter.com/utkarshambetkar)



