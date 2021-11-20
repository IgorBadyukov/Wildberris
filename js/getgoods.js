function getGoods() {
    const links=document.querySelectorAll('.navigation-link');

    const getData=()=>{
        fetch('https://wildberris-d90b0-default-rtdb.europe-west1.firebasedatabase.app/db.json')
        .then(response=> response.json())
        .then(data=>{
            localStorage.setItem('goods', JSON.stringify(data));
        });
    };

    links.forEach(link=>{
        link.addEventListener('click',event=>{
            event.preventDefault();
            getData();
        });
    });
}

getGoods();