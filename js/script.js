import { Calc } from './modules/calc.js'
import { addLeadingZeros, fromNumberToMonetary } from './utils/format.js'
import { scrollToElement, reportEmptyInput } from './utils/animations.js'

var projects = []

class Project {
    constructor(numProject) {
        this.num = numProject
        this.id = `project${numProject}`
        this.nameDefault = `Projeto ${addLeadingZeros(numProject+1)}`
        this.name = this.nameDefault
        this.rate = 0
        this.flow = [0]

        this.createHtmlOfProject()
        this.addEventsToProject()
        this.addFlow()
        if (this.id != 'project0') scrollToElement(this.id)
    }

    createHtmlOfProject() {
        let childId = {}
        let suffixes = ['name', 'delete', 'cost', 'rate', 'flow', 'addFlow', 'rmFlow']
        for (let keyword of suffixes) childId[keyword] = `${this.id}-${keyword}`

        let projectHtml = document.createElement('article')
        projectHtml.id = this.id
        projectHtml.classList = 'h-[26.5rem] w-80 bg-white sm:w-96 shadow-lg rounded-sm p-3 mb-8'
        projectHtml.innerHTML = `
        <div class="h-11 flex gap-x-3 sm:gap-x-6 mb-6">
            <input type="text" name="${childId.name}" id="${childId.name}" placeholder="${this.nameDefault}" class="h-full w-60 sm:w-72 border-b border-gray-400 bg-transparent font-montserrat text-3xl p-0">
            <button id="${childId.delete}" class="h-11 w-11 text-center text-white text-xl font-bold bg-gradient-to-br from-green-500 to-green-600 shadow-sm rounded-full">X</button>
        </div>

        <input type="number" name="${childId.cost}" id="${childId.cost}" placeholder="Valor da Aplicação* (R$)" class="h-9 w-full bg-transparent border border-gray-400 text-right text-lg font-montserrat rounded-sm mb-2">

        <input type="number" name="${childId.rate}" id="${childId.rate}" placeholder="Taxa de Retorno* (%)" class="h-9 w-full bg-transparent border border-gray-400 text-right text-lg font-montserrat rounded-sm mb-2">

        <div id="${childId.flow}" class="h-[12rem] flex flex-col overflow-y-scroll last:mb-0"></div>

        <div class="flex justify-evenly p-2">
            <button id="${childId.addFlow}" class="h-11 w-11 text-center text-white text-2xl font-bold bg-gradient-to-br from-green-500 to-green-600 shadow-sm rounded-full">+</button>
            <button id="${childId.rmFlow}" class="h-11 w-11 text-center text-white text-2xl font-bold bg-gradient-to-br from-green-500 to-green-600 shadow-sm rounded-full">-</button>
        </div>`

        document.getElementById('containerProjects').appendChild(projectHtml)
    }

    addEventsToProject() {
        let child = {}
        let suffixes = ['name', 'delete', 'cost', 'rate', 'flow', 'addFlow', 'rmFlow']
        for (let keyword of suffixes) child[keyword] = document.getElementById(`${this.id}-${keyword}`)

        child.name.addEventListener('input', () => {
            this.name = child.name.value.trim().length ? child.name.value : this.nameDefault
        })

        child.cost.addEventListener('input', () => {
            this.flow[0] = Number(child.cost.value)*-1
        })

        child.rate.addEventListener('input', () => {
            this.rate = Number(child.rate.value)/100
        })

        child.addFlow.addEventListener('click', () => this.addFlow())

        child.rmFlow.addEventListener('click', () => {
            if (this.flow.length > 2) { 
                child.flow.lastChild.remove()      
                this.flow.pop()
                scrollToElement(`${this.id}-flow${this.flow.length-1}`, `${this.id}-flow`)
            }
        })

        child.delete.addEventListener('click', () => this.deleteProject())
    }

