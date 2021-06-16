var $ = function(item) {
    return document.querySelector(item);
}

var todoLocalStore = localStorage.getItem("todos");
var done = $(".done");
var todo = $(".todo");
var touchIdx = 0;

if(todoLocalStore) {
    todoLocalStore = JSON.parse(todoLocalStore);
    //render page based on todoLocalStore
    render();
} else {
    //initialize
    todoLocalStore = [];
}

$("#ipt").addEventListener("change", function() {
    todoLocalStore.push({
        content: this.value,
        done: false
    });
    // console.log(todoLocalStore);
    this.value = "";
    render();
})

function genreateTodo(content, checked = '', index) {
    liItem = document.createElement("li");
    liItem.draggable = true;

    //drag fun
    liItem.ondragstart = function() {
        event.dataTransfer.setData("idx", index);
    }
    liItem.ondragover = function() {
        event.preventDefault();
    }
    liItem.ondrop = function() {
        let sourceIdx = event.dataTransfer.getData("idx");
        if(todoLocalStore[index].done === todoLocalStore[sourceIdx].done && sourceIdx !== index) {
            let tContent = todoLocalStore[index].content;
            todoLocalStore[index].content = todoLocalStore[sourceIdx].content;
            todoLocalStore[sourceIdx].content = tContent;
            render();
        } 
    }

    liItem.setAttribute("idx", index);
    //touch fun
    liItem.ontouchstart = function() {
        touchIdx = index;
    }
    liItem.ontouchmove = function() {
        event.preventDefault();
    }
    liItem.ontouchend = function() {
        let touch = event.changedTouches[0];
        let endTodoEle = document.elementFromPoint(touch.pageX, touch.pageY);

        // judge the current node is li or not
        if(endTodoEle.parentNode.nodeName === "LI") {
            let myIdx = parseInt(endTodoEle.parentNode.getAttribute("idx"));
            if(todoLocalStore[touchIdx].done === todoLocalStore[myIdx].done && touchIdx !== myIdx) {
                let tContent = todoLocalStore[touchIdx].content;
                todoLocalStore[touchIdx].content = todoLocalStore[myIdx].content;
                todoLocalStore[myIdx].content = tContent;
                render();
            } 
        }
    }

    liItem.innerHTML = `<label><input id="todo-input" type="checkbox" ${checked} onchange="checkboxChanged(${index})"></label>
                        <p onclick=pEditable() onkeydown="pKeyDown(${index})">${content}</p>
                        <span onclick="delClicked(${index})"></span>`;
    return liItem;
}

function pEditable() {
    event.target.setAttribute("contentEditable", true);
}

function checkboxChanged(index) {
    //change status
    todoLocalStore[index].done = event.target.checked;
    //render again
    render();
}

//change todo content
function pKeyDown(index) {
    if(event.key === "Enter") {
        event.preventDefault();
        // event.target.blur();
        todoLocalStore[index].content = event.target.innerText;
        render();
    }
}

function delClicked(index) {
    //delete item
    todoLocalStore.splice(index, 1);
    //render again
    render();
}

//clear all
function clear() {
    todoLocalStore = [];
    render();
}

function render() {
    //clear
    done.innerHTML = '';
    todo.innerHTML = '';
    let i = 0
    for(etodo of todoLocalStore) {
        if(etodo.done) {
            done.append(genreateTodo(etodo.content, "checked", i));
        } else {
            todo.append(genreateTodo(etodo.content, "", i));
        }
        i ++;
    }
    //change cooresponding num
    $(".todoCount").innerText = todo.children.length;
    $(".doneCount").innerText = done.children.length;
    //data localization
    localStorage.setItem("todos", JSON.stringify(todoLocalStore));
}

function selectAll() {
    for(let i = 0; i < todoLocalStore.length; i ++) {
        todoLocalStore[i].done = true;
    }
    render();
}

function unSelectAll() {
    for(let i = 0; i < todoLocalStore.length; i ++) {
        todoLocalStore[i].done = false;
    }
    render();
}

function changeStyle() {
    let checked = event.target.checked;
    let styleLink = $("#todostyle");
    if(checked) {
        styleLink.setAttribute("href", "./dark.css");
    } else {
        styleLink.setAttribute("href", "./light.css");
    }

}

var allListNodes = [];
function inputChange() {
    let inputVal = event.target.value;
    allListNodes = allListNodes.concat(Array.from(todo.children));
    allListNodes = allListNodes.concat(Array.from(done.children));
    for(node of allListNodes) {
        if(inputVal !== "" && node.children[1].innerText.search(inputVal) !== -1) {
            node.classList.add("highlight");
        } else {
            node.classList = node.classList.remove("highlight");
        }
    }
}





