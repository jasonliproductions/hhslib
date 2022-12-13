function libTab(evt, tabTitle) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabTitle).style.display = "block";
    evt.currentTarget.className += " active";
}

function searchFunction(){
    document.getElementById("search_results").innerHTML = " ";
    document.getElementById("empty_results").innerHTML = " ";
    emptyResult("hidden");
    var centerNo = 0;
    var keyword = document.getElementById("keyword").value;
    var training_function = document.getElementById("training_function").value;
    var selectedCenters = [];
    
    for(i=0; i<7; i++){
        centerNo++;
        if (document.getElementById("center" + centerNo).checked == true){
            selectedCenters.push(document.getElementById("center" + centerNo).value);
        }
    }
    
    const data = {
        keyword: keyword,
        training_function: { 
            prc: [training_function], 
            sccc: [] 
        },
        cent_code: selectedCenters
    };
    
    fetch('https://prctoylib.heephong.org:10443/sku/search', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success (Query):', data);
            appendData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function appendData(data){
    var mainDiv = document.getElementById("search_results");
    var emptyDiv = document.getElementById("empty_results");
    if(data.length == 0){
        emptyResult("hidden");
        //alert("找不到相關搜尋結果!\n建議:\n1.確認關鍵字正確無誤\n2.擴大中心範圍");
        emptyDiv.innerHTML = `找不到相關搜尋結果!<div class="empty_results_subtitles">建議:<br />1.確認關鍵字正確無誤。<br />2.擴大中心範圍。<br />3.使用較少關鍵字。</div>`;
    } else {
        emptyResult("visible");
    for (i=0; i < data.length; i++){

        var toyTitle = data[i].title; //These lines check if the title is too long

        //if (toyTitle.length > 12 && $(document).width() < 780){
            //toyTitle = toyTitle.substring(0, 12) + "...";
        //}


        var status; //These lines change the status text from A/B to natural language
        var color;
        if(data[i].status == "A"){
            status = "●可借出";
            color = "color: #008000";
        } else {
            status = "●已借出";
            color = "color: #ff0000";
        } //Status end

        var illustration;
        if(data[i].illustration.length == 0){
            illustration = 'images/placeholder_noimage.jpg';
        } else {
            illustration = 'https://prctoylib.heephong.org:10443'+ data[i].illustration; //This line acquires the image from the API
        }


        var trainFunction = [];

        if (data[i].prc_train_func.includes("ITEM_01")){ //These if chain turn ITEM_xx into string
            trainFunction.push("大肌肉協調及平衡");
        }

        if (data[i].prc_train_func.includes("ITEM_02")){
            trainFunction.push("感官訓練");
        }

        if (data[i].prc_train_func.includes("ITEM_03")){
            trainFunction.push("小肌肉協調");
        }

        if (data[i].prc_train_func.includes("ITEM_04")){
            trainFunction.push("遊戲技能");
        }

        if (data[i].prc_train_func.includes("ITEM_05")){
            trainFunction.push("基本手部功能");
        }

        if (data[i].prc_train_func.includes("ITEM_06")){
            trainFunction.push("口語前溝通");
        }

        if (data[i].prc_train_func.includes("ITEM_07")){
            trainFunction.push("語言理解/表達");
        }

        if (data[i].prc_train_func.includes("ITEM_08")){
            trainFunction.push("智能訓練");
        }        

        if (data[i].prc_train_func.includes("ITEM_09")){
            trainFunction.push("其他");
        } //Function end

        var callNo; //These lines ensure Call Numbers are shown correctly: If there are no call No, N/A will be shown and if there is only one call No, no separators will be shown.
        if(data[i].callno[0].length == 0 && data[i].callno[1].length == 0 ){
            callNo = data[i].callno.join("") + "N/A";
        } else if(data[i].callno[0].length != 0 && data[i].callno[1].length == 0 ){
            callNo = data[i].callno.join("");            
        } else {
            callNo = data[i].callno.join(", ");
        } //Call No End
        var newTitle = data[i].title.replaceAll('\'', "&quotmasta").replaceAll('\n', "");
        var div = document.createElement("div");
        div.classList.add("thumbnail");
        div.innerHTML= `<a href="toy_details.html" target="_blank" title="`+ data[i].title +`"><img src=` + illustration + ` onclick="pushData('${newTitle}', '${data[i].return_date}', '${data[i].target_age}', '${data[i].prc_train_func}','${data[i].acno}', '${data[i].callno}', '${data[i].illustration}', '${data[i].status}')"` + ` alt="" /></a><h title="`+ data[i].title +`"> `+ toyTitle + `</h><p1 style='` + color + `'>` + status + `</p1><p2>` + "訓練功能: " + trainFunction.join(", ") + `</p2><p2>` + "玩具索引號: " + callNo + `</p2>`;
        mainDiv.appendChild(div);
    }
    paginationFunction();}

}

function emptyResult(visible){
    var paginationVisibility = document.getElementById("pageId");
    paginationVisibility.style.visibility = visible;
}

function pushData(title, return_date, target_age, prc_train_func, acno, callno, illustration, status){
        localStorage.setItem("title", title);
        localStorage.setItem("return_date", return_date);
        localStorage.setItem("target_age", target_age);
        localStorage.setItem("prc_train_func", prc_train_func);
        localStorage.setItem("acno", acno);
        localStorage.setItem("callno", callno);
        localStorage.setItem("illustration", illustration);
        localStorage.setItem("status", status);
}

function toyDetailsFill(){
    getTitle = localStorage.getItem("title"); //This section pushes title into this page
    var newTitle = getTitle.replaceAll("&quotmasta", "'");
    if(getTitle == "" || getTitle.length == 0){
        document.getElementById("title").innerHTML = "書名error!";
    } else{
        document.getElementById("title").innerHTML = newTitle;
    }

    getReturnDate = localStorage.getItem("return_date"); //This section pushes return date into this page
    if (getReturnDate == "" || getReturnDate.length ==0){
        document.getElementById("return_date").innerHTML = "";
    } else{
        var idx = getReturnDate.indexOf(" ");
        var dateString = getReturnDate.substr(0, idx + 1);
        document.getElementById("return_date").innerHTML = "最快惜出時間: " + dateString;
    }

    getAge = localStorage.getItem("target_age"); //This section pushes target age into this page
    if(getAge == "" || getAge.length == 0){
        document.getElementById("target_age").innerHTML += "不適用";
    } else{
        document.getElementById("target_age").innerHTML += getAge;
    }

    getTrainFunction = localStorage.getItem("prc_train_func"); //This section pushes training function into this page
    var trainFunction = [];
    if (getTrainFunction.includes("ITEM_01")){
        trainFunction.push("大肌肉協調及平衡");
    }

    if (getTrainFunction.includes("ITEM_02")){
        trainFunction.push("感官訓練");
    }

    if (getTrainFunction.includes("ITEM_03")){
        trainFunction.push("小肌肉協調");
    }

    if (getTrainFunction.includes("ITEM_04")){
        trainFunction.push("遊戲技能");
    }

    if (getTrainFunction.includes("ITEM_05")){
        trainFunction.push("基本手部功能");
    }

    if (getTrainFunction.includes("ITEM_06")){
        trainFunction.push("口語前溝通");
    }

    if (getTrainFunction.includes("ITEM_07")){
        trainFunction.push("語言理解/表達");
    }

    if (getTrainFunction.includes("ITEM_08")){
        trainFunction.push("智能訓練");
    }        

    if (getTrainFunction.includes("ITEM_09")){
        trainFunction.push("其他");
    }
    document.getElementById("training_function").innerHTML += trainFunction.join(", ");

    getAcNo = localStorage.getItem("acno"); //This section pushes the Account Number into this page
    document.getElementById("acno").innerHTML += getAcNo;

    getCallNo = localStorage.getItem("callno"); //This section pushes Call Number into this page
    if(getCallNo == ","){
        document.getElementById("callno").innerHTML += "N/A";
    } else{
        document.getElementById("callno").innerHTML += getCallNo;
    }

    getIllustration = localStorage.getItem("illustration"); //This section transfers the image into this page
    if(getIllustration.length == 0){
        document.getElementById("thumbnail").innerHTML = `<img src ="images/placeholder_noimage.jpg" alt=""/>`
    } else{
        document.getElementById("thumbnail").innerHTML = `<img src="https://prctoylib.heephong.org:10443` + getIllustration + `" alt="" />`;
    }

    getStatus = localStorage.getItem("status"); //This section pushes borrow status into this page
    if(getStatus == "A"){
        document.getElementById("status").innerHTML += "●可借出";
        document.getElementById("status").style.color = "green";
    } else {
        document.getElementById("status").innerHTML += "●已借出";
        document.getElementById("status").style.color = "red";    
    }

    fetchDescription(getAcNo);
}

async function fetchDescription(acno){
    fetch('https://prctoylib.heephong.org:10443/sku/'+acno)
    .then((response) => response.json())
    .then((data) => {console.log(data); appendDescription(data);})
    .catch((error) => console.log("Error: ", error));
}

function appendDescription(data){
    document.getElementById("Instructions").innerHTML = data[0].play_desc;
    document.getElementById("Quantity").innerHTML = data[0].parts_desc;
}

// pagination



function pageHidden(currentPageNo) {
    console.log("currentPageNo", currentPageNo);
    const pageNoList = document.getElementById("pagination-numbers");
    const listNoItems = pageNoList.querySelectorAll("button");
    
    listNoItems.forEach((item, index) => {
        item.classList.add("hidden");
        if (index == currentPageNo || index == currentPageNo +1   || index == currentPageNo -1 || index == currentPageNo +2   || index == currentPageNo -2 || index == 0 || index == listNoItems.length-1) {
          item.classList.remove("hidden");
        }
        if(index == 0 && index != currentPageNo){
            item.classList.add("firstPage");
        }else if(index == 0 && index == currentPageNo){
            item.classList.remove("firstPage");
        }
        if(index == listNoItems.length-1 && index != currentPageNo){
            item.classList.add("lastPage");
        }else if(index == listNoItems.length-1 && index == currentPageNo){
            item.classList.remove("lastPage");
        }
      });
}


function paginationFunction(){
    document.getElementById("pageId").style.display="flex";
    document.getElementById("pagination-numbers").innerHTML="";
const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("search_results");
const listItems = paginatedList.querySelectorAll("div");


const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const paginationLimit = 12;
const pageCount = Math.ceil(listItems.length / paginationLimit);
let currentPage = 1;

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};

const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }

  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("active");
    }
  });
};

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);

  pageNumber.addEventListener("click", () => {
    pageHidden(index -1);
  });
  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = () => {
  for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
  }
};

const setCurrentPage = (pageNum) => {
  currentPage = pageNum;

  handleActivePageNumber();
  handlePageButtonsStatus();
  
  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;

  listItems.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currRange) {
      item.classList.remove("hidden");
    }
  });
};


  getPaginationNumbers();
  setCurrentPage(1);
  pageHidden(1);
  prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
    pageHidden(currentPage -1);
  });

  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
    pageHidden(currentPage -1);
  });

  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });
}