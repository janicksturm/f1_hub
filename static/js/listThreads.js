const btn = document.getElementById('new-thread-btn');
const threadsContainer = document.getElementById('threads');
const modal = document.getElementById('new-thread');
const closeBtn = document.getElementById('cancel-thread-btn');
const titleInput = document.getElementById('thread-title');
const contentInput = document.getElementById('thread-content');
const form = document.getElementById('new-thread-form');

function openModal() {
    modal.classList.remove('hidden');
    titleInput.focus();
}

function closeModal() {
    modal.classList.add('hidden');
    titleInput.value = '';
    contentInput.value = '';
}

btn.addEventListener('click', () => {
    fetch("/api/session")
        .then(response => response.json())
        .then(data => {
            if (!data.user_id) {
                alert('Please login to create a thread');
                return;
            }
            openModal();
        })
        .catch(err => {
            console.error("Error checking session:", err);
        });
});

closeBtn.addEventListener('click', closeModal);

function getThreads() {
    fetch("/api/threads")
        .then(response => response.json())
        .then(data => {
            threadsContainer.innerHTML = '';
            if (data.threads) {
                data.threads.forEach(thread => {
                    const threadElement = document.createElement('li');
                    threadElement.innerHTML = `
                        <a href="#" id="thread-link" class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                            <div class="px-4 py-4 sm:px-6">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm leading-5 font-medium text-red-600 truncate">
                                        ${thread[2]}
                                    </div>
                                    <div class="ml-2 flex-shrink-0 flex">
                                        <span class="px-2 inline-flex text-xs font-semibold">
                                            ${thread[4]}
                                        </span>
                                        <span class="px-2 inline-flex text-xs font-semibold text-gray-500">
                                            By ${thread[5]}
                                        </span>
                                    </div>
                                </div>
                                <div class="mt-2 text-sm leading-5 text-gray-500">
                                    ${thread[3]}
                                </div>
                            </div>
                        </a>
                    `;
                    threadElement.className = "border-b border-gray-200";

                    threadElement.querySelector("#thread-link")
                        .addEventListener("click", (e) => {
                            e.preventDefault();
                            window.location.href = `/forum/thread/${thread[0]}`;
                        });

                    threadsContainer.appendChild(threadElement);
                });
            }
        })
        .catch(err => {
            console.error("Error fetching threads:", err);
        });
}
getThreads();