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
			console.log("pos: "+ mainUl.find('li').length);
			createData(input.val(), 0 , 1);
		}
	});
	$('.main,.delete,.done').sortable({
		connectWith: ".main,.done,.delete",
		tolerance: "pointer",
		start: function(event, ui){
			$('#placeholder').addClass('is-dragging');
		},
		stop: function(event, ui){
			$('#placeholder').removeClass('is-dragging');
			//console.log('fjkfjkf: '+ $(ui.item.index()));
			console.log('place: '+ ui.item.index());
			refreshPosition($(ui.item).find('span').attr('id'), ui.item.index());
		},
		change: function(event, ui){
			console.log('new : '+ ui.placeholder.index());
			//refreshPosition($(ui.item).find('span').attr('id'), ui.placeholder.index());
		},
		receive: function(event, ui){
			//console.log("receive");
			var isDone = $(this).hasClass('done');
			//console.log(isDone);
			if(isDone === true){
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
			if(data === null) return;
			arr = JSON.parse(JSON.stringify(data));
		
			//console.log('arr: '+ arr);
			// var arr = JSON.parse(localStorage.cctodoItems);
			arr.sort(function(a, b){
				return a.position - b.position;
			});
			if(arr !== null){
				for(var i = 0;i < arr.length; i++){
					if(arr[i]['status'] !== true){
						$(tmpl).appendTo(mainUl).find('span').attr('id', arr[i].id.toString()).text(arr[i]['text']);
					}
					// else{
					// 	$(tmpl).appendTo(mainUl).find('span').attr('id', arr[i].id.toString()).text(arr[i]['text']);
					// }
				}
				for(var i = 0;i < arr.length; i++){
					if(arr[i]['status'] === true){
						$(tmpl).appendTo(mainUl).addClass('is-done').find('span').attr('id', arr[i].id.toString()).text(arr[i]['text']);
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

	function refreshPosition(id, new_position){
		$.ajax({
			type: 'PUT',
			url: '/items/' + id + '/reposition/' + new_position
		}).done(function(response){
			if (response.msg === '') {
	      		
	      	}
	      	else {
	        	alert('Error: ' + response.msg);
	      	}
		});
	}

}());

