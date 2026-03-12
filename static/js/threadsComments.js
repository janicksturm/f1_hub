const threadTitleDisplay = document.getElementById('thread-title-display');
const threadContentDisplay = document.getElementById('thread-content-display');
const threadMetaDisplay = document.getElementById('thread-meta');
const commentsList = document.getElementById('comments-list');
const commentCountDisplay = document.getElementById('comment-count');


function getThreadId() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1];
}

const THE_THREAD_ID = getThreadId();

function loadThread() {
    fetch(`/api/threads/${THE_THREAD_ID}`)
        .then(res => res.json())
        .then(data => {
            if (data.thread) {
                const thread = data.thread;
                threadTitleDisplay.textContent = thread[2];
                threadContentDisplay.textContent = thread[3] || 'No content provided.';
                threadMetaDisplay.innerHTML = `Posted by <span class="font-semibold text-gray-800">${thread[5]}</span> on ${thread[4]}`;
            } else {
                threadTitleDisplay.textContent = 'Thread not found';
            }
        })
        .catch(err => console.error("Error fetching thread:", err));
}

function loadComments() {
    fetch(`/api/threads/${THE_THREAD_ID}/comments`)
        .then(res => res.json())
        .then(data => {
            commentsList.innerHTML = '';
            if (data.comments) {
                commentCountDisplay.textContent = data.comments.length;
                if (data.comments.length > 0) {
                    data.comments.forEach(comment => {
                        const li = document.createElement('li');
                        li.className = "px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150";
                        li.innerHTML = `
                            <div class="flex space-x-3">
                                <div class="flex-1 space-y-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <h3 class="text-sm font-bold text-gray-900">${comment[5]}</h3>
                                        <p class="text-xs text-gray-500">${comment[4]}</p>
                                    </div>
                                    <p class="text-sm text-gray-700 whitespace-pre-wrap">${comment[3]}</p>
                                </div>
                            </div>
                        `;
                        commentsList.appendChild(li);
                    });
                } else {
                    commentsList.innerHTML = `<li class="px-4 py-8 text-center text-sm text-gray-500">No comments yet. Be the first to reply!</li>`;
                }
            }
        })
        .catch(err => console.error("Error fetching comments:", err));
}

document.addEventListener('DOMContentLoaded', () => {
    loadThread();
    loadComments();
});
