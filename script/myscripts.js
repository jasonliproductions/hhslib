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

    for (i=0; i < data.length; i++){
        var div = document.createElement("div");
        div.innerHTML= 
        data[i].title;
        mainDiv.appendChild(div);
    }
}