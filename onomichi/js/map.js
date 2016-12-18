

window.onload = function(){
  var testPositionData = new Array();
  var imgUrl = new Array();
  var storeName = new Array();

  getData().done(function(json){
    $.each(json.results.bindings, function(i, val) {
      val.locate.value = getCoord(val.locate.value);
      testPositionData[i] = new google.maps.LatLng(val.locate.value[0], val.locate.value[1]); 
      imgUrl[i] = val.img.value;
      storeName[i] = val.name.value;
    });

    var testRGBData = [100,10,5];

    var teamName = ["red", "blue", "green"];

    var map = intiMap();//マップのロード
    console.log("testPositionData" + testPositionData[0]);
    console.log("map" + map);
    console.log("teamName" + teamName);
    setMarker(testPositionData, map, teamName, imgUrl, storeName);
    startTrackPosition(map);
  });

  // 自チームの表示
  var val = getUrlVars();
  viewMyTeam(val["group"]);
}


//オープンデータの取得
function getData(){
  var dfd = $.Deferred();

  get = $.ajax({
    type: 'GET',
    url: 'http://sparql.odp.jig.jp/api/v1/sparql?output=json&force-accept=text%2Fplain&query=select+%3Fid+%3Fimg+%3Fname+%3Flocate+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%3E+%3Chttp%3A%2F%2Fpurl.org%2Fjrrk%23CivicPOI%3E%3B%0D%0A+++%3Chttp%3A%2F%2Fpurl.org%2Fjrrk%23address%3E+%3Faddress.%0D%0A++filter%28regex%28%3Faddress%2C+%22%E5%BA%83%E5%B3%B6%E7%9C%8C%E5%B0%BE%E9%81%93%E5%B8%82%22%29%29%0D%0A++%3Fs+%3Chttp%3A%2F%2Fodp.jig.jp%2Fodp%2F1.0%23genre%3E+%3Chttp%3A%2F%2Fodp.jig.jp%2Fres%2Fcategory%2F%25E9%25A3%259F%25E3%2581%25B9%25E3%2582%258B%3E.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fidentifier%3E+%3Fid.%0D%0A++%3Fs+%3Fp+%3Fid.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fschema.org%2Fimage%3E+%3Fimg.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fname.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fimi.ipa.go.jp%2Fns%2Fcore%2Frdf%23%E5%9C%B0%E7%90%86%E5%BA%A7%E6%A8%99%3E+%3Flocate.%0D%0A++filter%28lang%28%3Fname%29+%3D+%22ja%22%29%0D%0A%7Dorder+by+rand%28%29+limit+100'
  });

  get.done(function(result) {
      var json = JSON.parse(result);
      // $.each(json.results.bindings, function(i, val) {
      //   console.log(val.id.value);
      //   console.log(val.img.value);
      //   val.locate.value = getCoord(val.locate.value);
      //   console.log(val.locate.value);
      //   console.log(val.name.value);        
      // });
      return dfd.resolve(json);
    }).fail(function(result) {
      console.log("Failured")
    }
  );

  return dfd.promise();
}

function split(str, regexp) {
  return str.split(regexp);
}

