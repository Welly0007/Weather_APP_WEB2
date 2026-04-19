var form = document.getElementById('searchForm');


form.addEventListener('submit', function (event){
    event.preventDefault();

    const data = new FormData(this);

    fetch("API_Ops.php", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(response => {
        console.log(response);

  })
});