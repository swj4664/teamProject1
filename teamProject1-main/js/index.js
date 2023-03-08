// --------------- 카카오맵 ---------------

var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(36.436373, 128.034173), // 지도의 중심좌표
        level: 13 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다


// 지도를 전달받은 위도, 경도 값으로 부드럽게 이동시키는 함수
function panTo(a, b) {
    var moveLatLon = new kakao.maps.LatLng(a, b);
    map.panTo(moveLatLon);
}


// 화면에 마커를 표시하는 함수
var markers = [];
// 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
var bounds = new kakao.maps.LatLngBounds();    
function addMarker(position) {
    var marker = new kakao.maps.Marker({
        position: position
    });
    marker.setMap(map);
    markers.push(marker);
}

var marker
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        // marker = new kakao.maps.Marker({ position : markers[i] });
        markers[i].setMap(map);
        // bounds.extend(markers[i]);
    }
}

function showMarkers() {
    setMarkers(map)
}

function hideMarkers() {
    setMarkers(null);
}



// ---------------------------------------------------


var global = []
$.get("info.json", function (data) {
    global = data.records
    // cityMarker('강원도')     // 초기에 선택된 강원도 마크 표시를 위해 함수 호출
    useData(data.records)
});

function cityMarker(city) {   // 시도명을 인수로 받아 마크를 표시하는 함수선언
    let cityList = global.filter((a) => {
        let sidoList = a.sidoName.split(' ')
        return sidoList[0] === city
    })

    for (let i in cityList) {
        addMarker(new kakao.maps.LatLng(cityList[i].lat, cityList[i].lng));
    }

    // 지도위치를 현재 선택한 도시의 첫번째 레코드의 위도, 경도값으로 이동하는 함수 호출
    panTo(cityList[0].lat, cityList[0].lng)
    // }

}

// 시도명을 인수로 받아 마크를 표시하는 함수선언
function cityMarker2(city) {   
    let cityList = global.filter((a) => {
        let sidoList = a.sidoName.split(' ')
        return sidoList[1] === city
    })
    
    for(let i in cityList) {
        addMarker(new kakao.maps.LatLng(cityList[i].lat, cityList[i].lng));
    }

    // 지도위치를 현재 선택한 도시의 첫번째 레코드의 위도, 경도값으로 이동하는 함수 호출
    panTo(cityList[0].lat, cityList[0].lng)
    
}


// 시도명을 인수로 받아 구군셀렉트를 나타내는 함수선언
function sebu(city) {   
    let sebuList = []
    let option = ''

    let cityList = global.filter((a) => {
        let sidoList = a.sidoName.split(' ')
        if(sidoList[0] === city){
            return sidoList
        }
    })
    
    for(let i in cityList){
        let abc = []
        abc = cityList[i].sidoName.split(' ')
        if(abc[1] != null){
            sebuList.push(abc[1])
        }
    }
    
    let sebuIndex = sebuList.filter((a, b) => sebuList.indexOf(a) === b);
    sebuIndex.sort()

    sebuIndex.map((a)=> {
        option += `<option value="${a}">전체</option>`
    })

    sebuIndex.map((a)=> {
        option += `<option value="${a}">${a}</option>`
    })

    map.setLevel(12)
    panTo(cityList[0].lat, cityList[0].lng)
    $('#detail').html(option)
}


function sebuMove(city){
    let cityList = global.filter((a) => {
        let sidoList = a.sidoName.split(' ')
        if(sidoList[0] === city){
            return sidoList
        }
    })
}



// 시도 목록을 button 상자에 표시하는 함수
function useData(globalData) {
    let list = globalData.map((a, b) => {
        let sidoList = a.sidoName.split(' ')
        return sidoList[0]
    })

    let cityIndex = list.filter((a, b) => list.indexOf(a) === b);
    cityIndex.sort()
 
    let button = ''

    cityIndex.map((value) => {
        button += `<button id="btnn" type="button" value="${value}">${value}</button>`
    })
    $('#btn').html(button)
}


//이벤트
$('#detail').change(function () {
    hideMarkers()   // 선택을 변경했을때 표시된 마커 숨기기
    let city = $(this).val()    // 선택된 시도명을 추출해서
    cityMarker2(city)   // 마커를 표시하는 함수를 호출문에 넣어줌
    sebuMove(city)
})

$('#detail').children("option:selected").click(function () {
    alert('asdfasdf');
})



$('#btn').click((e) => {
    hideMarkers()
    let city = e.target.value
    cityMarker(city)
    sebu(city)
    $(this).addClass('on')
})




