# Anomaly Detection Server Web App

# Introduction

Anomaly Detection Server Web App designed for find and detect anomaly according to chosen algorithm. <br>
the user choose algorithm from a radio button that he/she wish for. <br>
the option for the user are: <br>
Hybrid Algorithm - that are default chosen <br>
Linear Regression Algorithm - that the user can change anytime. <br>

![step-0](https://user-images.githubusercontent.com/59093573/120069052-91dbfd00-c08c-11eb-832a-528f0314c446.png)
<br>

Now the user need to upload two ```CSV``` files. click on ```UPLOAD``` ,and the files uploaded to the system. <br>
the CSV files need to be:
1. TRAIN file - valid ```CSV``` file that have the correct flight details.
2. TEST files - valid ```CSV``` file that have the anomaly details, for the system detect.

the system check if the user enter correct files. If the files are not ```CSV``` type or if the user didn't enter any file, and send message accordingly.
<br>

![wrongFiles](https://user-images.githubusercontent.com/59093573/120069088-ba63f700-c08c-11eb-853c-2f506ccf1dc8.png)

<br>

![NoFiles](https://user-images.githubusercontent.com/59093573/120069024-6bb65d00-c08c-11eb-95d9-2051abfc707a.png)

<br>

the system study according to the first ```CSV``` file (the valid flight details) the routine act of the features. <br>
detecting anomaly is base on difference between the first and second files on the same features. <br>
the result of detected anomaly is display in table below the ```UPLOAD``` button. <br>
the result table show a list of all the anomaly the system found. <br>
On the left side of the table is the ```INFORMATION``` that represents the anomaly features. <br>
On the right side of table is the ```LINE``` that represents the anomaly line. <br>

<br>

![correctFiles](https://user-images.githubusercontent.com/59093573/120069126-eb442c00-c08c-11eb-8ebb-eadf0c698e66.png)

<br>

# Before We Start

# Preparation And Download

1.Download node.js version 16.0.0 https://nodejs.org/en/ <br>
2.Install node.js.  <br>
3.Check that npm and node.js are installed: run this in your terminal  ```npm -v``` and ```node -v```  <br>
4.Download webStorm 2021.1.1 https://www.jetbrains.com/webstorm/ <br>
5.Prepare two ```CSV``` files. <br>
6.Clone the project. <br>
7.Run this in your terminal ```npm install```. <br>

# Start

1.Run this in your terminal ```npm start``` for connecting with the server. <br>
2.Go to browser such as Google Chrome and write http://localhost:8080 or click in your terminal on the link that just appear. <br>
3.Now you see my web page. Choose algorithm and upload your ```CSV``` files. <br>
4.Click ```UPLOAD```.

# MVC Design Pattern

Controller : connect between the model and the view. <br>
View : design the web page, display the result of detected anomaly on the screen. <br>
Model : get ```CSV``` files for the user, study the data and detect anomalies, write the result on the table. <br>

<br>

# Code Design and UML:

<br>

<br>

# Video Explanation

# Authors
Dvir Asaf <br>
Or Memiya
