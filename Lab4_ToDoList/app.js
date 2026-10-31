"use strict";
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = "all";
        this.todoInput = document.getElementById("todoInput");
        this.addBtn = document.getElementById("addBtn");
        this.todoList = document.getElementById("todoList");
        this.itemsLeft = document.getElementById("itemsLeft");
        this.clearCompletedBtn = document.getElementById("clearCompletedBtn");
        this.clearAllBtn = document.getElementById("clearAllBtn");
        this.filterButtons = document.querySelectorAll(".filter-btn");
        this.bindEvents();
        this.render();
    }
    bindEvents() {
        this.addBtn.addEventListener("click", () => this.addTodo());
        this.todoInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter")
                this.addTodo();
        });
        this.filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                this.currentFilter = btn.getAttribute("data-filter") || "all";
                this.render();
            });
        });
        this.clearCompletedBtn.addEventListener("click", () => {
            this.todos = this.todos.filter((t) => !t.completed);
            this.render();
        });
        this.clearAllBtn.addEventListener("click", () => {
            this.todos = [];
            this.render();
        });
    }
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text)
            return;
        const newTodo = {
            id: Date.now(),
            text,
            completed: false
        };
        this.todos = [...this.todos, newTodo];
        this.todoInput.value = "";
        this.render();
    }
    toggleTodo(id) {
        this.todos = this.todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
        this.render();
    }
    deleteTodo(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.render();
    }
    updateTodoText(id, newText) {
        const trimmed = newText.trim();
        if (trimmed) {
            this.todos = this.todos.map((t) => t.id === id ? { ...t, text: trimmed } : t);
        }
        else {
            this.deleteTodo(id);
            return;
        }
        this.render();
    }
    render() {
        this.todoList.innerHTML = "";
        const filteredTodos = this.todos.filter((todo) => {
            if (this.currentFilter === "active")
                return !todo.completed;
            if (this.currentFilter === "completed")
                return todo.completed;
            return true;
        });
        filteredTodos.forEach((todo) => {
            const li = document.createElement("li");
            li.className = `todo-item ${todo.completed ? "completed" : ""}`;
            const leftDiv = document.createElement("div");
            leftDiv.className = "todo-item-left";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "todo-checkbox";
            checkbox.checked = todo.completed;
            checkbox.addEventListener("change", () => this.toggleTodo(todo.id));
            const span = document.createElement("span");
            span.className = "todo-text";
            span.textContent = todo.text;
            span.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "text";
                input.className = "edit-input";
                input.value = todo.text;
                leftDiv.replaceChild(input, span);
                input.focus();
                const saveEdit = () => {
                    this.updateTodoText(todo.id, input.value);
                };
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter")
                        saveEdit();
                    if (e.key === "Escape")
                        this.render();
                });
                input.addEventListener("blur", () => saveEdit());
            });
            leftDiv.appendChild(checkbox);
            leftDiv.appendChild(span);
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "🗑";
            deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id));
            li.appendChild(leftDiv);
            li.appendChild(deleteBtn);
            this.todoList.appendChild(li);
        });
        const activeCount = this.todos.filter((t) => !t.completed).length;
        this.itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
    }
}
new TodoApp();
