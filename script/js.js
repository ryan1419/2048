{
    var gameData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],     //游戏数据

        gameDataState = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]],//每个格子的碰撞状态，1没碰，0碰了

        aniGird = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],      //显示和执行动画的格子

        bgColor = {
            2: "#eee4da",
            4: "#ede0c8",
            8: "#f2b179",
            16: "#f59563",
            32: "#f67c5f",
            64: "#f65e3b",
            128: "#f0ce74",
            256: "#eccc68",
            512: "#eec54f",
            1024: "#33b5e5",
            2048: "#09c",
            4096: "#n6c",
            8192: "#93c"
        }, //对应数字的背景色

        score = 0, //总分数

        tempScore = 0, //移动一次的分数，用来显示加分动画

        restartType = true, //重新开始游戏开关

        htpState = true, //true正面-没翻转 //false背面-已翻转

        gameState = true; //游戏的状态
}

//initGame();//test
//refresh();//test

//初始化游戏
function initGame(){
    var conu = 0;
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            aniGird[i][j] = $("b").eq(conu);
            aniGird[i][j].css({
                top:90*i+50+"px",
                left:90*j+50+"px"
            }).html(" ");
            conu++;
        }
    }
    createRandomNumber();
    createRandomNumber();
}

//创建随机格子 和 随机数 并插入
function createRandomNumber(){
    if(canInsertNumber()) {
        var arrNum = [2, 4];
        var rX = parseInt(Math.random() * 4);
        var rY = parseInt(Math.random() * 4);
        var ranNum = parseInt(Math.random() * 2);
        var i = 1;
        for(; i <= 100; i++){
            if (gameData[rX][rY] == 0) {
                gameData[rX][rY] = arrNum[ranNum];
                aniGird[rX][rY].css({
                    background: bgColor[arrNum[ranNum]],
                    color: "#000"
                }).animate({
                    width: "80px",
                    height: "80px",
                    top: 90 * rX + 10 + "px",
                    left: 90 * rY + 10 + "px",
                    "font-size": "30px",
                    "line-height": "90px"
                },60,function(){
                    restartType = true;
                }).text(arrNum[ranNum]);
                break;
            }
            rX = parseInt(Math.random() * 4);
            rY = parseInt(Math.random() * 4);
        }

        if(i == 100){
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){
                    if(gameData[i][j] == 0){
                        gameData[i][j] = arrNum[ranNum];
                        aniGird[i][j].css({
                            background: bgColor[arrNum[ranNum]],
                            color: "#000"
                        }).animate({
                            width: "80px",
                            height: "80px",
                            top: 90 * i + 10 + "px",
                            left: 90 * j + 10 + "px",
                            "font-size": "30px",
                            "line-height": "80px"
                        }, 60,function(){
                            restartType = true;
                        }).text(arrNum[ranNum]);
                        break;
                    }
                }
            }
        }
    }
}

//判断是否能插入随机数
function canInsertNumber(){
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            if(gameData[i][j] == 0){
                return true;
            }
        }
    }
    return false;
}

//键盘事件
$("body").keydown(function(e){
    switch (e.keyCode){
        case 37://左
            moveLeft();
            checkScoreLength();
            setTimeout(function(){
                if(checkGameOver()){
                    showGameOver();
                }
            },222);
            resetGameDataState();
            //console.log(gameData);//test
            break;

        case 38://上
            moveUp();
            checkScoreLength();
            setTimeout(function(){
                if(checkGameOver()){
                    showGameOver();
                }
            },222);
            resetGameDataState();
            //console.log(gameData);//test
            break;

        case 39://右
            moveRight();
            checkScoreLength();
            setTimeout(function(){
                if(checkGameOver()){
                    showGameOver();
                }
            },222);
            resetGameDataState();
            //console.log(gameData);//test
            break;

        case 40://下
            moveDown();
            checkScoreLength();
            setTimeout(function(){
                if(checkGameOver()){
                    showGameOver();
                }
            },222);
            resetGameDataState();
            //console.log(gameData);//test
            break;
        }
});

