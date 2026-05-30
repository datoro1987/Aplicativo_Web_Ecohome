fetch("http://localhost:3000/registro", {
method: "POST",
headers: {
    "Content-Type": "application/json"
},
body: JSON.stringify({
    nombre: "Andres",
    email: "test@test.com"
})
})
.then(res => res.json())
.then(data => console.log(data))