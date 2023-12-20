// mptt get data 
let myArrayMinute = [];
let myArrayHour = [];
let myArrayDay = [];
var mqtt;
var reconnectTimeout = 2000;
var temp1, temp2, temp3;
var host = "broker.emqx.io"; // Địa chỉ IP của Mosquitto server
var port = 8083;
function onConnect() {
    console.log("Connected to MQTT server");
    mqtt.subscribe("dulieu1");
    mqtt.subscribe("dulieu2");
    mqtt.subscribe("dulieu3");
}
function onFailure(message) {
    console.log("Connection to MQTT server failed: " + message.errorMessage + " Retrying...");
    setTimeout(MQTTconnect, reconnectTimeout);
}
function MQTTconnect() {
    mqtt = new Paho.MQTT.Client(host, port, "client_id");
    var options = {
        onSuccess: onConnect,
        onFailure: onFailure,
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options);
}
function onMessageArrived(message) {

    if(message.destinationName == "dulieu1"){
        console.log(message.destinationName);
        temp1 = message.payloadString;
    }
    if(message.destinationName == "dulieu2"){
        console.log(message.destinationName);
        temp2 = message.payloadString;
    }
    if(message.destinationName == "dulieu3"){
        console.log(message.destinationName);
        temp3 = message.payloadString;
    }
    addData(temp1, temp2, temp3);
    if (message.payloadString > 10 && message.payloadString < 40){
        let phanTu = document.getElementById("greenWarning");
        phanTu.style.backgroundColor = "green";
    }
    myArrayMinute.push(message.payloadString);
}
MQTTconnect();
//chart 
function addData(temperature1, temperature2, temperature3) {
    const x = new Date().getTime();
    const formattedTime = new Date(x).toLocaleTimeString();

    myChart.data.labels.push(formattedTime);
    myChart.data.datasets[0].data.push(temperature1);
    myChart.data.datasets[1].data.push(temperature2);
    myChart.data.datasets[2].data.push(temperature3);

    if (myChart.data.labels.length > 10) {
        myChart.data.labels.shift();
        myChart.data.datasets[0].data.shift();
        myChart.data.datasets[1].data.shift();
        myChart.data.datasets[2].data.shift();
    }
    myChart.update();
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Line 1',
            fill: false,
            lineTension: 0,
            backgroundColor: 'rgba(0, 0, 255, 1.0)',
            borderColor: 'rgba(0, 0, 255, 0.1)',
            data: [],
            },
            {
                label: 'Line 2',
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(255, 0, 0, 1.0)',
                borderColor: 'rgba(255, 0, 0, 0.1)',
                data: [],
            },
            {
                label: 'Line 3',
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(255, 255, 0, 1.0)',
                borderColor: 'rgba(255, 255, 0, 0.5)',
                data: [],
            },
        ],
    },
    options: {
        legend: { display: true }, // Hiển thị legend để theo dõi tên của mỗi đường
        scales: {
            yAxes: [{ ticks: { min: 0, max: 50 } }],
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            }]
        }
    },
});
var previusValueMinute=0;
var previusValueHours=0;
var previusValueDays=0;
function runEveryMinute() {
    var currentMinute = new Date().getMinutes();
    var currentHours = new Date().getHours();
    var currentDays = new Date().getDay();
    var currentDate = new Date().toLocaleDateString();
    if(currentMinute != previusValueMinute){
        let tong = myArrayMinute.reduce(function(sum, current) {
            return sum + parseFloat(current.replace(",", "."));
        }, 0);
        console.log(tong);
        let average = tong/myArrayMinute.length;
        document.getElementById('1minute').innerHTML = average.toFixed(2)+"°C";
        document.getElementById('timeMinutes').innerHTML = currentMinute+"M";
        myArrayHour.push(average);
        myArrayMinute=[];
    }
    if (currentHours != previusValueHours){
        let tong = myArrayHour.reduce(function(sum, current) {
            return sum + current;
        }, 0);
        let average = tong/myArrayHour.length;
        document.getElementById('1hour').innerHTML = average.toFixed(2)+"°C";
        document.getElementById('timeHours').innerHTML = currentHours+"H";
        myArrayDay.push(average);
        myArrayHour=[];
    }
    if (currentDays != previusValueDays){
        let tong = myArrayDay.reduce(function(sum, current) {
            return sum + current;
        }, 0);
        let average = tong/myArrayDay.length;
        document.getElementById('1day').innerHTML = average.toFixed(2)+"°C";
        document.getElementById('timeDays').innerHTML = currentDate+"";
        myArrayDay=[];
    }
    previusValueMinute = currentMinute;
    previusValueHours = currentHours;
    previusValueDays = currentDays;
}
var remainingTime = (60 - new Date().getSeconds()) * 1000;

setTimeout(function() {
    runEveryMinute();
    setInterval(runEveryMinute, 60000);
}, remainingTime);

// body main
document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('openBtn');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closeBtn');

    // Open the popup
    openBtn.addEventListener('click', function () {
        popup.style.display = 'block';
    });

    // Close the popup
    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Close the popup if clicked outside the content
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});

const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

function publishData() {
    var topic = "dulieu"; // Thay đổi thành chủ đề bạn muốn xuất bản
    var payload = "Hello, MQTT!"; // Thay đổi thành dữ liệu bạn muốn xuất bản
    var message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    mqtt.send(message);
    console.log("Published message on topic: " + topic);
}
