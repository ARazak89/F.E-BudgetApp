// Sélectionner les éléments du document HTML par leur ID
let totalAmount = document.getElementById("total-amount"); // Champ de saisie pour le budget total
let userAmount = document.getElementById("user-amount");   // Champ de saisie pour le montant de la dépense
const checkAmountButton = document.getElementById("check-amount");   // Bouton "Ajouter une dépense"
const totalAmountButton = document.getElementById("total-amount-button"); // Bouton "Ajouter un budget"
const productTitle = document.getElementById("product-title");       // Champ de saisie pour le titre de la dépense
const amount = document.getElementById("amount");                   // Zone d'affichage du montant total
const expenditureValue = document.getElementById("expenditure-value"); // Zone d'affichage du montant des dépenses
const balanceValue = document.getElementById("balance-amount");       // Zone d'affichage du solde
const list = document.getElementById("list");                         // Liste des dépenses
const notification = document.querySelector(".notification");          // Zone de notification
const historyDiv = document.getElementById('historyDiv');              // Division pour l'historique des dépenses

// Déclaration de variables pour le suivi des données
let tempAmount = 0;         // Stocke le montant total actuel
let expense = 0;            // Stocke le montant total des dépenses
let expenses = [];          // Tableau pour stocker les dépenses
let num = 1;                // Numéro pour l'historique des dépenses
// ====================== Reset function =========================
function resetData() {
    localStorage.removeItem("budget");
    localStorage.removeItem("expenses");
    localStorage.removeItem("expense");
    localStorage.removeItem("balance");
    tempAmount = 0;
    expense = 0
    amount.innerHTML = "0";
    balanceValue.innerText = "0";
    expenditureValue.innerText = "0";
    list.innerHTML = "";
    window.location.href = window.location.href;
}
// ====================== Reset function =========================

// =======Attach resetData function to the "Reset" button=========
document.getElementById("reset-button").addEventListener("click", () => {
    resetData();
});
// =======Attach resetData function to the "Reset" button=========

//==============Function To Disable Edit and Delete Button=========
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};
//==============Function To Disable Edit and Delete Button=========
// Hassane Abdel-Razak
//======================== Add Budget ==============================
totalAmountButton.addEventListener("click", () => {
    tempAmount = parseInt(totalAmount.value);
    //entrer null ou négative
    if (tempAmount === "" || tempAmount < 0) {
        alert("Erreur");
        totalAmount.value = "";
    } else {
        //Set Budget
        let budget = tempAmount;
        console.log("budget " + budget);
        let sum = parseInt(amount.innerText) + budget;
        amount.innerText = sum;
        //Set Balance
        balanceValue.innerText = sum - expenditureValue.innerText;
        let balance = balanceValue.innerText;
        // Store the balance in localStorage
        localStorage.setItem('balance', balance);
        // Store the budget in localStorage
        localStorage.setItem("budget", sum);
        //Clear Input Box
        totalAmount.value = "";
        tempAmount = sum;
        console.log("tempAmount " + tempAmount);

        // Display the success notification
        displayNotification('Ajout de budget', 'Votre budget a été rajouté avec success')
    }
});
//======================== Add Budget ==============================

