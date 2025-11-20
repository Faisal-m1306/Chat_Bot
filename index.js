// Get the elements
const openMenu = document.getElementById("openMenu");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// When the user clicks the open menu button, open the menu
openMenu.addEventListener("click", function() {
    sideMenu.style.width = "250px";  // Show the menu
    document.body.style.marginLeft = "250px"; // Move content to the right
});

// When the user clicks the close button inside the menu, close the menu
closeMenu.addEventListener("click", function() {
    sideMenu.style.width = "0";  // Hide the menu
    document.body.style.marginLeft = "0"; // Move content back to the original position
});


let prompt=document.querySelector("#prompt")
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")

const Api_Url="API_URL_HERE"  // Replace with your API URL

let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}
 
async function generateResponse(aiChatBox) {

let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
            "contents":[
                {"parts":[{text:user.message},(user.file.data?[{inline_data:user.file}]:[])

                ]
            }]
        })
    }
    try{
        let response= await fetch(Api_Url,RequestOption)
        let data=await response.json()
       let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       text.innerHTML=apiResponse    
    }
    catch(error){
        console.log(error);
        
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src=`img.svg`
        image.classList.remove("choose")
        user.file={}
    }
}



function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)

chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

setTimeout(()=>{
let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
    <img src="loading.webp" alt="" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

},600)

}


prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)

    }
})

submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
       let base64string=e.target.result.split(",")[1]
       user.file={
        mime_type:file.type,
        data: base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
})


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})

document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Disable right-click
    alert('Right-click is disabled on this page!'); // Optional alert for user feedback
});

const fs = require('fs');
const path = './Data/ChatLog.json';

// Ensure the 'Data' directory exists
if (!fs.existsSync('./Data')) {
    fs.mkdirSync('./Data', { recursive: true });  // Create the directory if it doesn't exist
}

// Function to load or create the ChatLog file
function loadChatLog() {
    try {
        if (!fs.existsSync(path)) {
            console.log('ChatLog.json not found. Creating a new one...');
            fs.writeFileSync(path, JSON.stringify([]), 'utf8');
            return [];
        }

        const data = fs.readFileSync(path, 'utf8');
        
        // Ensure the file contains valid JSON
        try {
            const messages = JSON.parse(data);
            console.log('Messages loaded:', messages);
            return messages;
        } catch (parseError) {
            console.error('Invalid JSON. Resetting the file.');
            fs.writeFileSync(path, JSON.stringify([]), 'utf8');
            return [];
        }

    } catch (error) {
        console.error('Error handling ChatLog file:', error);
        return [];
    }
}

// Usage example
const messages = loadChatLog();
console.log('Final messages:', messages);
