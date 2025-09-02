# Finance clearance app

Automate finance clearance in school

### Why build this finance clearance app ?

In our school before examinations students must get a clearance pass to make sure they don't owe the school any fees. This is done manually and is a long and tedeous process

Our goal is to automate this process to enhance quality of studies in the university.


### How does is work ?

##### * The User Part

To use our system,the student must first of all login or register his with his email provided by the school
Then he will be brougth to the homescreen where he can enter as many receipt Ids as he wants. If those receipts are valid and correspond to his name he wil get a clearance if they match the requested amount

If not he will get an error message.
Every clearance contains the name of beneficiary , the receipts used and a unique ID

##### *  The Admin part

A good system is the system that functions even on edge cases. So we created an admin panel for the administrators. 

There they can check student's profile, edit their information if needed or manually give clearances to any student 

Clearances given by admins are marked "Given by admin " in place or receipts used

##### * Under the hood

We are going to give a simple explanation of the underogoing processes

User's and admin's passwords are encrypted and stored in different tables inside the database

All user's information such as name, email, fees,clearances are strored in the table **profile**

To avoid fraud everytime a receipt is used to give a clearance, it is stored in the table **clearance**

Admins can consult the list of all clearances ever gave thanks to that list

Users also get the possibility to reset their password if they forgot it.They will get an email to their address which they can use to set up a new password

**Admins don't have a recovery password system**


### Tech stack

So to build this web application, we used :

* On the frontend **React.js**
* On the backend **Node.js(express)**
* For the database **MySql**

For deployment we used

* **Vercel** : to host the frontend
* **Render** : to host the backenddd
* **Aiven :** to host the MySql database
