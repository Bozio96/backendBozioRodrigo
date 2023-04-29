const form = document.getElementById('signupForm')

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}

    data.forEach((value,key)=>obj[key]=value) //Esa notacion de corchetes crea una nueva clave con el nombre que le pasamos por parametro

    const url = '/api/users';
    const headers = {
        'Content-Type': 'application/json',
    }
    const method = 'POST';
    const body = JSON.stringify(obj);

    fetch(url, {
        headers,
        method,
        body
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        window.location.href = '/api/login'
    })
    .catch(error => console.log(error))
})