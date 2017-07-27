<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<script type="text/javascript" src="${ctx}/static/jQuery/jQuery-2.1.4.min.js"></script>
</head>
<body>
	<h1>你好</h1>
	<div>
		<div id="barChart" style="width: 400px; height: 400px"></div>
	</div>
</body>

<script type="text/javascript" src="${ctx}/static/echarts/echarts.min.js"></script>
<script type="text/javascript">
	var myChart = echarts.init(document.getElementById('barChart'));

	// 指定图表的配置项和数据
	var option = {
		title : {
			text : 'ECharts 入门示例'
		},
		tooltip : {},
		legend : {
			data : [ '销量' ]
		},
		xAxis : {
			data : [ "衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子" ]
		},
		yAxis : {},
		series : [ {
			name : '销量',
			type : 'bar',
			data : [ 5, 20, 36, 10, 10, 20 ]
		} ]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
</script>
</html>