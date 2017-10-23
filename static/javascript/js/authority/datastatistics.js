jQuery(function ($) {
     $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            for (var i=0;i<data.projectList.length;i++){
                $('#group_owner').append('<option value="'+data.projectList[i].pk+'">'+data.projectList[i].fields.NAME+'</option>')
            }
            init();
        },
        error: function(data) {
            console.log('error')
        }

    })

});

function show_change(){
          init();
}


function init(){
   setJobStatus("JobStatus");
}

function setJobStatus(line){
    var group_owner=$('#group_owner').val();
    $.ajax({
        type: "POST",
        url: "/authority/charts/JobStatusStatics/"+line,
        data: {
            group_owner:group_owner,
        },
        datatype: "json",
        success: function (data) {
            console.log(data);
            if (data.result == "Success!") {
                drawJobStatus(parseStatus(line,data.data));
            }
        },
        error: function (err) {
            console.log(err)
        }
    });

}


function parseStatus(line,data){
    var objData=JSON.parse(data)
    console.log(objData);
    console.log("parseStatus");
    var lineModel={};
    var serires1={
        name:'成功',
        type:'line',
        stack: '成功数量',
        data:[],
        color: "green",
    };
    var serires2={
        name:'失败',
        type:'line',
        stack: '失败数量',
        data:[],
        color: "red",
    };
    var serires3={
        name:'执行中',
        type:'line',
        stack: '执行中数量',
        data:[],
        color: "gray",
    };

    var serires4={
        name:'取消',
        type:'line',
        stack: '取消数量',
        data:[],
        color: "",
    };
    var serires5={
        name:'任务总数',
        type:'line',
        stack: '任务总数',
        data:[],
        color: "blue",
    };
    lineModel.xAxisData=[];
      for(var i=0;i<objData.length;i++){
        var obj=objData[i];
        lineModel.xAxisData.push(obj.fields.TIME.substring(5,10));
        console.log(obj);
        serires1.data.push(obj.fields.SUCCESS);
        serires2.data.push(obj.fields.FAILURE);
        serires3.data.push(obj.fields.STARTED);
        serires4.data.push(obj.fields.REVOKED);
        serires5.data.push(obj.fields.TOTAL_JOBS);
    }

    var lineSerires=[];
    lineSerires.push(serires1,serires2,serires3,serires4,serires5);
    lineModel.Id=line;
    lineModel.titleText='任务执行状态';
    lineModel.subtext='近一月';
    lineModel.legendData=['成功','失败','执行中','取消','任务总数'];
    lineModel.series=[];
    for(var i in lineSerires){
        var serie=lineSerires[i];
        serie.markPoint= {
            data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
            ]
        };
        serie.markLine= {
            data : [
                {type : 'average', name: '平均值'}
            ]
        };
        serie.itemStyle= {
            normal: {
                color: lineSerires[i].color,
            }
        },
            lineModel.series.push(serie);
    }

    return lineModel;
}


function drawJobStatus(lineModel){
    var myChart = echarts.init(document.getElementById("JobStatus"));
    var option = {
        title: {
            text:  lineModel.titleText,
            subtext:lineModel.subtext,
            textStyle:{
                color: '#2be1fb',
            },
            top: '7%',
            x: "center"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:lineModel.legendData,
            top: '0%',
            left:"0%"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '30%',
            containLabel: true
        },
        toolbox: {
            show : true,
            feature: {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType: {show: true, type: ['line','bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: lineModel.xAxisData
        },
        yAxis: {
            name:"数量",
            type: 'value'
        },
        series: lineModel.series
    };


    myChart.setOption(option);
}