// 向左移动=============================================
function moveLeft(){
    if(canMoveLeft()){
        for(var i = 0; i < 4; i++){
            for(var j = 1; j < 4; j++){
                if(gameData[i][j] != 0) {
                    for (var k = 0; k < j; k++) {
                        if (gameData[i][k] == gameData[i][j] && noOtherNum(i, k, i, j) && gameDataState[i][k]) {
                            gameData[i][k] += gameData[i][j];
                            score += gameData[i][j];
                            tempScore += gameData[i][j];
                            gameData[i][j] = 0;
                            $("#score").html(score);
                            moveAnimateAdd(i, k, i, j);
                            gameDataState[i][k] = 0;
                            break;
                        }

                        if (gameData[i][k] == 0 && noOtherNum(i, k, i, j)) {
                            gameData[i][k] = gameData[i][j];
                            gameData[i][j] = 0;
                            moveAnimate(i, k, i, j);
                            break;
                        }
                    }
                }
            }
        }
        if(tempScore != 0){
            showAddScore(tempScore);
        }
        setTimeout(refresh,200);
        setTimeout(createRandomNumber,241);

        //setTimeout(createRandomNumber,200);
    }
    //setTimeout(refresh,241);//test
}
function canMoveLeft(){
    for(var i = 0; i < 4; i++){
        for(var j = 1; j < 4; j++){
            if(gameData[i][j] != 0) {
                if (gameData[i][j - 1] == 0 || gameData[i][j] == gameData[i][j - 1]) {
                    return true;
                }
            }
        }
    }
    return false;
}
// 向左移动 end ========================================


