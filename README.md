<div align="center" style="display:flex">
    <a href="https://ssscheduler.netlify.app/">
    <img src="https://user-images.githubusercontent.com/41566813/117802417-8d9c9b00-b2a9-11eb-8103-9f45b7528683.png" width="50px"/>
    </a>
    <h1>SSScheduler</h1>

</div>
<div align="center">

[![Netlify Status][netlify-badge]][netlify-url]

An webapp for team meeting scheduling<br>
This is an web app developed by [Wilson](https://github.com/WilsonBaker), ~~Tudor~~, [Quang](https://github.com/femmon) and [James](https://github.com/jameszu) in SOFTENG 750/COMPSCI 732 course at the University of Auckland. <br><br>
~~Live site is only working for frontend~~<br>

</div>


[netlify-url]: https://ssscheduler.netlify.app/
[netlify-badge]: https://img.shields.io/netlify/93001eba-3346-4c09-92cd-6ac7e8b579a4?style=for-the-badge
[comment]: <> ([netlify-badge]: https://api.netlify.com/api/v1/badges/93001eba-3346-4c09-92cd-6ac7e8b579a4/deploy-status)


<br><br>
## Important Note for the live site:
Only the frontend is working, we haven't set up the backend to the server so the live page will NOT work, it is only used to display the home page for now. <br>
Run the following command to check on your local machine. 

## Another important NOTE
This is designed for multiple users, so if you want to test our locally, please use different browser for differnt users. (Cookie issues)<br>
Possible ways: open up 4 windows, they are a chrome tab, incognito chrome tab, MS Edge tab, MS Edge incognito tab, and etc...


<br><br>

# How to start the backend

### Make sure npm, NodeJs, and MongoDB are installed

<br>
Go to termial, make sure you are at root folder. <br>
Run follwing commands <br>

```
cd sss_backend
npm install
npm start
```
Then you will see the server is listening on port 3001！
<br>
# How to start the frontend

### Make sure npm, NodeJs are installed

<br>
Go to termial, make sure you are at root folder<br>
Run follwing commands <br>

```
cd sss_frontend
npm install 
npm start
```
Note DON'T run npm update!<br>

Then there should be localhost coming up and test it out!

# Here are some screenshots:
Home page:
The user can create event in this page
![image](https://user-images.githubusercontent.com/41566813/117571514-fa395d80-b122-11eb-9a95-86c722696d9a.png)

Sign in page:
The user will need to enter their name for display purpose
![image](https://user-images.githubusercontent.com/41566813/117571526-09b8a680-b123-11eb-82e4-0b3cdd7732a5.png)


Timetable page:
1. The user can choose whichever time they like accrouding to the time limits from the event creator. 
![image](https://user-images.githubusercontent.com/41566813/117805020-9773cd80-b2ac-11eb-8475-3dc5b3636ba9.png)

2. The other users can see other people's availability
![image](https://user-images.githubusercontent.com/41566813/117805204-d0ac3d80-b2ac-11eb-8bf5-14e67c8afe2a.png)

3.With more people you can see the "best time" with colors as well!
![image](https://user-images.githubusercontent.com/41566813/117805394-09e4ad80-b2ad-11eb-923c-fa149d8783b3.png)

## It also work on mobile!
Here are some screenshots!<br>

<img src="https://user-images.githubusercontent.com/41566813/117807408-b6279380-b2af-11eb-96a9-77caddd40f5b.jpg" width="400px"/>
<img src="https://user-images.githubusercontent.com/41566813/117807415-b889ed80-b2af-11eb-8b6e-490cce41dadf.jpg" width="400px"/> <br>
<img src="https://user-images.githubusercontent.com/41566813/117807422-ba53b100-b2af-11eb-9a51-037cdde8f116.jpg" width="400px"/>

# Known issue
If you open the link with mobile, choose some event and close your phone for around 10 second, the frontend will crash for unknown reason. So please close the tab on the mobile one you are not using it. With some investigation, it might casued by the socket connection which we cannot fix for now : (
<br>

# Sprint planning and retro
We sort of used the scrum methodology for our project, where all of us sit down, discuss the issues and male them as story points, you can see the porject board with this link<br>
https://github.com/UoA-COMPSCI732-SOFTENG750-Team-Project/SOFTENG-750-2021-Group-Project-Sand-Serval/projects/1 <br>
Besides, we have our [meeting minutes](https://drive.google.com/file/d/1S729zHs9FiUQpICKNURghnnr4JKvFXTF/view?usp=sharing) for the project, although it is written after we realised we need to include them <br>
: (
