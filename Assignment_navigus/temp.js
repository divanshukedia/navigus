var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
console.log(dateTime)

<% page.alluser.forEach(function(user){ %>
    <li>Hello</li>
    <li><a href="#"><%= user.username %></a></li>
<% }); %>