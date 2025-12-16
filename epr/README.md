<img width="792" height="299" alt="image" src="https://github.com/user-attachments/assets/adbe6ca1-990d-473c-b752-6c2225f536d4" />
Above is just a simple flow between different users and services and DB. This is not illustration of exact classes, for that please check the code. 

# Employee-Performance-Review-App
Employee Performance Review App

Functional Requirements:
- Design a web application that allows employees to submit feedback toward each
other's performance review.
Admin view
- Add/remove/update/view employees
- Add/update/view performance reviews
- Assign employees to participate in another employee's performance review

Employee view
- List of performance reviews requiring feedback
- Submit feedback

NonFunctional Requirement:
- High Available
- latency - API response time <200ms 
- Scalability - assume the organization has 1 lakh employees. And there are 10,000 concurrent employees at peak time of perf reviews
- Durability - Once entered the reviews should not be lost and should be accurate and also a review should point to valid employee

Assumption
- user authorization and authorization is out of scope. For now the views are shown based on role and filter in UI.,
- Employees can not update the review they have submitted
- The term feedback and reviews are interchangeably used here in requirements, and they do not mean 
a feedback on the review received.
- status of a review is either pending or completed, not going with read unread etc. 
- If an admin added a review its called submited
- when a employee submits a review its called submitted.


Core Entities:

1. Users 
    emp_id
    name
    email
    org
    ..
   2. Reviews
    Review_id
    Reviewer
    Reviewee
    Comments
    Rating
    Status

Tech Stack- 
BE - java spring boot for BE
UI - ReactJS
Server - Node JS for UI

DB choice - 
MongoDB and Postgres can be good candidate for this kind of data. 
But we choose Postgres for following reasons:

1. Mongo DB is mostly required when our data is too heavy , which is not a case here
2. Querying like joins to get reviews for one user or by one user etc will not be easy in MongoDB
3. ACID properties are required like ensuring reviews are not lost and review points to valid employee is crutial which is possible with SQL like DB like PostGre

Back of Env estimates:

one user details - 5KB, user storage - 5,000 * 1,00,000 = 50,000,000 = 50MB
review storage - one review = 1000 lines of text =  50KB , for all emp = 50KB * 1,00,000 = 5,000,000,000 = 5GB
.

The Code is as follows:
"epr" Folder contains Backend code. First used needs to be "Admin ADMIN" and password "admin".
BE URL - GET localhost:8080/api/v1/employees, /api/v1/reviews,
APIs implemented are - 
POST localhost:8080/api/v1/employees
body: {
    "name":"name4 ADMIN",
    "email":"e43",
    "role":"ADMIN"
    
}
response 201 created or 500 for duplicate or 403 etc

Similarly there are PUT commands to update Employee details

For Review as well all the GET, POST, PUT commands are implemented.

Usage:
LOGIN first time with admin/admin (username). this is admin user.
This user can create , edit and delete other employees and admins.
An admin can add new reviews between two users and can manage other users. 
An employee can view thier assigned reviews and then can update them and submit,
Admin can see all reviews and their status, but employee can see only the ones which they reviewed. 

###How to run:: 

Install PostGres DB (Reviews and Employees tables will be automatically created when spring boot app starts from BE).

Make sure to have these Postgres properties set

Postgres running on 5432
Datavase name = epr_db
Postgres username=postgres
postgres password=abc123

Backend: 
Run /src/main/java/com/review_app/epr/EprApplication.java (it has main method so run this file). 
BE will run on localhost:8080 (make sure 8080 is not in use already)


UI:
eprui has UI related code. It requires node.js to run. 
Install Node.js and then in the eprui folder, run "npm start" and 
UI will run on: 
locahost:3000 

Enter name as "admin" for the first time. and then you can add more users (Employees) and can login with other user names. 

Somethings which are not implemented and can be done later:
1. For now first user is admin which is hardcoded so that login can happen on first time. Later this can be implemented as signup.
2. For now the basic validation on UI are done like email of user should have '@' character, but not other stuff like name should not be special character and so on.
3. For now there is no password provision in the app, we need to add it in future, the app logs in with name field.
4. Primary key for employee table is Email id.


        