//======================== Add Expense ==============================
checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
        alert('Dépense sans titre');
        return false;
    }
    //null or negative value checks
    let temp = userAmount.value;
    if (temp == 0 || temp < 0) {
        alert('Dépense sans montant');
        return false;
    }
    // Check if the expense with the same name exists in expenses array
    let existingExpenseIndex = -1;
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].name === productTitle.value) {
            existingExpenseIndex = i;
            break;
        }
    }
    if (existingExpenseIndex !== -1) {
        // Update the existing expense value
        let newAmount = parseInt(userAmount.value);
        expenses[existingExpenseIndex].value += newAmount;
        localStorage.setItem("expenses", JSON.stringify(expenses));
        // Update expenditureValue and balanceValue
        expenditureValue.innerText = parseInt(expenditureValue.innerText) + newAmount;
        let expend = parseInt(expenditureValue.innerText);
        localStorage.setItem("expense", expend);
        balanceValue.innerText = tempAmount - expend;
        let bal = parseInt(balanceValue.innerText);
        localStorage.setItem("balance", bal);
        // Update the UI if needed
        let existingSublistContent = list.children[existingExpenseIndex];
        existingSublistContent.querySelector(".amount").innerText = expenses[existingExpenseIndex].value;
        // Display the success notification
        displayNotification('Ajout de depenses', 'Votre depense a été ajouté avec success');
    } else {
        // Add a new expense
        let expenditure = parseInt(userAmount.value);
        let sum = parseInt(expenditureValue.innerText) + expenditure;
        expenditureValue.innerText = sum;
        localStorage.setItem("expense", sum);
        const totalBalance = tempAmount - sum;
        balanceValue.innerText = totalBalance;
        localStorage.setItem("balance", totalBalance);
        listCreator(productTitle.value, userAmount.value);

        expenses.push({ name: productTitle.value, value: parseInt(userAmount.value) });
        localStorage.setItem("expenses", JSON.stringify(expenses));
        displayNotification('Ajout de depenses', 'Votre depense a été ajouté avec success');
    }
    // Empty inputs
    productTitle.value = "";
    userAmount.value = "";
});
//======================== Add Expense ==============================
// Hassane Abdel-Razak
//======================== Create list ==============================
const listCreator = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list.appendChild(sublistContent);
    sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "1.2rem";
    editButton.style.border = "none";
    editButton.style.color = "blue";
    editButton.style.backgroundColor = "white";

    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash", "delete");
    deleteButton.style.fontSize = "1.2rem";
    deleteButton.style.border = "none";
    deleteButton.style.color = "red";
    deleteButton.style.backgroundColor = "white";
    deleteButton.addEventListener("click", () => {
        deletExpenses(expenseName, expenseValue);
    });
    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    document.getElementById("list").appendChild(sublistContent);
};
//======================== Create list ==============================

//=========================== delete expenses========================

function deletExpenses(nomDepense, montantSupprime) {
    let parentDiv = null;

    // Parcourir les éléments de la liste pour trouver la dépense à supprimer
    list.querySelectorAll(".sublist-content").forEach(element => {
        if (element.querySelector(".product").innerText === nomDepense) {
            parentDiv = element;
            return;
        }
    });

    if (parentDiv) {
        expenses = expenses.filter(depense => depense.name !== nomDepense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        expenditureValue.innerText = parseInt(expenditureValue.innerText) - montantSupprime;
        localStorage.setItem("expense", parseInt(expenditureValue.innerText));

        const nouveauSolde = tempAmount - parseInt(expenditureValue.innerText);
        balanceValue.innerText = nouveauSolde;
        localStorage.setItem("balance", nouveauSolde);

        // Supprimer le parentDiv (la ligne de dépense) de la liste
        parentDiv.remove();
    }
    window.location.href = window.location.href;
}
//===================== delete expense ==============================

//================== Modify List Elements ===========================
const modifyElement = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let parentAmount = parentDiv.querySelector(".amount").innerText;

    if (edit) {
        let parentText = parentDiv.querySelector(".product").innerText;
        let newAmount = parseInt(userAmount.value);

        productTitle.value = parentText;
        userAmount.value = parentAmount;

        // Soustraire le montant actuel de la dépense totale
        expenditureValue.innerText = parseInt(expenditureValue.innerText) - parseInt(parentAmount);
        localStorage.setItem("expense", parseInt(expenditureValue.innerText));

        // Ajouter le montant au solde
        balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);
        localStorage.setItem("balance", parseInt(balanceValue.innerText));


        // Supprimer la ligne de dépense de la liste
        parentDiv.remove();

        // Mettre à jour la liste des dépenses dans le localstorage
        expenses = expenses.filter(depense => depense.name !== parentText);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }
};
//================== Modify List Elements ===========================
// Hassane Abdel-Razak
//================== notification display ===========================
function displayNotification(titre, message) {
    const notificationElement = document.createElement("div"); // Create a new notification element
    notificationElement.id = "budget-notification";
    notificationElement.className = "container notification";

    const content = `<p class="titre">${titre}</p><p class="message">${message}</p>`;
    notificationElement.innerHTML = content;
    document.body.appendChild(notificationElement); // Append the notification element to the body
    notificationElement.style.display = "block";
    setTimeout(() => {
        notificationElement.style.display = "none"; // Hide the notification element after 3000 milliseconds
        window.location.href = window.location.href;
    }, 3000);

}
//================== notification display ===========================