function getCoord(locate) {
  var splitted = locate.split(/\//);
  splitted.splice(0, 5);
  splitted.pop();
  return splitted;
}

//地図表示　マップを返す
function intiMap(){
  var preLatlng = new google.maps.LatLng(34.408699,133.2037253, 18.19);//尾道市役所の緯度経度
  var mapOptions = {
    zoom: 18,
    center: preLatlng,
    mapTypeControl: false,
    streetViewControl: false,
  };
  var map = new google.maps.Map($("#map").get(0), mapOptions ) ;
  return map;
}

var line;
//マーカーの設置
function setMarker(latlngs, map, teamName, imgUrl, storeName){//latlngsは[[latlng, id], [latlng, id]...]という形式
  var latlng;
  var image = {
    url : "../images/cat.png",
    scaledSize : new google.maps.Size(36, 36)

  }

  // for(latlng of latlngs){
  $.each(latlngs, function(i, latlng) {
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: image
    });

    marker.seeingID = 0;//適当なid
    //設置したマーカーのポップアップを設定
    marker.addListener('click', function(){
      //現在力合クリックしたマーカーへのルートを表示する
      var path = [map.getCenter().toUrlValue(), this.getPosition().toUrlValue()];
      $.get("https://roads.googleapis.com/v1/snapToRoads", {//snapToRoadsメソッドにリクエストを送る
				interpolate: true,//補間のためにノードを増やす？
				key:"AIzaSyCuaxH-7F2GKakj-U0GE9s2qKN1y_qhN-g",//APIのキー
				path: path.join('|'),
			},function(data) {
        var snappedNodes = [];//スナップされたノードを格納する latlng型が入る
        if(line){
          line.setMap(null);
        }
        for (var i = 0; i < data.snappedPoints.length; i++) {
          var latlng = new google.maps.LatLng(data.snappedPoints[i].location.latitude,data.snappedPoints[i].location.longitude);
          snappedNodes.push(latlng);
        }
        line = new google.maps.Polyline({
  				map:map,
  				path:snappedNodes,
  				clickable : false,
  				draggable : false,
  				strokeColor:"#00F",
  				strokeWeight:2,
  			});
			});

      var score;
      /*
      //サーバからのデータの取得（動作確認まだ）
      var url = "/api?uuid";
      $.get(url, {id: this.seeingID}, function(data){
        score = [data.red, data.blue, data.green];
      });
      */
      score = [100, 0, 10];

      var cont = [];//ポップアップの内容
      cont.push('<span id="info">Score');
      for(var i=0;i<3;i++){
        cont.push(teamName[i] + '<span class="score"> ' + score[i] + "</span>");
      }

      var distance = google.maps.geometry.spherical.computeDistanceBetween(map.getCenter(), this.getPosition());
      if(distance < 100){//距離が一定以下ならアクセスボタンが出るようにする
        cont.push('<button type="button" class="btn btn-primary" onclick = "gotoNext()">アクセス可能</button>');
      }

      cont.push("</span>");
      cont.push("<span id=\""i"\">");
      var contTxt = cont.join("<br>");
      var infowindow= new google.maps.InfoWindow({
        position: this.getPosition(),
        content: contTxt,
      });
      removeInfo();

      infowindow.open(map);
    });
  });

  insertInfo(imgUrl, storeName);
}

function insertInfo(imgs, names) {
  getElementById("info");

}

//位置情報の連続取得＆マップの中心に自分を表示。自分の位置はマーカーで表示する
var circle;
var point;
function startTrackPosition(map){
  function successed(position){//位置情報取得に成功したとき、その座標をマップの中心にする
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.panTo(pos);
    if(circle){
      circle.setMap(null);
    }
    if(point)
      point.setMap(null);
    circle = new google.maps.Circle({
      center: pos,
      map: map,
      fillOpacity: 0.3,
      radius: 100,
      strokeColor: "blue",
      fillColor: "#0000FF",
      strokeOpacity: 1,
      strokeWeight: 1,
    });//円を描画
    point = new google.maps.Circle({
      center: pos,
      map: map,
      fillOpacity: 0.3,
      radius: 5,
      strokeColor: "blue",
      fillColor: "#0000FF",
      strokeOpacity: 1,
      strokeWeight: 1,
    });//中心の円を描画
  }

  function failed(){
    alert("位置情報の取得に失敗");
  }
  var options = {
    enableHighAccuracy: true,
    timeout: 100000,
  };
  navigator.geolocation.watchPosition(successed,failed,options);//位置情報の取得
}


function gotoNext(){
  //ここでapi2を叩く
  window.location.href = "gacha.html";
}

function removeInfo() {
  var element = document.getElementById("info");
  if (element) {
    element.parentNode.parentNode.parentNode.parentNode.remove();
  }
}

function viewMyTeam(name) {
  var colors = { red: "#F16868",
                 blue: "#5B73EE",
                 green: "#51E56F" };
  console.log(name);
  if (name == "red") {
    console.log("dddddddddd");
    $("#team-name").html("あかチーム");
    $("#team-name").css("color", colors["red"]);
  } else if (name == "blue") {
    $("#team-name").css("color", colors["blue"]);
    $("#team-name").html("あおチーム");  
  } else if (name == "green") {
    $("#team-name").css("color", colors["green"]);
    $("#team-name").HTML("みどりチーム");  
  }
}

/**
 * URL解析して、クエリ文字列を返す
 * @returns {Array} クエリ文字列
 */
function getUrlVars()
{
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;

        //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
    hash  = url.slice(1).split('&');    
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');    //keyと値に分割。
        vars[array[0]] = array[1];    //先ほど確保したkeyに、値を代入。
    }

    return vars;
}
