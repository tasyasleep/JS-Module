const cElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.className = className || '';
    elem.innerText = text || '';
    return elem;
}

const gElem = param => {
    const elem = document.querySelector(param);
    elem.clear = function() {
        this.innerHTML = '';
        return this;
    }
    elem.add = function(listOfElem) {
        this.append(...listOfElem);
        return this;
    }
    return elem;
}

const sheduleTasks = [
    { start: 0, duration: 15, title: "Exercise" },
    { start: 25, duration: 30, title: "Travel to work" },
    { start: 30, duration: 30, title: "Plan day" },
    { start: 60, duration: 15, title: "Review yesterday's commits" },
    { start: 100, duration: 15, title: "Code review" },
    { start: 180, duration: 90, title: "Have lunch with John" },
    { start: 360, duration: 30, title: "Skype call" },
    { start: 370, duration: 45, title: "Follow up with designer" },
    { start: 405, duration: 30, title: "Push up branch" }
]
const taskContainer2 = document.querySelector('.task-cont2');
const modalWindow = document.querySelector('.modalWindow');
const timeShedule = document.querySelector('.time_shedule');
const choseTime = document.querySelector('.inp_time');
const duration = document.querySelector('.inp_duration');
const createTitle = document.querySelector('.inp_text');
const changeColor = document.querySelector('.inp_color');

const sheduleHours = (sheduleTime) => {
    for (let i = 1; i <= sheduleTime + 1; i++) {
        let time = '';
        if (i < 6) {
            time = `${i+7}`;
        } else {
            time = `${i-5}`;
        }
        const timeContainer = cElem('div', 'hour');
        const timeContainerForHalf = cElem('div', 'half-an-hour');
        const timeSpan = cElem('span', 'hour', `${time}:00`);
        const timeSpanHalf = cElem('span', 'hour-an-hour-attr', `${time}:30`);
        timeContainer.append(timeSpan);
        timeShedule.append(timeContainer);
        if (time === '5') {
            return;
        }
        timeContainerForHalf.append(timeSpanHalf);
        timeShedule.append(timeContainerForHalf);
    }
};
sheduleHours(9);


class CreateTask {
    constructor() {
        this.createItemsFromForm();
        this.showModal();
        this.validationForm();
        this.showForm();
    }

    showForm() {
        const formContainer = document.querySelector('.form-container');
        const formBtn = document.querySelector('.form_btn');
        formBtn.addEventListener('click', e => {
            if (formContainer.classList[1] === 'disabled') {
                formContainer.setAttribute('class', 'form-container')
            } else {
                formContainer.setAttribute('class', 'form-container disabled')
            }

        })
    }
    validationForm() {
        const createItem = document.querySelector('#saveBtn');
        createItem.addEventListener('click', e => {
            const taskInfo = { 
                start: '', 
                duration: '', 
                title: ''
            };
            const renderInfo = (elem) => {
                const inp = elem.split(':');
                return +inp[0] * 60 + (+inp[1])
            }
            taskInfo.start = renderInfo(choseTime.value) - 8 * 60;
            taskInfo.duration = renderInfo(duration.value) - 8 * 60 - taskInfo.start;
            taskInfo.color = changeColor.value;
            taskInfo.title = createTitle.value;

            if (!(choseTime.value >= duration.value) && !(choseTime.value < choseTime.min || choseTime.value > choseTime.max || duration.value < duration.min || duration.value > duration.max)) {
                const arrTask = sheduleTasks.filter(el =>
                    el.start <= taskInfo.start + taskInfo.duration && el.start + el.duration >= taskInfo.start
                )
               
                    sheduleTasks.push(taskInfo);
                    sheduleTasks.sort((a, b) => a.start - b.start);
                    this.createItemsFromForm();
                    this.showModal()
               
            }
        })

    }
    showModal() {
        const allTasks = document.querySelectorAll(".task2, .task1");
        allTasks.forEach(elem => {
            elem.addEventListener('click', e => {
                const container = cElem('div', 'modalWindow__container');
                const deletebtn = cElem('button', 'delete-btn', `Delete this task`);
                container.append(deletebtn)
                modalWindow.append(container)
                this.deleteTask(deletebtn, elem)
            })
        })
    }
    createItemsFromForm() {
        console.log("sheduleTasks: ", sheduleTasks);
        let taskMain = '';
        taskContainer2.innerHTML = '';
        sheduleTasks.forEach((taskInfo, index, arr) => {
           const taskInShedule = cElem('div');
            taskInShedule.setAttribute("data-key", index);
            if (index === 0) {
                arr.length > 1 && taskInfo.start + taskInfo.duration > arr[index + 1].start ?
                    taskInShedule.setAttribute('class', 'task2') &&
                    taskInShedule.setAttribute('style', `background-color: ${taskInfo.color + '90'};border-left: 4px solid ${taskInfo.color};  height: ${taskInfo.duration*2}px; top: ${taskInfo.start*2}px;`) :
                    taskInShedule.setAttribute('class', 'task1');
                taskInShedule.setAttribute('style', `background-color: ${taskInfo.color + '90'}; border-left: 4px solid ${taskInfo.color}; height: ${taskInfo.duration*2}px; top: ${taskInfo.start*2}px;`);
                taskMain = taskInShedule;
            } else {
                const task1EndingOfTime = taskMain.offsetHeight / 2 + taskMain.offsetTop / 2;
                if (index < arr.length - 1 && taskInfo.start + taskInfo.duration > arr[index + 1].start || taskInfo.start < task1EndingOfTime) {
                    taskInShedule.setAttribute('class', 'task2');
                    taskMain.offsetLeft === 0 ?
                        taskInShedule.setAttribute('style', `background-color: ${taskInfo.color + '90'}; border-left: 4px solid ${taskInfo.color}; height: ${taskInfo.duration*2}px; top: ${taskInfo.start*2}px; left: 50%`) :
                        taskInShedule.setAttribute('style', `background-color: ${taskInfo.color + '90'}; border-left: 4px solid ${taskInfo.color}; height: ${taskInfo.duration*2}px; top: ${taskInfo.start*2}px;`);
                } else {
                    taskInShedule.setAttribute('class', 'task1');
                    taskInShedule.setAttribute('style', `background-color: ${taskInfo.color + '90'}; border-left:  4px solid ${taskInfo.color}; height: ${taskInfo.duration*2}px; top: ${taskInfo.start*2}px;`);
                }
                if (taskInfo.start + taskInfo.duration > task1EndingOfTime || task1EndingOfTime < taskInfo.start) {
                    taskMain = taskInShedule;
                }
            }
            taskInShedule.innerHTML = `
            <div class="title">${taskInfo.title}</div> `;
            taskContainer2.append(taskInShedule);
            taskInShedule.addEventListener('click', e => {
                modalWindow.classList.add('visible');
            })

        });

    }
    deleteTask(btnClose, element) {
        btnClose.addEventListener('click', () => {
            sheduleTasks.splice(element.dataset.key, 1);
            modalWindow.innerHTML = '';
            modalWindow.className += 'disabled';
            this.createItemsFromForm();
            this.showModal()
        })
    }

}

const instance = new CreateTask();
