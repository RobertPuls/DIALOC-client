$(() => {

  $.ajaxSetup({
    crossDomain: true,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `${localStorage.token}`
    }
  });
  
  if(!$("#email").val().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm)){
    console.log("Invalid Email");
  }

  $("#submit").on("click", function() {
    $("#failMessage").hide();
    let newUser = {
      "name": $("#name-input").val(),
      "email": $("#email").val(),
      "password": $("#password").val()
    };
    let path = this.dataset.page;
    fetchPost(`https://dialoc-server.herokuapp.com/${path}`, newUser)
          // signup(user)
          .then(result => {
            localStorage.token= `Bearer ${result.token}`
            // localStorage.id= re
            window.location.href = `user.html?id=${result.id}`})
            .catch(error => {
            console.log(error)
          })
    // $.post(`https://dialoc-server.herokuapp.com/${path}`, newUser).then((res) => window.location.href = `user.html?id=${res.user.id}`).fail(() => $("#failMessage").show());
  });
});
