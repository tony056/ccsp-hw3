(function(){

// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text"><span id = ""></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>

    addButton.on('click', function(){
		$(tmpl).prependTo(mainUl).addClass('is-editing').find('input').focus();
	});
	mainUl.on('keyup', 'input', function(c){
		if(c.which === 13){
			var input = $(this);
			var li = input.parents('li');
			li.find('span').text(input.val());
			li.removeClass('is-editing');
			//refreshSave();
			createData(input.val(), mainUl.find('li').length , 1);
		}
	});
	$('.main,.delete,.done').sortable({
		connectWith: ".main,.done,.delete",
		tolerance: "pointer",
		start: function(event, ui){
			//console.log("start");
			$('#placeholder').addClass('is-dragging');
		},
		stop: function(event, ui){
			//console.log("stop");
			$('#placeholder').removeClass('is-dragging');
			//refreshSave();
			load();
		},
		receive: function(event, ui){
			//console.log("receive");
			var isDone = $(this).hasClass('done');
			//console.log(isDone);
			if(isDone === true){
				//$(ui.item).appendTo(mainUl).addClass('is-done');
				//console.log('re: '+$(ui.item).find('span').attr('id'));
				refreshData($(ui.item).find('span').attr('id'));
			}else{
				deleteData($(ui.item).find('span').attr('id'));
				$(ui.item).remove();
			}
			load();
			//refreshSave();

		}
		
	});

	load();

	function save(){
		// var arr = [];

		// var i = 0;
		// mainUl.find('span').each(function(){
		// 	var content = {
		//  		status: false,
		//  		text: "",
		//  		id: i 
		//  	};
		//  	i+=1;
		//  	if($(this).parents('li').hasClass("is-done")){
		//  		content['status'] = true;
		//  		content['text'] = $(this).text();
		//  		arr.push(content);
		//  	}
		// });

		//localStorage.todoItems = JSON.stringify(arr);

	}

	function refreshSave(){
		// if(localStorage.todoItems !== null)
		// 	delete localStorage.todoItems;
		save();
	}

	function load(){
		var arr = [];
		mainUl.empty();
		doneUl.empty();
		deleteUl.empty();
		$.getJSON('/items', function(data){
			//console.log('dsadasd'+data);
			
			arr = JSON.parse(JSON.stringify(data));
		
			//console.log('arr: '+ arr);
			// var arr = JSON.parse(localStorage.cctodoItems);
			if(arr !== null){
				for(var i = 0;i < arr.length; i++){
					//console.log('val: '+ $(tmpl).find('span').attr('id'));
					//$(tmpl).find('span').attr('id', arr[i].id.toString());
					if(arr[i]['status'] === true){
						$(tmpl).appendTo(mainUl).addClass('is-done').find('span').attr('id', arr[i].id.toString()).text(arr[i]['text']);
					}
					else{
						$(tmpl).appendTo(mainUl).find('span').attr('id', arr[i].id.toString()).text(arr[i]['text']);
					}
				}
			}
		});
	}

	function createData(text, index, status){
		console.log('index: '+ index);
		var Data = {
			'status' : false,
			'id': 0,
			'position': index,
			'text': text
		};

//console.log('fuck1');
		$.ajax({
			type: 'POST',
			data: Data,
			url: '/items',
			dataType: 'JSON'
		}).done(function(response){
			if(response.msg === ''){
				//console.log('fuck');
				load();
			}else{
				alert('Error: ' + response.msg);
			}
		});
		
	}

	function deleteData(id){
		$.ajax({
			type: 'DELETE',
			url: '/items/'+id
		}).done(function(response){
			if (response.msg === '') {
	      		
	      	}
	      	else {
	        	alert('Error: ' + response.msg);
	      	}
		});
		//load();
	}

	function refreshData(id){
		$.ajax({
			type: 'PUT',
			url: '/items/' + id
		}).done(function(response){
			if(response.msg === ''){

			}else{
				alert('Error ' + response.msg);
			}
		});
		//load();
	}

}());