    addFlow() {
        let flowHtml = document.createElement('label')
        let flowNum = this.flow.length
        let idInput = `${this.id}-flow${flowNum}`
        let idContainer = `${this.id}-flow`

        flowHtml.classList = "w-full mb-2 flex justify-between items-center"
        flowHtml.htmlFor = idInput
        flowHtml.innerHTML = `
        <span class="w-28 sm:w-32 font-montserrat text-lg sm:text-xl">Tempo ${addLeadingZeros(flowNum)}:</span>
        <input type="number" name="${idInput}" id="${idInput}" placeholder="Retorno* (R$)" class="h-9 w-48 sm:w-60 bg-transparent border border-gray-400 text-right text-lg font-montserrat rounded-sm">`
        document.getElementById(idContainer).appendChild(flowHtml)

        this.flow[flowNum] = 0
        let inputHtmlOfFlow = document.getElementById(idInput)
        inputHtmlOfFlow.addEventListener('input', () => {
            this.flow[flowNum] = Number(inputHtmlOfFlow.value)
        })
        scrollToElement(idInput, idContainer)
    }

    deleteProject() {
        let numInArray = 0
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === this.id) {
                numInArray = i
                break
            }
        }
        document.getElementById(this.id).remove()
        projects.splice(numInArray, 1)
        projects = projects.filter(element => element !== undefined)
    }
}

projects[0] = new Project(0)

const calc = new Calc()
const btnAddProject = document.getElementById('addProject')
const btnClear = document.getElementById('clear')
const btnCalc = document.getElementById('calc')

btnAddProject.addEventListener('click', function() {
    let numLastProject = projects[projects.length-1].num
    let numNewProject = numLastProject + 1
    projects.push(new Project(numNewProject))
})

btnClear.addEventListener('click', function() {
  while (projects.length) projects[0].deleteProject()
  projects.push(new Project(0))
})

btnCalc.addEventListener('click', function() {
    let containerResult = document.getElementById('containerResult')
    containerResult.innerHTML = ''

    function allInputsAreValid() {
        function inputEmpty(id) {
            if (document.getElementById(id).value.trim().length == 0) {
                return true
            }
            return false
        }
    
        for (let project of projects) {

            let idInputCost = `${project.id}-cost`
            if (inputEmpty(idInputCost)) {
                scrollToElement(idInputCost)
                reportEmptyInput(idInputCost)
                return false
            }

            let idInputRate = `${project.id}-rate`
            if (inputEmpty(idInputRate)) {
                scrollToElement(idInputRate)
                reportEmptyInput(idInputRate)
                return false
            }

            for (let time = 1; time < project.flow.length; time++) {
                let idFlowInput = `${project.id}-flow${time}`
                if (inputEmpty(idFlowInput)) {
                    let idFlowContainer = `${project.id}-flow`
                    scrollToElement(idFlowContainer)
                    scrollToElement(idFlowInput, idFlowContainer)
                    reportEmptyInput(idFlowInput)
                    return false
                }
            }
        }

        return true
    }

    function showResult() {
        let table = document.createElement('table')
        table.classList = 'border-separate m-auto'

        let thead = document.createElement('thead')
        thead.classList = 'w-[70rem] text-white bg-green-500'
        thead.innerHTML = `
        <th class="w-16 p-2 font-montserrat text-lg">Projeto</th>
        <th class="w-20 p-2 font-montserrat text-lg">VPL</th>
        <th class="w-8 p-2 font-montserrat text-lg">PBD</th>
        <th class="w-8 p-2 font-montserrat text-lg">TIR</th>
        <th class="w-8 p-2 font-montserrat text-lg">IL</th>`
        table.appendChild(thead)

        let cont = 0
        let backgroundOfRow = ''
        let tbody = document.createElement('tbody')
        for (let project of projects) {
            cont++
            if (cont%2==0) backgroundOfRow = 'bg-gray-200'; else backgroundOfRow = 'bg-gray-100';

           let pbd = calc.PBD(project.rate, project.flow) ?? "Fluxo insuficiente"
            
            tbody.innerHTML += `<tr class="text-right ${backgroundOfRow}">
            <td class="p-2 text-left">${project.name}</td>
            <td class="p-2">${fromNumberToMonetary(calc.VPL(project.rate, project.flow))}</td>
            <td class="p-2">${pbd}</td>
            <td class="p-2">${calc.TIR(project.flow)}%</td>
            <td class="p-2">${calc.IL(project.rate, project.flow)}</td>
            </tr>`
        }

        table.appendChild(tbody)
        containerResult.appendChild(table)
        scrollToElement(containerResult.id)
    }

    if (allInputsAreValid()) {
        showResult()
    } else {
        containerResult.innerHTML = '<p class="text-gray-500 text-center text-lg">Preencha todos os campos corretamente</p>'
    }
})
