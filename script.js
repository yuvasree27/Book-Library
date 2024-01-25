var library = JSON.parse(localStorage.getItem('library')) || [];
var borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || [];
var returnHistory = JSON.parse(localStorage.getItem('returnHistory')) || [];

// Function to initialize the library, borrowingHistory, and returnHistory arrays
function initializeLibrary() {
    // Add some initial books if the library is empty
    if (library.length === 0) {
        library.push({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', borrowed: false });
        library.push({ title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', borrowed: false });
        library.push({ title: '1984', author: 'George Orwell', category: 'Science Fiction', borrowed: false });
        library.push({ title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', borrowed: false });
    }

    // Save to local storage
    saveToLocalStorage();
}

// Initialize library on page load
initializeLibrary();

function saveToLocalStorage() {
    localStorage.setItem('library', JSON.stringify(library));
    localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory));
    localStorage.setItem('returnHistory', JSON.stringify(returnHistory));
}

function clearBorrowingHistory() {
   if (confirm('Are you sure you want to clear the borrowing history?')) {
       borrowingHistory = [];
       updateBorrowingHistory();
       saveToLocalStorage();
   }
}

function clearReturnHistory() {
   if (confirm('Are you sure you want to clear the return history?')) {
       returnHistory = [];
       updateReturnHistory();
       saveToLocalStorage();
   }
}

function addBook() {
   var title = document.getElementById('title').value;
   var author = document.getElementById('author').value;
   var category = document.getElementById('category').value;

   if (title && author && category) {
       var book = { title, author, category, borrowed: false };
       library.push(book);

       updateBookList();
       // Clear the form
       document.getElementById('title').value = '';
       document.getElementById('author').value = '';
       document.getElementById('category').value = '';
   } else {
       alert('Please fill in all the fields.');
   }
   saveToLocalStorage();
}

function displayBooks() {
   updateBookList();
}


function promptForStudentName(index) {
   var studentName = prompt('Enter student name:');
   if (studentName) {
       borrowBook(index, studentName);
   }
}


function borrowBook(index, studentName) {
   library[index].borrowed = true;
   library[index].borrowedBy = studentName;
   library[index].borrowedDate = new Date();
   borrowingHistory.push(library[index]);
   updateBorrowingHistory();
   updateBookList();
   saveToLocalStorage();
}

function borrowOrReturnBook(index) {
   if (library[index].borrowed) {
       returnBook(index);
   } else {
       promptForStudentName(index);
   }
}

function returnBook(index) {
   var studentName = prompt('Enter your name:');
   if (studentName) {
       library[index].borrowed = false;
       library[index].returnedBy = studentName;
       library[index].returnDate = new Date();
       returnHistory.push(library[index]);
       updateReturnHistory();
       updateBookList();
       saveToLocalStorage();
   }
}


function removeBook(index) {
   if (confirm('Are you sure you want to remove this book?')) {
       library.splice(index, 1);
       updateBookList();
       saveToLocalStorage();
   }
}

function updateBookList() {
   var table = document.getElementById('bookList');
   table.innerHTML = '';

   for (var i = 0; i < library.length; i++) {
       var book = library[i];
       var newRow = table.insertRow(table.rows.length);
       var cell1 = newRow.insertCell(0);
       var cell2 = newRow.insertCell(1);
       var cell3 = newRow.insertCell(2);
       var cell4 = newRow.insertCell(3);

       cell1.innerHTML = book.title;
       cell2.innerHTML = book.author;
       cell3.innerHTML = book.category;

       if (book.borrowed) {
           cell4.innerHTML = `<button onclick="returnBook(${i})">Return by ${book.borrowedBy}</button>`;
       } else {
           cell4.innerHTML = `
               <button onclick="borrowOrReturnBook(${i})">Borrow</button>
               <button onclick="removeBook(${i})">Remove</button>
           `;
       }
   }
}

function updateBorrowingHistory() {
   var historyList = document.getElementById('borrowingHistory');
   historyList.innerHTML = '';

   for (var i = 0; i < borrowingHistory.length; i++) {
       var historyItem = borrowingHistory[i];
       var listItem = document.createElement('li');
       var borrowedDate = new Date(historyItem.borrowedDate);

       listItem.textContent = `${historyItem.title} by ${historyItem.author} - Borrowed by ${historyItem.borrowedBy} on ${borrowedDate.toLocaleString()}`;
       historyList.appendChild(listItem);
   }
}

function updateReturnHistory() {
   var returnHistoryList = document.getElementById('returnHistory');
   returnHistoryList.innerHTML = '';

   for (var i = 0; i < returnHistory.length; i++) {
       var returnItem = returnHistory[i];
       var listItem = document.createElement('li');
       var returnDate = new Date(returnItem.returnDate);

       listItem.textContent = `${returnItem.title} by ${returnItem.author} - Returned by ${returnItem.returnedBy} on ${returnDate.toLocaleString()}`;
       returnHistoryList.appendChild(listItem);
   }
}

function searchBooks() {
   var searchTerm = document.getElementById('searchInput').value.toLowerCase();
   var categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();

   var filteredBooks = library.filter(function(book) {
       var titleMatch = book.title.toLowerCase().includes(searchTerm);
       var authorMatch = book.author.toLowerCase().includes(searchTerm);
       var categoryMatch = categoryFilter === '' || book.category.toLowerCase() === categoryFilter;

       return titleMatch || authorMatch && categoryMatch;
   });

   // Update the book list with the filtered results
   var table = document.getElementById('bookList');
   table.innerHTML = '';
   for (var i = 0; i < filteredBooks.length; i++) {
       var book = filteredBooks[i];
       var newRow = table.insertRow(table.rows.length);
       var cell1 = newRow.insertCell(0);
       var cell2 = newRow.insertCell(1);
       var cell3 = newRow.insertCell(2);
       var cell4 = newRow.insertCell(3);

       cell1.innerHTML = book.title;
       cell2.innerHTML = book.author;
       cell3.innerHTML = book.category;

       if (book.borrowed) {
           cell4.innerHTML = '<button onclick="returnBook(' + library.indexOf(book) + ')">Return</button>';
       } else {
           cell4.innerHTML = '<button onclick="borrowBook(' + library.indexOf(book) + ')">Borrow</button>';
       }
   }
}

displayBooks(); // Display initial set of books