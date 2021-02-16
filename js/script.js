const Modal = {
    openClose(id) {
        let el = document.getElementById(`${id}`)
        el.classList.toggle('active')
        console.log(el)
    }
}

const Storage = {
    set() {
        localStorage.setItem('transactions', JSON.stringify(Transaction.all))
    },

    get() {
        return JSON.parse(localStorage.getItem('transactions')) ||
            []
    }
}

const Utils = {
    formatCurrency(value) {
        let signal = value < 0 ? '-' : ''
        value = Number(value) / 100
        value.toFixed(2)
        value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })


        return value
    },

    calcProfit(transaction) {

        const profit = 0
        profit = transation.amount * transaction.profit

        return profit

    },

    formatAmount(value) {

        value = Number(value) * 100

        return value
    }
}

const Transaction = {

    all: Storage.get(),

    expenses() {
        let amount = 0

        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                amount += transaction.amount
            }
        })

        return Number(amount)
    },

    incomes() {
        let income = 0

        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })

        return income
    },

    profit() {
        let profit = 0
        Transaction.all.forEach((transaction) => {
            profit += transaction.profit
        })

        return profit
    },

    total() {
        let total = Transaction.profit() + Transaction.expenses()

        return total
    },

    add(transaction) {

        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    }
}

const Form = {

    descriptionIncome: document.querySelector('#descriptionIncome'),
    profit: document.querySelector('#profit'),
    amountIncome: document.querySelector('#amountIncome'),

    descriptionExpense: document.querySelector('#descriptionExpense'),
    amountExpense: document.querySelector('#amountExpense'),

    getValueIncome() {
        return {
            description: Form.descriptionIncome.value,
            profit: Form.profit.options[Form.profit.selectedIndex].value,
            amount: Form.amountIncome.value
        }
    },

    getValueExpense() {
        return {
            description: Form.descriptionExpense.value,
            amount: Form.amountExpense.value
        }
    },

    formatExpense() {

        const profit = 0

        const signal = '-'

        let { description, amount } = Form.getValueExpense()

        amount = amount.replace('-', '')

        amount = Utils.formatAmount(amount)

        amount = signal + amount

        amount = Number(amount)

        return {
            description,
            amount,
            profit
        }
    },

    formatIncomes() {
        let { description, profit, amount } = Form.getValueIncome()

        amount = amount.replace('-', '')

        const signal = amount < profit ? '.' : ''

        profit = signal + profit

        profit = amount * profit

        profit = Utils.formatAmount(profit)

        amount = Utils.formatAmount(amount)

        return {
            description,
            profit,
            amount
        }
    },

    validateField() {
        if (Form.descriptionIncome.value == '' ||
            Form.profit.value == '' ||
            Form.amountIncome.value == '') {
            throw new Error('Preencher todos campos!')
        }
    },

    validateFieldExp() {
        if (Form.descriptionExpense.value == '' ||
            Form.amountExpense.value == '') {
            throw new Error('Preencher todos campos!')
        }
    },

    clearField() {
        Form.descriptionIncome.value = ''
        Form.profit.value = ''
        Form.amountIncome.value = ''
    },
    clearFieldExp() {
        Form.descriptionExpense.value = ''
        Form.amountExpense.value =''
    },


    submitIncome(event) {

        event.preventDefault()

        try {

            Form.validateField()

            let transaction = Form.formatIncomes()

            Transaction.add(transaction)

            Form.clearField()


            Modal.openClose('icomesModal')
        } catch (error) {
            alert(error.message)
        }
    },

    submitExpense(event) {

        event.preventDefault()

        try {

            Form.validateFieldExp()

            let transaction = Form.formatExpense()
            Transaction.add(transaction)

            Form.clearFieldExp()

            Modal.openClose('expensesModal')

        } catch (error) {

            alert(error.message)

        }

    }
}

const DOM = {

    transactionContainer: document.querySelector('#table tbody'),

    addTransaction(transaction, index) {


        let tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLtransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLtransaction(transaction, index) {

        amount = Utils.formatCurrency(transaction.amount)

        const CSSclass = transaction.amount < 0 ? 'expense' : 'income'

        const html = ` 
            
            <td>${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td><img src="./assets/minus.svg" alt="" onclick="Transaction.remove(${index})" ></td>
        
        `
        return html
    },

    updateBalance() {

        document.querySelector('#displayExpenses').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.querySelector('#displayIncomes').innerHTML = Utils.formatCurrency(Transaction.incomes())

        if (Transaction.total() < 0) {
            document.querySelector('.card.total').style.background = '#c42924'
        } else {
            document.querySelector('.card.total').style.background = ''
        }
        document.querySelector('#displayTotal').innerHTML = Utils.formatCurrency(Transaction.total())
    }
}



const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        Storage.set()
        DOM.updateBalance()
    },

    reload() {

        DOM.transactionContainer.innerHTML = ''

        App.init()
    }
}

App.init()



