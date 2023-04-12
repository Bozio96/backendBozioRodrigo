const socket = io();
//const productsContainer = document.getElementById("products");

const swal = async()=>{
  const chatBox = document.getElementById('chatBox')
  
  try {
    const result = await Swal.fire({
      title: 'Bienvenidos al chat',
      input: 'text',
      text: 'Por favor identificate como usuario',
      inputValidator: value=>{
        return !value && 'Necesitas ingresar un usuario para continuar'
      },
      allowOutsideClick: false
    })
    const user = result.value

    socket.emit('newUser', user)

    socket.on('userConnected', user =>{
      Swal.fire({
        text: `Bienvenido ${user} al chat`,
        toast: true,
        position: 'top-right',
        showConfirmButton:false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        background: '#e1e1e1'
      })
    })

    chatBox.addEventListener('keyup', e=>{
      if(e.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
          socket.emit('message', {user, message: chatBox.value})
          chatBox.value = ''
        }
      }
    })

  } catch (error) {
    console.log(error);
  }
}

socket.on('messageLogs', data =>{
  const log = document.getElementById('messageLogs')
  let messages = ''

  data.forEach(message => {
    messages = messages + `${message.user}: ${message.message} </br>`
  })

  log.innerHTML = messages
})
/* 
socket.on("realtimeproducts", (productos) => {
  const { products } = productos;
  productsContainer.innerHTML = "";
  products.forEach((prod) =>
    productsContainer.append(productContainer(prod))
  );
});

const productContainer = (prod) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <h2>${prod.title}</h2>
    <p>${prod.description}</p>
    <p>Code: ${prod.code}</p>
    <p>Stock: ${prod.stock}</p>
    <p>Price: ${prod.price}</p>
    `;
  return div;
};
 */

swal()