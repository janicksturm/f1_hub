document.addEventListener('DOMContentLoaded', () => {
    console.log('F1 Hub Loaded');

    // Determine current page to run specific logic
    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === 'index.html' || page === '') {
        loadNews();
    } else if (page === 'forum.html') {
        loadForumThreads();
        setupNewThreadButton();
    } else if (page === 'login.html') {
        setupAuthForm('Login');
    } else if (page === 'register.html') {
        setupAuthForm('Register');
    } else if (page === 'success.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username') || 'Racer';
        const display = document.getElementById('username-display');
        if (display) display.textContent = username;
    }
});

function setupAuthForm(type) {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (type === 'Register') {
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                try {
                    // For a real app, you'd POST to an API.
                    // Here we just redirect to simulate success

                    // Optional: If using a real json-server, you could actually POST:
                    /*
                    await fetch('http://localhost:3000/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, email })
                    });
                    */
                    window.location.href = `success.html?username=${encodeURIComponent(username)}`;

                } catch (error) {
                    console.error('Registration failed:', error);
                    alert('Registration failed!');
                }

            } else {
                // Login Flow
                const email = document.getElementById('email').value;
                alert(`${type} successful for ${email}! Redirecting to home...`);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
}

async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    try {
        const response = await fetch('http://localhost:8000/news');

        const data = await response.json();
        const news = data.news;

        newsContainer.innerHTML = news.map(item => `
            <li class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="block focus:outline-none focus:bg-gray-50">
                    <div class="w-full flex items-center justify-between p-6 space-x-6">
                        <div class="flex-1 truncate">
                            <div class="flex items-center space-x-3">
                                <h3 class="text-gray-900 text-sm leading-5 font-medium truncate">${item.title}</h3>
                                <span class="flex-shrink-0 inline-block px-2 py-0.5 text-blue-800 text-xs leading-4 font-medium bg-blue-100 rounded-full">${item.source}</span>
                            </div>
                            <p class="mt-1 text-gray-500 text-sm leading-5 truncate">${item.description}</p>
                        </div>
                    </div>
                </a>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

async function loadForumThreads() {
    const threadsContainer = document.querySelector('ul'); // Targeting the list in forum.html
    if (!threadsContainer) return;

    try {
        const response = await fetch('../db.json');
        const data = await response.json();
        const threads = data.threads;

        threadsContainer.innerHTML = threads.map(thread => `
            <li class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                <a href="#" class="block focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                    <div class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="text-sm leading-5 font-medium text-red-600 truncate">
                                ${thread.title}
                            </div>
                            <div class="ml-2 flex-shrink-0 flex">
                                ${thread.active ? `
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>` : ''}
                            </div>
                        </div>
                        <div class="mt-2 sm:flex sm:justify-between">
                            <div class="sm:flex">
                                <div class="mr-6 flex items-center text-sm leading-5 text-gray-500">
                                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
                                    </svg>
                                    ${thread.author}
                                </div>
                                <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
                                     <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                       <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"/>
                                     </svg>
                                    ${thread.replies} replies
                                </div>
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
                                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                </svg>
                                <span>
                                    Last post <time>${thread.lastPost}</time>
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error loading threads:', error);
    }
}

function setupNewThreadButton() {
    const btn = document.querySelector('button.bg-red-600');
    if (btn) {
        btn.addEventListener('click', () => {
            const title = prompt("Enter thread title:");
            if (title) {
                // In a real app, POST to API. Here we just mock DOM update.
                const threadsContainer = document.querySelector('ul');
                const newThreadHTML = `
                    <li class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out animate-pulse">
                        <a href="#" class="block focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                            <div class="px-4 py-4 sm:px-6">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm leading-5 font-medium text-red-600 truncate">
                                        ${title}
                                    </div>
                                    <div class="ml-2 flex-shrink-0 flex">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            New
                                        </span>
                                    </div>
                                </div>
                                <div class="mt-2 sm:flex sm:justify-between">
                                    <div class="sm:flex">
                                        <div class="mr-6 flex items-center text-sm leading-5 text-gray-500">
                                            You
                                        </div>
                                    </div>
                                    <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
                                        <span>Just now</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                 `;
                threadsContainer.insertAdjacentHTML('afterbegin', newThreadHTML);
            }
        });
    }
}
