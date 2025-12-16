<img width="792" height="299" alt="image" src="https://github.com/user-attachments/assets/adbe6ca1-990d-473c-b752-6c2225f536d4" /># Employee-Performance-Review-App
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
LOGIN first time with admin/admin (username/password). this is admin user.
This user can create , edit and delete other employees and admins.
An admin can add new reviews between two users and can manage other users. 
An employee can view thier assigned reviews and then can update them and submit,
Admin can see all reviews and their status, but employee can see only the ones which they reviewed. 

To be implemented 
- Current solution 


eprui has UI related code. 
There are mainly three files. 
app.js - main UI file.
app.cs - css file
package.json - provides BE URL to UI.
        