//================== color générator ===========================
function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const randomColor = "#" + Math.floor(Math.random() * 16777216).toString(16);
        colors.push(randomColor);
        console.log(i);
    }
    return colors;
}
//================== color générator ===========================


document.addEventListener("DOMContentLoaded", function () {

    // Load budget from localStorage
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");
    const savedExpense = localStorage.getItem("expense");

    let expenseNames = [];
    let expenseAmounts = [];
    let randomColors = ['FFEBCD', '#0000FF', '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0', '#D2691E', '#006400', '#483D8B'];
    if (savedBudget) {
        tempAmount = parseInt(savedBudget);
        amount.innerHTML = tempAmount;
        balanceValue.innerHTML = tempAmount - parseInt(savedExpense);
    }

    // Load expenses from localStorage

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        expenses.forEach(expense => {
            listCreator(expense.name, expense.value);
        });
    }
    if (savedExpense) {
        expense = parseInt(savedExpense);
        expenditureValue.innerHTML = expense;
        // balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);
    }

    // Load saved balance from localStorage
    const savedBalance = localStorage.getItem("balance");
    if (savedBalance) {
        balanceValue.innerText = savedBalance;
    }
    // ========================================
    // Créer un tableau pour stocker les noms de dépenses et les montants
    expenses.forEach(expense => {
        expenseNames.push(expense.name);
        expenseAmounts.push(expense.value);
    });
    /*  // ======================     color     ====================================
     // Chargez les randomColors depuis le localStorage
     let savedRandomColors = localStorage.getItem("randomColors");
     if (savedRandomColors) {
         randomColors = JSON.parse(savedRandomColors);
     } else {
 
         randomColors = generateRandomColors(expenseNames.length); // Appelez une fonction pour générer de nouvelles couleurs aléatoires
        console.log(expenses.length);
         localStorage.setItem("randomColors", JSON.stringify(randomColors)); // Enregistrez les couleurs générées dans le localStorage
     }
     // ======================     color     ====================================
  */
    // ======================     historique     ====================================

    const expenseHistoryList = document.getElementById("expense-history-list");
    expenses.forEach((expense) => {
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("expense-history-item");

        const expenseIndex = document.createElement("p");
        expenseIndex.textContent = `${num++}:`;

        const expenseTitle = document.createElement("p");
        expenseTitle.classList.add("historyTitle");
        expenseTitle.textContent = ` ${expense.name} `;

        const expenseAmount = document.createElement("p");
        expenseAmount.classList.add("historyAmount");
        expenseAmount.textContent = ` ${expense.value} F`;

        expenseItem.appendChild(expenseIndex);
        expenseItem.appendChild(expenseTitle);
        expenseItem.appendChild(expenseAmount);

        expenseHistoryList.appendChild(expenseItem);

    });

    // =========================  hide historique ===================
    const historyButton = document.getElementById("historyButton");
    historyButton.addEventListener("click", () => {
        if (expenseHistoryList.style.display === "none" || historyList.style.display === "") {
            expenseHistoryList.style.display = "block";
        } else {
            expenseHistoryList.style.display = "none";
        }
    });

    // Bouton "Close" pour fermer la liste d'historique
    const closeButton = document.createElement("button");
    closeButton.classList.add("close");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        expenseHistoryList.style.display = "none";
    });
    expenseHistoryList.appendChild(closeButton);
    // ======================     historique     ====================================

    // Créer le graphique de type "doughnut" avec des couleurs aléatoires
    const ctx = document.getElementById("expenseChart").getContext("2d");

    const expenseChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: expenseNames,
            datasets: [{
                data: expenseAmounts,
                backgroundColor: ['FFEBCD', '#0000FF',
                    '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0',
                    '#D2691E', '#006400', '#483D8B'],
                hoverBackgroundColor: ['FFEBCD', '#0000FF',
                    '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0',
                    '#D2691E', '#006400', '#483D8B'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });
    // ========================================
});

// Hassane Abdel-Razak