// 向上移动=============================================
function moveUp(){
    if(canMoveUp()){
        for(var j = 0; j < 4; j++){
            for(var i = 1; i < 4; i++){
                if(gameData[i][j] != 0){

                    for(var k = 0 ; k < i; k++){
                        if(gameData[k][j] == 0 && noOtherNum(k,j,i,j)){
                            gameData[k][j] = gameData[i][j];
                            gameData[i][j] = 0;
                            moveAnimate(k,j,i,j);
                            break;
                        }
                        if(gameData[k][j] == gameData[i][j] && noOtherNum(k,j,i,j) && gameDataState[k][j]){
                            gameData[k][j] += gameData[i][j];
                            score += gameData[i][j];
                            tempScore += gameData[i][j];
                            gameData[i][j] = 0;
                            $("#score").html(score);
                            moveAnimateAdd(k,j,i,j);
                            gameDataState[k][j] = 0;
                            break;
                        }
                    }
                }
            }
        }
        if(tempScore != 0){
            showAddScore(tempScore);
        }
        setTimeout(refresh,200);
        setTimeout(createRandomNumber,241);
        //setTimeout(createRandomNumber,200);
    }
    //setTimeout(refresh,241);//test
}
function canMoveUp(){
    for(var j = 0; j < 4; j++){
        for(var i = 1; i < 4; i++){
            if(gameData[i][j] != 0) {
                if (gameData[i - 1][j] == 0 || gameData[i][j] == gameData[i - 1][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
// 向上移动 end ========================================


// 向右移动=============================================
function moveRight(){
    if(canMoveRight()){
        for(var i = 0; i < 4; i++){
            for(var j = 2; j >= 0; j--){
                if(gameData[i][j] != 0) {
                    for (var k = 3; k > j; k--) {
                        if (gameData[i][k] == gameData[i][j] && noOtherNum(i, k, i, j) && gameDataState[i][k]) {
                            gameData[i][k] += gameData[i][j];
                            score += gameData[i][j];
                            tempScore += gameData[i][j];
                            gameData[i][j] = 0;
                            $("#score").html(score);
                            moveAnimateAdd(i, k, i, j);
                            gameDataState[i][k] = 0;
                            break;
                        }

                        if (gameData[i][k] == 0 && noOtherNum(i, k, i, j)) {
                            gameData[i][k] = gameData[i][j];
                            gameData[i][j] = 0;
                            moveAnimate(i, k, i, j);
                            break;
                        }
                    }
                }
            }
        }
        if(tempScore != 0){
            showAddScore(tempScore);
        }
        setTimeout(refresh,200);
        setTimeout(createRandomNumber,241);
        //setTimeout(createRandomNumber,200);
    }
    //setTimeout(refresh,241);//test
}
function canMoveRight(){
    for(var i = 0; i < 4; i++){
        for(var j = 2; j >= 0; j--){
            if(gameData[i][j] != 0) {
                if (gameData[i][j + 1] == 0 || gameData[i][j] == gameData[i][j + 1]) {
                    return true;
                }
            }
        }
    }
    return false;
}
// 向右移动 end ========================================


// 向下移动=============================================
function moveDown(){
    if(canMoveDown()){
        for(var j = 0; j < 4; j++){
            for(var i = 2; i >= 0; i--){
                if(gameData[i][j] != 0){

                    for(var k = 3 ; k > i; k--){
                        if(gameData[k][j] == 0 && noOtherNum(k,j,i,j)){
                            gameData[k][j] = gameData[i][j];
                            gameData[i][j] = 0;
                            moveAnimate(k,j,i,j);
                            break;
                        }
                        if(gameData[k][j] == gameData[i][j] && noOtherNum(k,j,i,j) && gameDataState[k][j]){
                            gameData[k][j] += gameData[i][j];
                            score += gameData[i][j];
                            tempScore += gameData[i][j];
                            gameData[i][j] = 0;
                            $("#score").html(score);
                            moveAnimateAdd(k,j,i,j);
                            gameDataState[k][j] = 0;
                            break;
                        }
                    }

                }
            }
        }
        if(tempScore != 0){
            showAddScore(tempScore);
        }
        setTimeout(refresh,200);
        setTimeout(createRandomNumber,241);

        //setTimeout(createRandomNumber,200);
    }
    //setTimeout(refresh,241);//test
}
function canMoveDown(){
    for(var j = 0; j < 4; j++){
        for(var i = 2; i >= 0; i--){
            if(gameData[i][j] != 0) {
                if (gameData[i + 1][j] == 0 || gameData[i][j] == gameData[i + 1][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
// 向下移动 end ========================================


//两个数字中间是否有其他的数字
function noOtherNum(goi,goj,curri,currj){
    //左
    if(goi == curri && goj < currj){
        for(var i = goj + 1; i < currj; i++){
            if(gameData[goi][i] != 0){
                return false;
            }
        }
    }
    //上
    if(goj == currj && goi < curri){
        for(var i = goi + 1; i < curri; i++ ){
            if(gameData[i][goj] != 0){
                return false;
            }
        }
    }
    //右
    if(goi == curri && goj > currj){
        for(var i = goj - 1; i > currj; i--){
            if(gameData[goi][i] != 0){
                return false;
            }
        }
    }
    //下
    if(goj == currj && goi > curri){
        for(var i = goi-1; i > curri; i--){
            if(gameData[i][goj] != 0){
                return false;
            }
        }
    }
    return true;
}

//刷新游戏
function refresh(){
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            if(gameData[i][j] == 0){
                aniGird[i][j].css({
                    width:0,
                    height:0,
                    top:90*i+50+"px",
                    left:90*j+50+"px",
                    "font-size": "12px",
                    "text-align": "center",
                    "line-height":0
                }).text("");
            }else{
                aniGird[i][j].css({
                    background:bgColor[gameData[i][j]],
                    width:"80px",
                    height:"80px",
                    top:90*i+10+"px",
                    left:90*j+10+"px",
                    "font-size":getFontSize(gameData[i][j]),
                    "line-height":"90px",
                    color:getFontColor(gameData[i][j])
                }).text(gameData[i][j]);
            }
        }
    }
}

//获得字体的颜色
function getFontColor(val){
    if(val == 2 || val == 4){
        return "#383838";
    }else{
        return "#fff";
    }
}

//获得字体的大小
function getFontSize(numval){
    if(numval >1000){
        return "20px";
    }else{
        return "30px";
    }
}

//移动动画
function moveAnimate(goi,goj,curri,currj){
    aniGird[curri][currj].stop(true,true).animate({
        top:90*goi+10+"px",
        left:90*goj+10+"px"
    },80);
}

//移动碰撞相加动画
function moveAnimateAdd(goi,goj,curri,currj){
    aniGird[curri][currj].stop(true,true).animate({
        top:90*goi+10+"px",
        left:90*goj+10+"px"
    },80,function(){
        aniGird[goi][goj].animate({
            top:90*goi+5+"px",
            left:90*goj+5+"px",
            width:"90px",
            height:"90px"
        },50).animate({
            top:90*goi+10+"px",
            left:90*goj+10+"px",
            width:"80px",
            height:"80px"
        },50);
    });
}

//检测是否GAME OVER
function checkGameOver(){
    if(canInsertNumber()){
        return false;
    }else if(canMoveLeft() || canMoveDown() || canMoveRight() || canMoveUp()){
        return false;
    }else{
        return true;
    }
}

//GAME OVER后显示的动画
function showGameOver(){
    $("#final_score").html(score);
    $("#mask").css("display","block").animate({
        opacity:0.8
    });
    $("#game_over_con").css("display","block");
}

//加分动画
function showAddScore(score){
    $("#add_score").html(score);
    $("#add_score_con").css("display","block").stop(true,true).animate({
        top:"20px",
        opacity:0
    },200,function(){
        $("#add_score_con").css({
            display:"none",
            top:"33px",
            opacity:1
        });
    });
    tempScore = 0;
}

//改变分数字体
function checkScoreLength(){
    if(score.length == 5){
        $("#score").css("font-size","25px");
    }
}

//格子状态初始化
function resetGameDataState(){
    for(var j = 0; j < 4; j++){
        for(var i = 0; i < 4; i++){
            gameDataState[i][j] = 1;
        }
    }
}

//GAME OVER restart
$("#restart").click(function(){
    restart();
    $("canvas").remove();
    var pattern = Trianglify({
        width: window.innerWidth,
        height: window.innerHeight
    });
    document.body.appendChild(pattern.canvas());
});

//初始化所有数据
function restart(){
    if(restartType) {
        restartType = false;
        $("#mask").css({
            opacity: 0,
            display: "none"
        });
        $("#game_over_con").css("display","none");
        tempScore = 0;
        score = 0;
        gameData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        refresh();
        $("#score").html("0");
        createRandomNumber();
        createRandomNumber();
    }
}

$("#lets_play").click(function(){
    if(gameState) {
        $(".start_game").addClass("goup");
        $(".container").addClass("container_show");
        initGame();
    }else{
        $(".start_game").addClass("goup");
        $(".container").addClass("container_show");
    }
    gameState =false;
});

$("#how_to_play").click(function(){
    if(htpState){
        $(".start_title_con").addClass("start_title_con360");
        setTimeout(function(){
            $("#start_game_title1").css("display","none");
            $("#start_game_title2").css("display","none");
            $("#htpb_text_con").css("display","block");
        },180);
        setTimeout(function(){
            htpState = false;
        },500);
    }else{
        $(".start_title_con").removeClass("start_title_con360");
        setTimeout(function(){
            $("#start_game_title1").css("display","block");
            $("#start_game_title2").css("display","block");
            $("#htpb_text_con").css("display","none");
        },180);
        setTimeout(function(){
            htpState = true;
        },500);
    }

});

$("#options").click(function(){
    $(".restart_ask").css("display","none");
    $(".restart_yes").css("display","none");
    $(".restart_no").css("display","none");

    $(".start_title_con").css("display","block");
    $(".lets_play").css("display","block");
    $(".how_to_play").css("display","block");

    $(".start_game").removeClass("goup");
    $(".container").removeClass("container_show");
    $("#lets_play").html("CONTINUE").css("font-size","20px")
});

//重新开始
$("#restart_curr").click(function(){
    $(".start_title_con").css("display","none");
    $(".lets_play").css("display","none");
    $(".how_to_play").css("display","none");

    $(".restart_ask").css("display","block");
    $(".restart_yes").css("display","block");
    $(".restart_no").css("display","block");

    $(".start_game").removeClass("goup");
    $(".container").removeClass("container_show");

});

$("#restart_no").click(function(){
    $(".start_game").addClass("goup");
    $(".container").addClass("container_show");
});

$("#restart_yes").click(function(){
    restart();
    $("canvas").remove();
    var pattern = Trianglify({
        width: window.innerWidth,
        height: window.innerHeight
    });
    document.body.appendChild(pattern.canvas());
    $(".start_game").addClass("goup");
    $(".container").addClass("container_show");
});