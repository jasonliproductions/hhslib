function debugFunction(){
    var selectedCenters = [];
    var centerNo = 0;
    var keyword = document.getElementById("keyword").value;

    for(i=0; i<7; i++){
        centerNo++;
        if (document.getElementById("center" + centerNo).checked == true){
            selectedCenters.push(document.getElementById("center" + centerNo).value);
        }
    }

    alert(keyword);
}

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
            console.log('Success:', data);
            appendData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function appendData(data){
    var mainDiv = document.getElementById("search_results");
    var composedData = [];

    for (i=0; i < data.length; i++){

        var toyTitle = data[i].title; //These lines check if the title is too long

        if (toyTitle.length > 12){
            toyTitle = toyTitle.substring(0, 12) + "...";
        } //toyTitle end

        var status; //These lines change the status text from A/B to natural language
        if(data[i].status == "A"){
            status = "●可借出";
        } else {
            status = "●已借出";

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
        composedData.push(data[i]);

        var div = document.createElement("div");
        div.innerHTML= `<div class="thumbnail"><img src=` + illustration + ` onclick="pushData('${data[i].acno}')"` + ` alt="" /><h>' + toyTitle + '</h><p1 id="status_color">` + status + `</p1><p2>` + "訓練功能: " + trainFunction.join(", ") + `</p2><p2>` + "玩具索引號: " + callNo + `</p2></div>`;
        mainDiv.appendChild(div);
    }
}

function pushData(retrievedData){
        alert(retrievedData);
        window.location.href = "toy_details.html";
}
