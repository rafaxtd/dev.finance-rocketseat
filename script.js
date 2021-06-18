const Modal = {
    open() {
        //Open Modal Form
        //Add active class to Modal

        document.querySelector('.modal-overlay').classList.add('active')


    },

    close() {

        //Close Modal
        //Remove active class from Modal

        document.querySelector('.modal-overlay').classList.remove('active')

    }
}

const Storage = {

    get() {

        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []


    },

    set (transactions) {

        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {

    /*all: [{

        description: 'Energy',
        amount: -50000,
        date: '06/17/2021',

    },
    {

        description: 'Webdesign Project',
        amount: 500000,
        date: '06/17/2021',

    },
    {

        description: 'Internet',
        amount: -20000,
        date: '06/17/2021',

    }], refatoration */

    all: Storage.get(), 

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        //Sum all incomes
        // For each transactions check if it is > 0, and then sum all transactions
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income



    },
    outcomes() {
        let outcome = 0;
        //Sum all outcomes
        // For each transactions check if it is < 0, and then sum all transactions
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                outcome += transaction.amount;
            }
        })

        return outcome

    },

    total() {
        //incomes - outcomes 

        return Transaction.incomes() + Transaction.outcomes();

    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLtransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLtransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "outcome"

        const amount = Utils.formatCurrency(transaction.amount)



        const html = `

        
              <td class="table-description">${transaction.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td>${transaction.date}</td>
              <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove Transaction" />
              </td>
   
        `
        return html
    },

    updateBalance() {

        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('outcomeDisplay').innerHTML = Utils.formatCurrency(Transaction.outcomes());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());



    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        })

        return signal + value

    },

    formatAmount(value) {
        value = value.replace(/\,?\.?/g, "")
        value = Number(value) * 100

         return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")

        return `${splittedDate[1]}/${splittedDate[2]}/${splittedDate[0]}`

    },
    



}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {

        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        	}

    },

    formatData() {

        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        

        return {

            description,
            amount,
            date
        }


    },

    validateFields(){
       

        const { description, amount, date } = Form.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Please, fulfill all required")
        }

    },

 
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
         // check all infos

        Form.validateFields()
        // format data 

        const transaction = Form.formatData()
        // save info and clean up form data

        Transaction.add(transaction)
        Form.clearFields()
        // close modal then

        Modal.close()

        // reload app

       

        } catch (error) {

            alert(error.message)
            
        }

       


    }
}


const App = {

    init() {
        Transaction.all.forEach(DOM.addTransaction);

        DOM.updateBalance();

        Storage.set(Transaction.all)

    },

    reload() {

        DOM.clearTransactions()

        App.init()

    }
}

App.init()











