(function($) {
  "use strict"; // Start of use strict
  $(activate);
  function activate() {
      $('.nav-tabs').scrollingTabs({
          enableSwiping: true,
          scrollToTabEdge: true,
          disableScrollArrowsOnFullyScrolled: true
      })
              .on('ready.scrtabs', function () {
                  $('.tab-content').show();
              });
  }

  $(function() {
    var INDEX = 0; 
    $("#chat-submit").click(function(e) {
      e.preventDefault();
      var msg = $("#chat-input").val(); 
      if(msg.trim() == ''){
        return false;
      }
      generate_message(msg, 'self');
      var buttons = [
          {
            name: 'Existing User',
            value: 'existing'
          },
          {
            name: 'New User',
            value: 'new'
          }
        ];
      setTimeout(function() {      
        generate_message(msg, 'user');  
      }, 1000)
      
    })
    
    function generate_message(msg, type) {
      INDEX++;
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
      str += "          <span class=\"msg-avatar\">";
      // str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
      str += "          <\/span>";
      str += "          <div class=\"cm-msg-text\">";
      str += msg;
      str += "          <\/div>";
      str += "        <\/div>";
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);
      if(type == 'self'){
       $("#chat-input").val(''); 
      }    
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }  
    
    function generate_button_message(msg, buttons){    
      /* Buttons should be object array 
        [
          {
            name: 'Existing User',
            value: 'existing'
          },
          {
            name: 'New User',
            value: 'new'
          }
        ]
      */
      INDEX++;
      var btn_obj = buttons.map(function(button) {
         return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
      }).join('');
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
      str += "          <span class=\"msg-avatar\">";
      str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
      str += "          <\/span>";
      str += "          <div class=\"cm-msg-text\">";
      str += msg;
      str += "          <\/div>";
      str += "          <div class=\"cm-msg-button\">";
      str += "            <ul>";   
      str += btn_obj;
      str += "            <\/ul>";
      str += "          <\/div>";
      str += "        <\/div>";
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);   
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
      $("#chat-input").attr("disabled", true);
    }
    
    $(document).delegate(".chat-btn", "click", function() {
      var value = $(this).attr("chat-value");
      var name = $(this).html();
      $("#chat-input").attr("disabled", false);
      generate_message(name, 'self');
    })
    
    $("#chat-circle").click(function() {    
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
    
    $(".chat-box-toggle").click(function() {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
    
  })
   
  
  $(function(){
    // You can add Users inside JSON users section
    var _json = {
      users: ["Gupi Gain"],
      chats: [{
        from: 'Gupi Gain',
        msg: 'Mora Dujonai Rajar Jamai!',
        time: '1533263925814',
        action: ''
      }]
    };
      
    init();
    function init () {
      renderData();
    };	
    
    // RENDER METHODS
    function renderData () {
      var _now = $.now();
      getDateTime(_now);
      _json.users.forEach(function (user) {
        var userID = user.replace(/ /g,"_");
        var parentString = '<div class="chatbox" id="'+userID+'">'+
           '<div class="chats">'+
           '<ul></ul>'+
           '</div>'+
           '<div class="sendBox">'+
           '<input type="text" placeholder="enter next line '+ user.split(' ')[0]+'...">'+ 
           '<img src="img/send.png"'+
           '</div>';	
        $('#viewport').append(parentString);
        _json.chats.forEach(function (chat) {
          var _cl;
          (chat.from === user) ? _cl = 'you' : _cl = 'him';
          var dataString = '<li>'+
             '<div class="msg ' + _cl +'">'+
             '<span class="partner">'+ chat.from +'</span>'+
             chat.msg +
             '<span class="time">' + getDateTime (chat.time) + '</span>'+
             '</div></li>';
          $('#viewport #'+ userID +' .chats>ul').append(dataString);		
        });
      });		
    };
    
    function newMsgRender (data) {
      $('#viewport .chats ul>li.pending').remove();
      _json.users.forEach(function (user) {
        var checkID = user.replace(/ /g,"_");
        var _cl = '';
        (data.from === user) ? _cl = 'you' : _cl= 'him';					
        $('#viewport .chatbox#'+ checkID +' .chats ul')
          .append('<li><div class="msg '+_cl+'">'+
                '<span class="partner">'+ data.from +'</span>'+
                data.msg +
                '<span class="time">' + getDateTime (data.time) + '</span>'+
                '</div>'+
                '</li>');	
      });
    }
    
    function pendingRender (typingUser) {
      var pending = '<li class="pending">'+
         '<div class="msg load">'+
         '<div class="dot"></div>'+
         '<div class="dot"></div>'+
         '<div class="dot"></div>'+
         '</div>'+
         '</li>';
      _json.users.forEach( function (user) {
        user = user.replace(/ /g,"_");
        if(user !== typingUser) {
          if(!($('#'+ user +' .chats ul>li').hasClass('pending')))
            $('#'+ user +' .chats ul').append(pending);
        }
      });		
    }
    
    // HELPER FUNCTION
    function getDateTime (t) {
      var month 	= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];	
      var d 		= new Date(t/1000),
         month 	= (month[d.getMonth()]),
         day 		= d.getDate().toString(),
         hour 	= d.getHours().toString(),
         min 		= d.getMinutes().toString();
      (day.length < 2) ? day = '0' + day : '';
      (hour.length < 2) ? hour = '0' + hour : '';
      (min.length < 2) ? min = '0' + min : '';		
      var res = ''+month+' '+day+' '+hour+ ':' + min;
      return res;
    }
    
    // KEYPRESS EVENTS HANDLER
    $('#viewport .sendBox>input').keypress(function( e ) {			
      var _id = $(this).closest('.chatbox').attr('id');
      pendingRender(_id);
      if(e.which == 13) {
        var msgFrom;
        _json.users.forEach(function (user) {
          if(user.replace(/ /g,"_") === _id)
            msgFrom = user;
        });
        var msg = $('#'+_id+' .sendBox>input').val();
        msg = msg.replace(/\"/g,'\\"');
        var t = $.now();
        $('#'+_id+' .sendBox>input').val('');
        if(msg.replace(/\s/g, '') !== ''){
          var temp = {
            from: msgFrom,
            msg: msg,
            time: t.toString(),
            action: ''
          }
          _json.chats.push(temp);
          console.log(_json);
          newMsgRender (temp);
        } else {
          $('#viewport .chats ul>li.pending').remove();
        }
      }
    });	
    
    // EVENT HANDLER
    $('#viewport .sendBox>input').focusout(function() {
      $('#viewport .chats ul>li.pending').remove();
    });
  });

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });
  
  $(".toggle-password").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});
$(".vidoe_tabs li a").click(function () {
var vid = document.getElementById("myhelpvideo");
$($($(this).closest(".helpvideosection")).find("#myhelpvideo")).attr("src", $(this).attr('data-url'));
$($(this).closest(".helpvideosection")).find(".nav-item a").removeClass("active");
$(this).addClass("active");  
vid.play();  
});

(function() {


  $("body").addClass(document.cookie);
  // alert(document.cookie)
  document.getElementById("daynight").onclick = function () {
   $("body").toggleClass("nightmode");
   
  };
 
})();




  
  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict
