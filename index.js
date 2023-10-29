let attachments = [];
for (let index = 0; index < 15; index++) {
    console.log("added attachment");
    attachments[index] = `Attachment ${index}`;
}

function init() {
    document.querySelectorAll('.attachment-cell').forEach(element => {
        element.addEventListener('click', showAttachments);
    });
    console.log("added event listeners");
}

function showAttachments(){
    console.log("show attachment list");
    let attachmentList = document.querySelector('#attachment-list')
    attachmentList.innerHTML = "";
    attachments.forEach(element => {
        attachmentList.innerHTML += `<div class="attachment-item">${element}</div>`;
    });
}