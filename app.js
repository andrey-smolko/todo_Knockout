function NewTask(text, completed) {
    var self = this;
    self.text = text;
    self.completed = ko.observable(completed);
}

var ViewModel = function(toDoTasks) {             
    var self = this; 

    self.title = 'ToDo List with Knockout';
    self.newTaskText = ko.observable("");
    self.toDoTasks = ko.observableArray(toDoTasks.map(function (task) {
			return new NewTask(task.text, task.completed);
	}));

    self.activeTasks = ko.computed(function(){
        return self.toDoTasks().filter(function(task){
            return task.completed() === false;
        }).length;
    });
    self.completedTasks = ko.computed(function(){
        return self.toDoTasks().length - self.activeTasks();
    })

    self.getLabel = function(){
        return self.activeTasks() > 1 ? 'tasks' : 'task';
    }

    self.enterPress = function(data, event){
        if (event.keyCode === 13){
            self.addTask();
        }
        return true;
    };

    self.addTask = function(){
        if (self.newTaskText().trim() != ""){
            self.toDoTasks.push(new NewTask(self.newTaskText(), false));
        }
        self.newTaskText("");
    }

    self.deleteTask = function(task){
        self.toDoTasks.remove(task);
    }
    self.clearCompleted = function(){
        self.toDoTasks.remove(function(task){
            return task.completed();
        })
    }

    ko.computed(function () {
			localStorage.setItem('todos-knockoutjs', ko.toJSON(self.toDoTasks));
	});
};

var savedData = ko.utils.parseJson(localStorage.getItem('todos-knockoutjs'));
ko.applyBindings(new ViewModel(savedData || [])); 