const socket =io()
const form = document.getElementById("form-send")
if(form){
    form.addEventListener("submit",(e)=>{
        e.preventDefault()
        const content = e.target.elements.content.value
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE",content)
            e.target.elements.content.value=""
        }

    })
}