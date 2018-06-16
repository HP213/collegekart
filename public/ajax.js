var data = 10;
var circle = $('#downloader');
var upcircle = $('#uploader');
var button = $('#showmore');
var table = $('#loadingtable');
var search = $('#search');
var searchForm = $('#searchform');
var alertBox = $('#alertBox');


$(function () {
    button.click((function () {
        console.log(search.val());
        button.css('display','none');
        circle.css('display','');
        data += 10;
        console.log("previous"+data);
        $.ajax({
            url:"/orders",
            type:'GET',
            contentType: "application/json",
            data:{'data':data
            },
            success: function (response) {
                button.css('display','');
                circle.css('display','none');
                if (response.orders.length < 1){
                    button.text("No More Results To Show");
                }
                if (response.orders.length <10){
                    data -= 10;
                    data += response.orders.length;
                }
                for(order of response.orders){
                    var form = "";
                    var moreInfo = "";
                    if(order.status === 'pending'){
                        form = "<td><span class=\"badge-danger badge\" >" +order.status+"</span></td>"
                    }else {
                        form = "<td><span class=\"badge-success badge\" >" +order.status+"</span></td>"
                    }
                    moreInfo = "<td><a class=\"btn btn-warning btn-rounded btn-block\" href=\"\\orders\\"+order._id+"\">More Info</a></td>";
                    table.append('<tr>' +
                        '<td>' + order.name +'</td>'+
                        '<td>' +  order._id +'</td>'+
                        '<td>' +  order.postalCode +'</td>'+
                        '<td>' +  order.cart.totalQty+'</td>'+
                        '<td>' +  order.cart.totalPrice +'</td>'+
                        '<td>' + new Date(order.createdAt).toString()  +'</td>'+
                        form+
                        moreInfo+
                        '</tr>'
                );

                }
                console.log(data);
            }
        });
    }))
});

$(document).ready(function () {
   searchForm.submit(function (event) {
       event.preventDefault();
       console.log("down ajax is working");
       upcircle.css('display','');
       if (search.val() !== ''){
           button.text('All Results Are Shown');
           button.css('display','none');
           var x;
           x = {
               'search':search.val()
           }
           console.log("previous"+data);
           $.ajax({
               url: "/orders",
               type: 'GET',
               contentType: "application/json",
               data: x,
               success: function (response) {
                   table.html('');
                   if(response.noMatch){
                       alertBox.css('display','');
                   }else {
                       alertBox.css('display','none');
                   }
                   upcircle.css('display','none');
                   for(order of response.orders){
                       var form = "";
                       if (order.status === 'pending') {
                           form = "<td><span class=\"badge-danger badge\" >" +order.status+"</span></td>"
                       }else {
                           form = "<td><span class=\"badge-success badge\" >" +order.status+"</span></td>"
                       }
                       moreInfo = "<td><a class=\"btn btn-warning btn-rounded btn-block\" href=\"\\orders\\"+order._id+"\">More Info</a></td>";
                       table.append('<tr>' +
                           '<td>' + order.name +'</td>'+
                           '<td>' +  order._id +'</td>'+
                           '<td>' +  order.postalCode +'</td>'+
                           '<td>' +  order.cart.totalQty+'</td>'+
                           '<td>' +  order.cart.totalPrice +'</td>'+
                           '<td>' + new Date(order.createdAt).toString()  +'</td>'+
                           form+
                           moreInfo+
                           '</tr>'
                       );
                   }
               }
           })
           }else {
               upcircle.css('display','none')
           }
   })
});
